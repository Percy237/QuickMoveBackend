import mongoose, { Schema } from "mongoose";

export type MoverType = {
  businessName: string;
  serviceArea: string;
  description: string;
  businessAddress: string;
  companyLogo: string;
  services: ServiceType[];
  businessRegistrationDocument: string;
  governmentIssuedIdFront: string;
  governmentIssuedIdBack: string;
  insuranceDocument?: string;
  certifications?: string;
  yearsInBusiness: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ServiceType = "Full-Service" | "Self-Service" | "Specialized";

const moverSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  serviceArea: { type: String, required: true },
  description: { type: String, required: true },
  businessAddress: { type: String, required: true },
  businessRegistrationDocument: { type: String, required: true },
  governmentIssuedIdFront: { type: String, required: true },
  governmentIssuedIdBack: { type: String, required: true },
  insuranceDocument: { type: String },
  verified: { type: Boolean, default: false },
  services: {
    type: [String],
    enum: ["Full-Service", "Self-Service", "Specialized"],
    required: true,
  },
  companyLogo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Mover = mongoose.model<MoverType>("Mover", moverSchema);

export default Mover;
