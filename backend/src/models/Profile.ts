// lib/models/Profile.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProfile extends Document {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    profileUrl: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);