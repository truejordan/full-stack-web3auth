import express from "express";
import sql from "../config/database";
import { User, CreateUserRequest, UpdateUserRequest } from "../types/user";
import { checkJwt, checkOwnership } from "../middleware/jwt";
import { requireRole } from "../middleware/roleAuth";


const router = express.Router();

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/:id - Get user by ID
router.get("/:id", async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const users = await sql`SELECT * FROM users WHERE id = ${id}`;

    if (users.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

//GET /api/users/:username - Get user by user name
router.get("/:username", async (req, res): Promise<void> => {
  try {
    const { username } = req.params;
    const users = await sql`SELECT * FROM users WHERE username = ${username}`;

    if (users.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ success: true, data: users[0] });
  }
  catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET /api/users/search?q=...&limit=...&mode=prefix|contains|fuzzy
router.get("/search", async (req, res): Promise<void> => {
  try {
    const { q, limit = "10", mode = "prefix" } = req.query as {
      q?: string;
      limit?: string;
      mode?: "prefix" | "contains" | "fuzzy";
    };

    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Search query parameter 'q' is required" });
      return;
    }

    const term = q.trim();
    if (term.length < 2) {
      // keep tiny inputs from scanning the table; your UI will debounce anyway
      res.json({ success: true, data: [], mode: "prefix" });
      return;
    }

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const searchMode: "prefix" | "contains" | "fuzzy" =
      mode === "contains" || mode === "fuzzy" ? mode : "prefix";

    let users;
    if (searchMode === "fuzzy") {
      // requires pg_trgm extension + GIN index on lower(username)
      users = await sql/*sql*/`
        SELECT id, username, name, avatar,
               similarity(lower(username), lower(${term})) AS score
        FROM users
        WHERE lower(username) % lower(${term})
        ORDER BY score DESC, username
        LIMIT ${safeLimit}
      `;
    } else if (searchMode === "contains") {
      const pattern = `%${term}%`;
      users = await sql/*sql*/`
        SELECT id, username, name, avatar
        FROM users
        WHERE username ILIKE ${pattern}
        ORDER BY username
        LIMIT ${safeLimit}
      `;
    } else {
      // prefix (default)
      const pattern = `${term}%`;
      users = await sql/*sql*/`
        SELECT id, username, name, avatar
        FROM users
        WHERE username ILIKE ${pattern}
        ORDER BY username
        LIMIT ${safeLimit}
      `;
    }

    res.json({ success: true, mode: searchMode, data: users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// POST /api/users - Create new user
router.post("/", checkJwt, async (req, res): Promise<void> => {
  try {
    const tokenEmail = req.auth?.payload?.['email']; // get email from jwt

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${tokenEmail}`;
    
    if (existingUser.length > 0) {
      res.status(409).json({
        error: "User already exists with this email",
      });
      return;
    }

    // create user
    const newUser = await sql`
      INSERT INTO users (email)
      VALUES (${tokenEmail})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: newUser[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT /api/users/:id - Update user
router.put("/:id", checkJwt, checkOwnership,  async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userData: UpdateUserRequest = req.body;

    const updatedUser = await sql`
      UPDATE users 
      SET username = COALESCE(${userData.username}, username),
          name = COALESCE(${userData.name}, name),
          email = COALESCE(${userData.email}, email),
          avatar = COALESCE(${userData.avatar}, avatar),
          bio = COALESCE(${userData.bio}, bio),
          gender = COALESCE(${userData.gender}, gender)
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedUser.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ success: true, data: updatedUser[0] });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error instanceof Error && error.message.includes("unique")) {
      res.status(409).json({
        error: "Username or email already exists",
      });
      return;
    }

    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /api/users/:id - Delete user
router.delete("/:id", checkJwt, checkOwnership, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedUser = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING *
    `;

    if (deletedUser.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
