import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { requireAuth } from "@/lib/api/auth-guard";
import { success, error } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req, ["patient"]);
    if (auth.error) return auth.error;

    const { amount, doctorId, date, timeSlot } = await req.json();

    if (!amount || !doctorId || !date || !timeSlot) {
      return error("Missing required fields");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `apt_${Date.now()}`,
      notes: {
        doctorId,
        date,
        timeSlot,
        patientId: auth.payload.userId,
      },
    });

    return success({
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error:", err);
    return error("Failed to create payment order", 500);
  }
}
