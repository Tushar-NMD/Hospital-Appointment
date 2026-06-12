import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment, formatAppointment } from "@/models/Appointment";
import { requireAuth } from "@/lib/api/auth-guard";
import { success, error } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req, ["doctor"]);
    if (auth.error) return auth.error;

    await connectDB();
    const { id } = await params;
    const { paymentStatus } = await req.json();

    if (!paymentStatus || !["pending", "paid"].includes(paymentStatus)) {
      return error("Invalid payment status");
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctorId: auth.payload.userId,
    });
    if (!appointment) return error("Appointment not found", 404);

    appointment.paymentStatus = paymentStatus;
    await appointment.save();

    return success({ appointment: formatAppointment(appointment) });
  } catch (err) {
    console.error("Update payment error:", err);
    return error("Failed to update payment", 500);
  }
}
