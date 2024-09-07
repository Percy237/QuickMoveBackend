import { error } from "console";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserType } from "../models/user";
const Mover = require("../models/mover");
const User = require("../models/user");

const ROLES = {
  MOVER: "mover",
  CUSTOMER: "customer",
  ADMIN: "admin",
};

declare global {
  namespace Express {
    interface Request {
      user: UserType;
      role?: String;
    }
  }
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ error: "Missing or malformed token." });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    const userId = (decoded as JwtPayload).userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user;
    req.role = user.role;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Please authenticate." });
  }
};

export default authenticateUser;
