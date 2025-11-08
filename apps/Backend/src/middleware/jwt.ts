import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import sql from "../config/database";

/**
 * @see https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
 */

export const checkJwt = auth({
  audience: "https://3xl-auth0/",
  issuerBaseURL: "https://dev-pqfoyphs7qp6u38e.uk.auth0.com/",
  tokenSigningAlg: "RS256",
});

// Middleware to check ownership
export const checkOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const tokenEmail = req.auth?.payload?.['email']; // get email from auth0 token

  try {
    const user = await sql`SELECT * FROM users WHERE email = ${tokenEmail}`

    if (!user || user.length ===0 ){
      return res.status(404).json({error: 'User not found'})
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