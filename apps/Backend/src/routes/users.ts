import express from "express";
import { checkJwt } from "../middleware/jwt";
import { requireRole, checkAdmin } from "../middleware/roleAuth";
import * as userService from "../Services/userService";

const router = express.Router();

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  try {
    const data = await userService.getAllUsers();
    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/:id - Get user by ID
router.get("/userID/:id", async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await userService.getUserById(id);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

//GET /api/users/:username - Get user by user name
router.get("/username/:username", async (req, res): Promise<void> => {
  try {
    const { username } = req.params;
    const data = await userService.getUserByUsername(username);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET /api/users/search?q=...&limit=...&mode=prefix|contains|fuzzy
router.get("/search", async (req, res): Promise<void> => {
  try {
    const {
      q,
      limit = "10",
      mode = "prefix",
    } = req.query as {
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

    const result = await userService.searchUsers(term, safeLimit, searchMode);
    res.json({ success: true, mode: searchMode, data: result });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// POST /api/users - Create new user
router.post("/create", checkJwt, async (req, res): Promise<void> => {
  try {
    const tokenEmail = req.auth?.payload?.["email"] as string; // get email from jwt
    const { username } = req.body;

    if (!tokenEmail) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const newUser = await userService.createUser(tokenEmail, username);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT /api/users/:id - Update user
router.put("/update", checkJwt, async (req, res): Promise<void> => {
  try {
    const tokenEmail = req.auth?.payload?.["email"] as string | undefined;

    if (!tokenEmail) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Get user ID from email
    const user = await userService.getUserByEmail(tokenEmail);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await userService.updateUser(user.id, req.body);
    res.json({ success: true, data: updatedUser });
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
router.delete("/delete", checkJwt, checkAdmin, async (req, res): Promise<void> => {
  try {
    const tokenEmail = req.auth?.payload?.["email"] as string | undefined;

    if (!tokenEmail) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Get target email: from body if provided, otherwise use authenticated user's email
    const targetEmail = req.body.email || tokenEmail;

    // Use the isAdmin flag from middleware
    // If trying to delete someone else, must be admin
    if (targetEmail !== tokenEmail && !req.isAdmin) {
      res.status(403).json({ error: "Only admins can delete other users" });
      return;
    }

    await userService.deleteUserByEmail(tokenEmail);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
