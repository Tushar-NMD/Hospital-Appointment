import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, formatUser } from "@/models/User";
import { DoctorProfile } from "@/models/DoctorProfile";
import { hashPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { uploadPhoto } from "@/lib/cloudinary";
import { success, error } from "@/lib/api/response";
import { setAuthCookie } from "@/lib/api/cookies";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, phone, role, photo } = body;

    if (!name || !email || !password || !phone || !role) {
      return error("All fields are required");
    }
    if (name.length < 5 || name.length > 20) {
      return error("Name must be 5-20 characters");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error("Invalid email format");
    }
    if (!phone.startsWith("+91") || phone.replace("+91", "").length !== 10) {
      return error("Phone must be +91 followed by 10 digits");
    }
    if (password.length !== 5) {
      return error("Password must be exactly 5 characters");
    }
    if (!["patient", "doctor"].includes(role)) {
      return error("Invalid role");
    }
    if (!photo) {
      return error("Profile photo is required");
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return error("Email already registered", 409);

    let photoUrl = photo;
    if (photo.startsWith("data:")) {
      photoUrl = await uploadPhoto(photo);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: await hashPassword(password),
      phone,
      role,
      photo: photoUrl,
    });

    if (role === "doctor") {
      await DoctorProfile.create({
        userId: user._id,
        image: photoUrl,
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = success({ user: formatUser(user), token }, 201);
    return setAuthCookie(res, token);
  } catch (err) {
    console.error("Register error:", err);
    const message = err instanceof Error ? err.message : "Registration failed";
    return error(message, 500);
  }
}
