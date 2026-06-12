import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { DoctorProfile } from "@/models/DoctorProfile";
import { requireAuth } from "@/lib/api/auth-guard";
import { doctorWithProfile } from "@/lib/api/serialize";
import { success, error } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    await connectDB();
    const q = req.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";

    const profiles = await DoctorProfile.find({ profileComplete: true });
    const userIds = profiles.map((p) => p.userId);
    const users = await User.find({ _id: { $in: userIds }, role: "doctor" });

    let results = users
      .map((user) => {
        const profile = profiles.find((p) => p.userId.toString() === user._id.toString());
        return profile ? doctorWithProfile(user, profile) : null;
      })
      .filter(Boolean);

    if (q) {
      results = results.filter(
        (d) =>
          d!.user.name.toLowerCase().includes(q) ||
          d!.profile.specialization.toLowerCase().includes(q) ||
          d!.profile.hospital.toLowerCase().includes(q)
      );
    }

    return success({ doctors: results });
  } catch (err) {
    console.error("Doctors list error:", err);
    return error("Failed to fetch doctors", 500);
  }
}
