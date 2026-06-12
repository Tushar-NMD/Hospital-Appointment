import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, formatUser } from "@/models/User";
import { requireAuth } from "@/lib/api/auth-guard";
import { uploadPhoto } from "@/lib/cloudinary";
import { success, error } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    await connectDB();
    const user = await User.findById(auth.payload.userId);
    if (!user) return error("User not found", 404);

    return success({ user: formatUser(user) });
  } catch (err) {
    console.error("Patient GET error:", err);
    return error("Failed to fetch profile", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    await connectDB();
    const { name, phone, photo } = await req.json();

    const updates: Record<string, string> = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (photo) {
      updates.photo = photo.startsWith("data:")
        ? await uploadPhoto(photo)
        : photo;
    }

    const user = await User.findByIdAndUpdate(
      auth.payload.userId,
      updates,
      { new: true }
    );
    if (!user) return error("User not found", 404);

    return success({ user: formatUser(user) });
  } catch (err) {
    console.error("Patient PUT error:", err);
    return error("Failed to update profile", 500);
  }
}
