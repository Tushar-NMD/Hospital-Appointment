import { IAppointment } from "@/models/Appointment";
import { getResendClient, getFromEmail } from "./client";
import { generateAppointmentPdf } from "./pdf";
import { bookingEmailHtml, completionEmailHtml } from "./templates";

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  pdfBuffer: Buffer,
  pdfFilename: string
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: [to],
    subject,
    html,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  if (error) {
    console.error("Resend email error:", error);
    return false;
  }

  return true;
}

export async function sendBookingEmail(
  appointment: IAppointment
): Promise<boolean> {
  try {
    const pdf = await generateAppointmentPdf(appointment, "booking");
    const refId = appointment._id.toString().slice(-8).toUpperCase();
    const sent = await sendEmail(
      appointment.patientEmail,
      `✅ Appointment Confirmed — ${appointment.doctorName} | ${appointment.date}`,
      bookingEmailHtml(appointment),
      pdf,
      `MedCare-Appointment-MED-${refId}.pdf`
    );

    if (sent) {
      console.log(`📧 Booking email sent → ${appointment.patientEmail}`);
    }
    return sent;
  } catch (err) {
    console.error("sendBookingEmail failed:", err);
    return false;
  }
}

export async function sendCompletionEmail(
  appointment: IAppointment
): Promise<boolean> {
  try {
    const pdf = await generateAppointmentPdf(appointment, "completion");
    const refId = appointment._id.toString().slice(-8).toUpperCase();
    const sent = await sendEmail(
      appointment.patientEmail,
      `🎉 Treatment Completed — Dr. ${appointment.doctorName} | MedCare`,
      completionEmailHtml(appointment),
      pdf,
      `MedCare-Treatment-Summary-MED-${refId}.pdf`
    );

    if (sent) {
      console.log(`📧 Completion email sent → ${appointment.patientEmail}`);
    }
    return sent;
  } catch (err) {
    console.error("sendCompletionEmail failed:", err);
    return false;
  }
}
