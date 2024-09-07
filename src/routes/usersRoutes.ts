import express, { Request, Response, Router } from "express";

import { check, validationResult } from "express-validator";
import authenticateUser from "../middleware/authenticateUser";
import { register } from "../controller/userController";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Passord with 8 or more characters").isLength({ min: 8 }),
    check("phoneNumber", "Phone Number is required").isString(),
    check("address", "Address is required").isString(),
  ],
  register
);

router.get("/profile", authenticateUser);

export default router;
