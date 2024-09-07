import Mover, { MoverType } from "../models/mover";
import express, { Request, Response } from "express";
import cloudinary from "cloudinary";

declare module "express-serve-static-core" {
  interface Request {
    files?: {
      [fieldname: string]: Express.Multer.File[];
    };
  }
}

async function uploadFile(file: Express.Multer.File): Promise<string> {
  try {
    if (file.mimetype.startsWith("image/")) {
      // Handle image uploads
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.v2.uploader.upload(dataURI);
      if (uploadResult && uploadResult.url) {
        return uploadResult.url;
      } else {
        throw new Error("Upload result does not contain a URL.");
      }
    } else {
      // Handle non-image uploads (e.g., PDFs)
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            { resource_type: "auto", public_id: file.originalname },
            (error, result) => {
              if (error) return reject(error);
              if (result && result.url) {
                resolve(result.url);
              } else {
                reject(new Error("Upload result does not contain a URL."));
              }
            }
          )
          .end(file.buffer);
      });
    }
  } catch (error) {
    console.error("Cloudinary upload error: ", error);
    throw new Error("Error uploading file");
  }
}

export const becomeMover = async (req: Request, res: Response) => {
  try {
    const newMover: MoverType = req.body;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files.businessRegistrationDocument) {
      newMover.businessRegistrationDocument = await uploadFile(
        files.businessRegistrationDocument[0]
      );
    }
    if (files.governmentIssuedIdFront) {
      newMover.governmentIssuedIdFront = await uploadFile(
        files.governmentIssuedIdFront[0]
      );
    }
    if (files.governmentIssuedIdBack) {
      newMover.governmentIssuedIdBack = await uploadFile(
        files.governmentIssuedIdBack[0]
      );
    }
    if (files.insuranceDocument) {
      newMover.insuranceDocument = await uploadFile(files.insuranceDocument[0]);
    }
    if (files.companyLogo) {
      newMover.companyLogo = await uploadFile(files.companyLogo[0]);
    }

    newMover.verified = false;
    newMover.createdAt = new Date();
    newMover.updatedAt = new Date();

    const mover = new Mover(newMover);
    await mover.save();

    res.status(201).send(mover);
  } catch (error) {
    console.log("Error creating mover: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
