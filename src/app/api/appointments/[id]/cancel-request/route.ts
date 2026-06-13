import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment, formatAppointment } from "@/models/Appointment";
import { requireAuth } from "@/lib/api/auth-guard";
import { success, error } from "@/lib/api/response";
import {
  isBeforeAppointmentTime,
} from "@/lib/appointment-queue";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    await connectDB();
    const { id } = await params;
    const { message } = await req.json();

    if (!message?.trim() || message.trim().length < 10) {
      return error("Please provide a reason (at least 10 characters)");
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patientId: auth.payload.userId,
    });
    if (!appointment) return error("Appointment not found", 404);

    if (appointment.cancelRequest) {
      if (appointment.cancelRequest.status === "pending") {
        return error("Cancel request already sent and awaiting doctor review");
      }
      return error("You have already submitted a cancel request for this appointment");
    }

    if (!["waiting", "confirmed"].includes(appointment.status)) {
      return error("This appointment can no longer be cancelled");
    }

    if (!isBeforeAppointmentTime(appointment.date, appointment.timeSlot)) {
      return error(
        "Cancellation window closed — request must be made before your appointment time"
      );
    }

    appointment.cancelRequest = {
      message: message.trim(),
      requestedAt: new Date(),
      status: "pending",
    };
    await appointment.save();

    return success({
      appointment: formatAppointment(appointment),
      message: "Cancel request sent to your doctor",
    });
  } catch (err) {
    console.error("Cancel request error:", err);
    return error("Failed to submit cancel request", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(req, ["doctor"]);
    if (auth.error) return auth.error;

    await connectDB();
    const { id } = await params;
    const { action } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return error("Invalid action. Use approve or reject");
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctorId: auth.payload.userId,
    });
    if (!appointment) return error("Appointment not found", 404);

    if (appointment.cancelRequest?.status !== "pending") {
      return error("No pending cancel request for this appointment");
    }

    if (action === "approve") {
      appointment.status = "cancelled";
      appointment.cancelRequest = undefined;
    } else {
      appointment.cancelRequest.status = "rejected";
    }

    await appointment.save();

    return success({
      appointment: formatAppointment(appointment),
      message:
        action === "approve"
          ? "Appointment cancelled"
          : "Cancel request rejected",
    });
  } catch (err) {
    console.error("Cancel request review error:", err);
    return error("Failed to process cancel request", 500);
  }
}
