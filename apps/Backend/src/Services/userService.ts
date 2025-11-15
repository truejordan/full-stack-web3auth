import { supabase } from "../config/supabase";
import type { Database } from "../types/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
type user_gender = Database["public"]["Enums"]["user_gender"];

/**
 * Get all users
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch users");
  }

  return data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error("User not found");
    }
    throw new Error(error.message || "Failed to fetch user");
  }

  if (!data) {
    throw new Error("User not found");
  }

  return data;
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error("User not found");
    }
    throw new Error(error.message || "Failed to fetch user");
  }

  if (!data) {
    throw new Error("User not found");
  }

  return data;
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to fetch user");
  }

  return data;
};

/**
 * Search users by username
 */
export const searchUsers = async (
  query: string,
  limit: number = 10,
  mode: "prefix" | "contains" | "fuzzy" = "prefix"
) => {
  const term = query.trim();
  if (term.length < 2) {
    return [];
  }

  const safeLimit = Math.min(Math.max(limit, 1), 50);
  let result;

  if (mode === "fuzzy" || mode === "contains") {
    const pattern = `%${term}%`;
    result = await supabase
      .from("users")
      .select("id, username, name, email")
      .ilike("username", pattern)
      .order("username", { ascending: true })
      .limit(safeLimit);
  } else {
    // prefix (default)
    const pattern = `${term}%`;
    result = await supabase
      .from("users")
      .select("id, username, name, email")
      .ilike("username", pattern)
      .order("username", { ascending: true })
      .limit(safeLimit);
  }

  if (result.error) {
    throw new Error(result.error.message || "Failed to search users");
  }

  return result.data || [];
};

/**
 * Validate username format
 */
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  const trimmed = username.trim();

  if (!trimmed || trimmed.length === 0) {
    return { valid: false, error: "Username is required" };
  }

  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(trimmed)) {
    return {
      valid: false,
      error: "Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens",
    };
  }

  return { valid: true };
};

/**
 * Check if username is available
 */
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username.trim())
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to check username availability");
  }

  return !data; // Available if no user found
};

/**
 * Create new user
 */
export const createUser = async (email: string, username: string): Promise<User> => {
  // Validate username
  const validation = validateUsername(username);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const trimmedUsername = username.trim();

  // Check if username is available
  const usernameAvailable = await isUsernameAvailable(trimmedUsername);
  if (!usernameAvailable) {
    throw new Error("Username already exists");
  }

  // Check if user already exists by email
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Create user
  const newUserData: UserInsert = {
    email,
    username: trimmedUsername,
  };

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert(newUserData)
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      throw new Error("Username or email already exists");
    }
    throw new Error(insertError.message || "Failed to create user");
  }

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  return newUser;
};

/**
 * Update user
 */
export const updateUser = async (
  userId: string,
  updates: Partial<UserUpdate>
): Promise<User> => {
  // Filter allowed fields
  const allowedFields: (keyof UserUpdate)[] = [
    'username',
    'name',
    'avatar',
    'bio',
    'gender'
  ];

  const updateData: Partial<UserUpdate> = {};

  // Handle each field explicitly to preserve correct types
  if (updates.username !== undefined) {
    updateData.username = updates.username; // string | undefined
  }
  if (updates.name !== undefined) {
    updateData.name = updates.name; // string | null | undefined
  }
  if (updates.avatar !== undefined) {
    updateData.avatar = updates.avatar; // string | null | undefined
  }
  if (updates.bio !== undefined) {
    updateData.bio = updates.bio; // string | null | undefined
  }
  if (updates.gender !== undefined) {
    updateData.gender = updates.gender; // "MALE" | "FEMALE" | null | undefined
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields to update");
  }

  // Validate username if provided
  if (updateData.username) {
    const validation = validateUsername(updateData.username);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    updateData.username = updateData.username.trim();
  }

  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  if (updateError) {
    if (updateError.code === 'PGRST116') {
      throw new Error("User not found");
    }
    if (updateError.code === '23505') {
      throw new Error("Username already exists");
    }
    throw new Error(updateError.message || "Failed to update user");
  }

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

/**
 * Delete user by email (from JWT)
 */
export const deleteUserByEmail = async (email: string): Promise<void> => {
  // Get user ID from email
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  // Delete user
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", user.id);

  if (deleteError) {
    throw new Error(deleteError.message || "Failed to delete user");
  }
};
