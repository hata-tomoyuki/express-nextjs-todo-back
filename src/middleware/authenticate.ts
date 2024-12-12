import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tokenBlacklist } from "..";
import { SECRET_KEY } from "../config";

export interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  if (tokenBlacklist.has(token)) {
    return res.status(403).json({ error: "Token is no longer valid" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user as { userId: number };
    next();
  });
};

export const expressAuthentication = async (
  request: Request,
  securityName: string,
  _scopes?: string[],
): Promise<any> => {
  if (securityName === "jwt") {
    const authHeader = request.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
  throw new Error("Unsupported security name");
};
