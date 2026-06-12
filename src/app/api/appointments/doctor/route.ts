import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment, formatAppointment } from "@/models/Appointment";
import { User } from "@/models/User";
import { requireAuth } from "@/lib/api/auth-guard";
import { success, error } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["doctor"]);
    if (auth.error) return auth.error;

    await connectDB();
    const date = req.nextUrl.searchParams.get("date");

    const filter: Record<string, unknown> = { doctorId: auth.payload.userId };
    if (date) filter.date = date;

    const appointments = await Appointment.find(filter).sort({ serialNumber: 1 });

    const active = appointments.filter((a) => a.status !== "cancelled");
    const stats = {
      total: appointments.length,
      waiting: appointments.filter((a) => a.status === "waiting").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      inProgress: appointments.filter((a) => a.status === "in-progress").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      paymentPending: active.filter((a) => a.paymentStatus === "pending").length,
      paymentCollected: active
        .filter((a) => a.paymentStatus === "paid")
        .reduce((sum, a) => sum + a.consultationFee, 0),
    };

    const patientIds = [...new Set(appointments.map((a) => a.patientId.toString()))];
    const patients = await User.find({ _id: { $in: patientIds } }).select("photo");
    const photoMap = new Map(patients.map((p) => [p._id.toString(), p.photo]));

    return success({
      appointments: appointments.map((a) => ({
        ...formatAppointment(a),
        patientPhoto: photoMap.get(a.patientId.toString()),
      })),
      stats,
    });
  } catch (err) {
    console.error("Doctor appointments error:", err);
    return error("Failed to fetch appointments", 500);
  }
}
