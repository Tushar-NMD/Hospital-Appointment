import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { DoctorProfile } from "@/models/DoctorProfile";
import { Appointment, formatAppointment } from "@/models/Appointment";
import { requireAuth } from "@/lib/api/auth-guard";
import { sendBookingEmail } from "@/lib/email";
import { success, error } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    await connectDB();
    const {
      doctorId,
      date,
      timeSlot,
      symptoms,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = await req.json();

    if (!doctorId || !date || !timeSlot || !symptoms?.trim() || !paymentMethod) {
      return error("All booking fields are required");
    }
    if (!["cash", "upi"].includes(paymentMethod)) {
      return error("Invalid payment method");
    }

    // Verify Razorpay payment for UPI
    if (paymentMethod === "upi") {
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return error("Payment verification details missing");
      }

      const sign = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign)
        .digest("hex");

      if (razorpaySignature !== expectedSign) {
        return error("Invalid payment signature", 400);
      }
    }

    const patient = await User.findById(auth.payload.userId);
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    const profile = await DoctorProfile.findOne({ userId: doctorId, profileComplete: true });

    if (!patient || !doctor || !profile) {
      return error("Doctor not found", 404);
    }

    const existing = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $ne: "cancelled" },
    });
    if (existing) return error("This time slot is already booked", 409);

    const dayCount = await Appointment.countDocuments({
      doctorId,
      date,
      status: { $ne: "cancelled" },
    });

    const appointment = await Appointment.create({
      patientId: patient._id,
      patientName: patient.name,
      patientEmail: patient.email,
      patientPhone: patient.phone,
      doctorId: doctor._id,
      doctorName: doctor.name,
      date,
      timeSlot,
      serialNumber: dayCount + 1,
      status: "waiting",
      symptoms: symptoms.trim(),
      consultationFee: profile.consultationFee,
      paymentMethod,
      paymentStatus: paymentMethod === "upi" ? "paid" : "pending",
      emailSent: false,
    });

    await DoctorProfile.findByIdAndUpdate(profile._id, {
      $inc: { totalPatients: 1 },
    });

    const emailSent = await sendBookingEmail(appointment);
    if (emailSent) {
      appointment.emailSent = true;
      await appointment.save();
    }

    return success(
      {
        appointment: formatAppointment(appointment),
        message: emailSent
          ? "Appointment booked! Confirmation email with PDF sent."
          : "Appointment booked! Email could not be sent — check RESEND_API_KEY.",
      },
      201
    );
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return error("This time slot is already booked", 409);
    }
    console.error("Book appointment error:", err);
    return error("Failed to book appointment", 500);
  }
}
