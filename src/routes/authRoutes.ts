import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import { loginUser, validateToken } from "../controller/authController";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 8 or more characters required").isLength({
      min: 8,
    }),
  ],
  loginUser
);

router.get("/validate-token", verifyToken, validateToken);

export default router;
