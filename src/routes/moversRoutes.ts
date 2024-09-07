// import express, { Request, Response } from "express";
// import multer from "multer";
// import cloudinary from "cloudinary";
// import Mover, { MoverType } from "../models/mover";
// import verifyToken from "../middleware/auth";

// declare module "express-serve-static-core" {
//   interface Request {
//     files?: {
//       [fieldname: string]: Express.Multer.File[];
//     };
//   }
// }

// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });

// async function uploadFile(file: Express.Multer.File) {
//   const b64 = Buffer.from(file.buffer).toString("base64");
//   let dataURI = `data:image/${file.mimetype.split("/")[1]};base64,${b64}`;
//   const res = await cloudinary.v2.uploader.upload(dataURI);
//   return res.url;
// }

// router.post(
//   "/become-mover",

//   upload.fields([
//     { name: "businessRegistrationDocument", maxCount: 1 },
//     { name: "governmentIssuedIdFront", maxCount: 1 },
//     { name: "governmentIssuedIdBack", maxCount: 1 },
//     { name: "insuranceDocument", maxCount: 1 },
//     { name: "companyLogo", maxCount: 1 },
//   ]),
//   async (req: Request, res: Response) => {
//     try {
//       const newMover: MoverType = req.body;
//       const files = req.files as {
//         [fieldname: string]: Express.Multer.File[];
//       };

//       if (files.businessRegistrationDocument) {
//         newMover.businessRegistrationDocument = await uploadFile(
//           files.businessRegistrationDocument[0]
//         );
//       }
//       ``;
//       if (files.governmentIssuedIdFront) {
//         newMover.governmentIssuedIdFront = await uploadFile(
//           files.governmentIssuedIdFront[0]
//         );
//       }
//       if (files.governmentIssuedIdBack) {
//         newMover.governmentIssuedIdBack = await uploadFile(
//           files.governmentIssuedIdBack[0]
//         );
//       }
//       if (files.insuranceDocument) {
//         newMover.insuranceDocument = await uploadFile(
//           files.insuranceDocument[0]
//         );
//       }

//       if (files.companyLogo) {
//         newMover.companyLogo = await uploadFile(files.companyLogo[0]);
//       }

//       newMover.verified = false;

//       newMover.createdAt = new Date();
//       newMover.updatedAt = new Date();

//       const mover = new Mover(newMover);
//       await mover.save();

//       res.status(201).send(mover);
//     } catch (error) {
//       console.log("Error creating mover: ", error);
//       res.status(500).json({ message: "Something went wrong" });
//     }
//   }
// );

import express from "express";
import multer from "multer";
import { becomeMover } from "../controller/moverController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/become-mover",
  upload.fields([
    { name: "businessRegistrationDocument", maxCount: 1 },
    { name: "governmentIssuedIdFront", maxCount: 1 },
    { name: "governmentIssuedIdBack", maxCount: 1 },
    { name: "insuranceDocument", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  becomeMover
);

export default router;

// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Adjust the path as needed

// const authenticateUser = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findOne({ _id: decoded._id });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     req.user = user; // Add user to the request object
//     req.role = user.role; // Add role to the request object
//     next();
//   } catch (error) {
//     res.status(401).send({ error: 'Please authenticate.' });
//   }
// };

// module.exports = authenticateUser;

// const express = require("express");
// const router = new express.Router();
// const authenticateUser = require("../middleware/authenticateUser");
// const Mover = require("../models/Mover"); // Assuming you have a Mover model
// const Customer = require("../models/Customer"); // Assuming you have a Customer model

// router.get("/profile", authenticateUser, async (req, res) => {
//   try {
//     const user = req.user;
//     let userData;

//     if (req.role === "mover") {
//       userData = await Mover.findOne({ userId: user._id });
//     } else if (req.role === "customer") {
//       userData = await Customer.findOne({ userId: user._id });
//     } else {
//       userData = { user, message: "No additional data for this role." };
//     }

//     res.send(userData);
//   } catch (error) {
//     res.status(500).send({ error: "Failed to fetch profile data." });
//   }
// });

// module.exports = router;
