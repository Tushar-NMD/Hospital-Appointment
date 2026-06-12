import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { DoctorProfile, formatDoctorProfile } from "@/models/DoctorProfile";
import { requireAuth } from "@/lib/api/auth-guard";
import { uploadPhoto } from "@/lib/cloudinary";
import { success, error } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["doctor"]);
    if (auth.error) return auth.error;

    await connectDB();
    const profile = await DoctorProfile.findOne({ userId: auth.payload.userId });
    if (!profile) return error("Profile not found", 404);

    return success({ profile: formatDoctorProfile(profile) });
  } catch (err) {
    console.error("Doctor profile GET error:", err);
    return error("Failed to fetch profile", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["doctor"]);
    if (auth.error) return auth.error;

    await connectDB();
    const body = await req.json();
    const {
      specialization,
      degree,
      experience,
      hospital,
      bio,
      consultationFee,
      availableDays,
      availableTimeSlots,
      image,
    } = body;

    if (!specialization || !degree || !hospital || !bio || !availableDays?.length) {
      return error("Please fill all required fields and select available days");
    }
    if (!image) return error("Profile photo is required");

    let imageUrl = image;
    if (image.startsWith("data:")) {
      imageUrl = await uploadPhoto(image);
    }

    const profileData = {
      specialization,
      degree,
      experience: experience ?? 0,
      hospital,
      bio,
      consultationFee: consultationFee ?? 0,
      availableDays,
      availableTimeSlots: availableTimeSlots ?? [],
      image: imageUrl,
      profileComplete: true,
    };

    const profile = await DoctorProfile.findOneAndUpdate(
      { userId: auth.payload.userId },
      profileData,
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(auth.payload.userId, { photo: imageUrl });

    return success({ profile: formatDoctorProfile(profile) });
  } catch (err) {
    console.error("Doctor profile PUT error:", err);
    return error("Failed to update profile", 500);
  }
}
