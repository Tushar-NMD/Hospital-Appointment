import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { DoctorProfile } from "@/models/DoctorProfile";
import { requireAuth } from "@/lib/api/auth-guard";
import { doctorWithProfile } from "@/lib/api/serialize";
import { success, error } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    await connectDB();
    const { id } = await params;

    const user = await User.findOne({ _id: id, role: "doctor" });
    if (!user) return error("Doctor not found", 404);

    const profile = await DoctorProfile.findOne({ userId: user._id, profileComplete: true });
    if (!profile) return error("Doctor profile not available", 404);

    return success(doctorWithProfile(user, profile));
  } catch (err) {
    console.error("Doctor detail error:", err);
    return error("Failed to fetch doctor", 500);
  }
}
