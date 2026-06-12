import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "patient" | "doctor";
  photo?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["patient", "doctor"], required: true },
    photo: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export function formatUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    photo: user.photo,
    createdAt: user.createdAt.toISOString(),
  };
}
