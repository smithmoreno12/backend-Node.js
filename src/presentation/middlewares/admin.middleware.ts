import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../domain";

export class AdminMiddleware {
  static validateAdminRole(req: Request, res: Response, next: NextFunction) {
    const user: UserEntity = req.body.user;

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized - no user in request" });
    }

    if (!user.role.includes("ADMIN_ROLE")) {
      return res
        .status(403)
        .json({ error: "Forbidden - Admin role required" });
    }

    next();
  }
}
