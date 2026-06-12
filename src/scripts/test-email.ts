import { config } from "dotenv";
import mongoose from "mongoose";
import { Appointment } from "@/models/Appointment";
import { sendBookingEmail } from "@/lib/email";

config({ path: ".env.local" });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const apt = await Appointment.findOne().sort({ createdAt: -1 });
  if (!apt) {
    console.log("No appointments found — book one first");
    process.exit(0);
  }

  console.log(`Sending test booking email to ${apt.patientEmail}...`);
  const sent = await sendBookingEmail(apt);
  console.log(sent ? "✅ Email sent!" : "❌ Email failed — check RESEND_API_KEY and logs");
  await mongoose.disconnect();
}

main().catch(console.error);
