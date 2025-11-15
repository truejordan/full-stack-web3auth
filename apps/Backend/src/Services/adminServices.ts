import { supabase } from "../config/supabase";

/**
 * Check if user is admin by looking up in admins table
 */
export const isAdmin = async (email: string): Promise<boolean> => {
  try {
    // Join admins with users table using the foreign key relationship
    // admins.user_id -> users.id
    const { data, error } = await supabase
      .from("admins")
      .select("user_id, users!inner(email)")
      .eq("users.email", email)
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return !!data; // Returns true if admin exists with that email, false otherwise
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
