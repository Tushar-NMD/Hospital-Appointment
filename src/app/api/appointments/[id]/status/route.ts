import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment, formatAppointment } from "@/models/Appointment";
import { requireAuth } from "@/lib/api/auth-guard";
import { success, error } from "@/lib/api/response";
import { sendCompletionEmail } from "@/lib/email";

const VALID_STATUSES = ["waiting", "confirmed", "in-progress", "completed", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req, ["doctor"]);
    if (auth.error) return auth.error;

    await connectDB();
    const { id } = await params;
    const { status, notes } = await req.json();

    if (!status || !VALID_STATUSES.includes(status)) {
      return error("Invalid status");
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctorId: auth.payload.userId,
    });
    if (!appointment) return error("Appointment not found", 404);

    const previousStatus = appointment.status;
    appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();

    if (status === "completed" && previousStatus !== "completed") {
      sendCompletionEmail(appointment).catch((err) =>
        console.error("Completion email failed:", err)
      );
    }

    return success({ appointment: formatAppointment(appointment) });
  } catch (err) {
    console.error("Update status error:", err);
    return error("Failed to update status", 500);
  }
}
