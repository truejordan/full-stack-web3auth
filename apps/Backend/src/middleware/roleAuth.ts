import { Request, Response, NextFunction } from "express";
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
  
  // Admin only route
  // router.delete("/users/:id", checkJwt, requireRole("admin"), (req, res) => {
    // Only admins can delete any user
  // });