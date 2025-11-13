import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import sql from "../config/database";

const supabaseUrl = process.env["SUPABASE_URL"] as string;

export const checkJwt = auth({
  audience: "authenticated", // supabase uses 'authenticated' as audience for the JWT
  issuerBaseURL: `${supabaseUrl}/auth/v1`,
});

// Middleware to check ownership
export const checkOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenEmail = req.auth?.payload?.["email"]; // get email from auth0 token

  try {
    const user = await sql`SELECT * FROM users WHERE email = ${tokenEmail}`;

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: "Database error" });
  }
};

// Usage in routes
// router.delete("/users/:id", checkJwt, checkOwnership, (req, res) => {
// User can only delete their own account
// });
