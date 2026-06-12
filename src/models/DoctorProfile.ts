import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDoctorProfile extends Document {
  userId: Types.ObjectId;
  specialization: string;
  degree: string;
  experience: number;
  hospital: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: string[];
  rating: number;
  totalPatients: number;
  profileComplete: boolean;
  image?: string;
}

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, default: "" },
    degree: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    hospital: { type: String, default: "" },
    bio: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    availableDays: { type: [String], default: [] },
    availableTimeSlots: { type: [String], default: [] },
    rating: { type: Number, default: 4.5 },
    totalPatients: { type: Number, default: 0 },
    profileComplete: { type: Boolean, default: false },
    image: { type: String },
  },
  { timestamps: true }
);

export const DoctorProfile: Model<IDoctorProfile> =
  mongoose.models.DoctorProfile ??
  mongoose.model<IDoctorProfile>("DoctorProfile", DoctorProfileSchema);

export function formatDoctorProfile(profile: IDoctorProfile) {
  return {
    userId: profile.userId.toString(),
    specialization: profile.specialization,
    degree: profile.degree,
    experience: profile.experience,
    hospital: profile.hospital,
    bio: profile.bio,
    consultationFee: profile.consultationFee,
    availableDays: profile.availableDays,
    availableTimeSlots: profile.availableTimeSlots,
    rating: profile.rating,
    totalPatients: profile.totalPatients,
    profileComplete: profile.profileComplete,
    image: profile.image,
  };
}
