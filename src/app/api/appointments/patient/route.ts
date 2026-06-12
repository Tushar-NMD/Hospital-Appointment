import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment, formatAppointment } from "@/models/Appointment";
import { requireAuth } from "@/lib/api/auth-guard";
import { success, error } from "@/lib/api/response";
import { buildQueueInfo } from "@/lib/appointment-queue";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    await connectDB();
    const appointments = await Appointment.find({
      patientId: auth.payload.userId,
    }).sort({ createdAt: -1 });

    const queueKeys = new Set<string>();
    for (const apt of appointments) {
      if (!["completed", "cancelled"].includes(apt.status)) {
        queueKeys.add(`${apt.doctorId.toString()}_${apt.date}`);
      }
    }

    const queueMap = new Map<string, Awaited<ReturnType<typeof Appointment.find>>>();
    for (const key of queueKeys) {
      const [doctorId, date] = key.split("_");
      const sameDay = await Appointment.find({
        doctorId,
        date,
        status: { $ne: "cancelled" },
      })
        .select("serialNumber status patientName")
        .sort({ serialNumber: 1 });
      queueMap.set(key, sameDay);
    }

    const result = appointments.map((apt) => {
      const formatted = formatAppointment(apt);
      const key = `${apt.doctorId.toString()}_${apt.date}`;
      const sameDay = queueMap.get(key);
      if (sameDay) {
        const queueInfo = buildQueueInfo(apt, sameDay);
        if (queueInfo) return { ...formatted, queueInfo };
      }
      return formatted;
    });

    return success({ appointments: result });
  } catch (err) {
    console.error("Patient appointments error:", err);
    return error("Failed to fetch appointments", 500);
  }
}
