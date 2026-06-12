import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { DoctorProfile } from "@/models/DoctorProfile";
import { Appointment } from "@/models/Appointment";
import { requireAuth } from "@/lib/api/auth-guard";
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
    const date = req.nextUrl.searchParams.get("date");

    if (!date) return error("Date query parameter is required");

    const profile = await DoctorProfile.findOne({ userId: id, profileComplete: true });
    if (!profile) return error("Doctor not found", 404);

    const booked = await Appointment.find({
      doctorId: id,
      date,
      status: { $ne: "cancelled" },
    }).select("timeSlot");

    const bookedSlots = booked.map((a) => a.timeSlot);
    const availableSlots = profile.availableTimeSlots.filter(
      (s) => !bookedSlots.includes(s)
    );

    return success({ date, availableSlots, consultationFee: profile.consultationFee });
  } catch (err) {
    console.error("Slots error:", err);
    return error("Failed to fetch slots", 500);
  }
}
