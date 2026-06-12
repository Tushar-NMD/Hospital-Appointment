import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, formatUser } from "@/models/User";
import { DoctorProfile, formatDoctorProfile } from "@/models/DoctorProfile";
import { requireAuth } from "@/lib/api/auth-guard";
import { success, error } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await connectDB();
    const user = await User.findById(auth.payload.userId);
    if (!user) return error("User not found", 404);

    const data: Record<string, unknown> = { user: formatUser(user) };

    if (user.role === "doctor") {
      const profile = await DoctorProfile.findOne({ userId: user._id });
      if (profile) data.doctorProfile = formatDoctorProfile(profile);
    }

    return success(data);
  } catch (err) {
    console.error("Me error:", err);
    return error("Failed to fetch user", 500);
  }
}
