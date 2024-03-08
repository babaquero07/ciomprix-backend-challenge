import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { COOKIE_NAME } from "./constants.js";

config();

const JWT_SECRET = process.env.JWT_SECRET;

export const createToken = (
  userId: string,
  email: string,
  role: string,
  expiresIn: string
) => {
  const payload = { userId, email, role };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });

  return token;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      if (err) {
        reject(err);
        return res.status(401).json({ message: "Token expired" });
      } else {
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};
