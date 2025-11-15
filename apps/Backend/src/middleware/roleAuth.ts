import * as adminServices from "../Services/adminServices";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.auth?.payload?.['role'] as string
      if (!roles.includes(userRole)) {
        res.status(403).json({ error: "Insufficient permissions" });
        return;
      }
      next();
    };
  };
  

/**
 * Middleware that checks if user is admin and attaches to request
 * Does NOT block - always calls next(), just enriches req with isAdmin flag
 */
export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenEmail = req.auth?.payload?.["email"] as string | undefined;
    
    if (tokenEmail) {
      // Check if user is admin and attach to request
      req.isAdmin = await adminServices.isAdmin(tokenEmail);
    } else {
      req.isAdmin = false;
    }
  } catch (error) {
    // On error, assume not admin but don't block
    req.isAdmin = false;
    console.error("Error checking admin status:", error);
  }
  
  // Always continue - never block
  next();
};
