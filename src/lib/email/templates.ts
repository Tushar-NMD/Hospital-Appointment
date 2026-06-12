import { IAppointment } from "@/models/Appointment";
import { formatDate } from "@/lib/utils";

function paymentLabel(method: string, status: string): string {
  const m = method === "cash" ? "Cash on Visit" : "UPI";
  const s = status === "paid" ? "Paid" : "Pending";
  return `${m} · ${s}`;
}

function baseLayout(content: string, accent: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:${accent};padding:32px 40px;text-align:center;">
            <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">🏥 MedCare</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px;">Hospital Appointment System</div>
          </td>
        </tr>
        <tr><td style="padding:40px;">${content}</td></tr>
        <tr>
          <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} MedCare Hospital. All rights reserved.</p>
            <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">This is an automated email. Please do not reply directly.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detailTable(appointment: IAppointment): string {
  const refId = appointment._id.toString().slice(-8).toUpperCase();
  const rows = [
    ["Patient", appointment.patientName],
    ["Email", appointment.patientEmail],
    ["Phone", appointment.patientPhone],
    ["Doctor", appointment.doctorName],
    ["Date", formatDate(appointment.date)],
    ["Time", appointment.timeSlot],
    ["Serial No.", `#${appointment.serialNumber}`],
    ["Fee", `₹${appointment.consultationFee.toLocaleString("en-IN")}`],
    ["Payment", paymentLabel(appointment.paymentMethod, appointment.paymentStatus)],
  ];

  if (appointment.symptoms) {
    rows.push(["Symptoms", appointment.symptoms]);
  }

  const tableRows = rows
    .map(
      ([label, value]) => `
    <tr>
      <td style="padding:12px 16px;font-size:13px;color:#6b7280;border-bottom:1px solid #f3f4f6;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:12px 16px;font-size:14px;color:#111827;font-weight:500;border-bottom:1px solid #f3f4f6;">${value}</td>
    </tr>`
    )
    .join("");

  return `
    <div style="background:#f9fafb;border-radius:12px;padding:4px;margin:24px 0;border:1px solid #e5e7eb;">
      <div style="padding:12px 16px;font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">
        Reference: MED-${refId}
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">${tableRows}</table>
    </div>`;
}

export function bookingEmailHtml(appointment: IAppointment): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#111827;font-weight:700;">Appointment Confirmed! ✅</h1>
    <p style="margin:0 0 4px;font-size:15px;color:#6b7280;line-height:1.6;">
      Dear <strong style="color:#111827;">${appointment.patientName}</strong>,
    </p>
    <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">
      Your appointment has been successfully booked. Your serial number is
      <strong style="color:#2563eb;font-size:18px;">#${appointment.serialNumber}</strong>.
      Please save the attached PDF for your records.
    </p>
    ${detailTable(appointment)}
    <div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:0 8px 8px 0;padding:16px 20px;margin-top:8px;">
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
        <strong>📎 PDF Attached</strong> — Download and keep your appointment confirmation.
        Arrive 10 minutes early with your serial number.
      </p>
    </div>`;

  return baseLayout(content, "#2563eb");
}

export function completionEmailHtml(appointment: IAppointment): string {
  const notesBlock = appointment.notes
    ? `<div style="background:#f0fdf4;border-radius:8px;padding:16px;margin-top:16px;border:1px solid #bbf7d0;">
        <p style="margin:0 0 4px;font-size:12px;color:#166534;font-weight:600;">Doctor's Notes</p>
        <p style="margin:0;font-size:14px;color:#14532d;line-height:1.5;">${appointment.notes}</p>
      </div>`
    : "";

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;color:#111827;font-weight:700;">Treatment Completed! 🎉</h1>
    <p style="margin:0 0 4px;font-size:15px;color:#6b7280;line-height:1.6;">
      Dear <strong style="color:#111827;">${appointment.patientName}</strong>,
    </p>
    <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">
      Dr. <strong>${appointment.doctorName}</strong> has marked your treatment as completed.
      Thank you for choosing MedCare. Your treatment summary is attached as a PDF.
    </p>
    ${detailTable(appointment)}
    ${notesBlock}
    <div style="background:#ecfdf5;border-left:4px solid #059669;border-radius:0 8px 8px 0;padding:16px 20px;margin-top:8px;">
      <p style="margin:0;font-size:13px;color:#065f46;line-height:1.6;">
        <strong>📎 PDF Attached</strong> — Your treatment summary is ready to download and keep for your medical records.
      </p>
    </div>
    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;text-align:center;">
      Wishing you a speedy recovery! 💚
    </p>`;

  return baseLayout(content, "#059669");
}
