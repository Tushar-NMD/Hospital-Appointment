import PDFDocument from "pdfkit";
import { IAppointment } from "@/models/Appointment";
import { formatDate } from "@/lib/utils";

type PdfType = "booking" | "completion";

function formatPayment(method: string, status: string): string {
  const methodLabel = method === "cash" ? "Cash on Visit" : "UPI";
  const statusLabel = status === "paid" ? "Paid" : "Pending";
  return `${methodLabel} (${statusLabel})`;
}

function drawRow(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  y: number
): number {
  doc.fontSize(10).fillColor("#6b7280").text(label, 50, y, { width: 160 });
  doc.fontSize(11).fillColor("#111827").text(value, 210, y, { width: 330 });
  return y + 22;
}

export function generateAppointmentPdf(
  appointment: IAppointment,
  type: PdfType
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const isCompletion = type === "completion";
    const title = isCompletion
      ? "Treatment Completion Summary"
      : "Appointment Confirmation";
    const accent = isCompletion ? "#059669" : "#2563eb";

    doc.fillColor(accent).rect(0, 0, doc.page.width, 110).fill();
    doc.fillColor("#ffffff").fontSize(26).text("MedCare", 50, 38);
    doc.fontSize(13).text("Hospital Appointment System", 50, 72);
    doc.fontSize(18).text(title, 50, 130);

    doc
      .moveTo(50, 165)
      .lineTo(doc.page.width - 50, 165)
      .strokeColor("#e5e7eb")
      .stroke();

    let y = 185;
    const refId = appointment._id.toString().slice(-8).toUpperCase();

    doc.fontSize(10).fillColor("#6b7280").text(`Reference ID: MED-${refId}`, 50, y);
    y += 28;

    const rows: [string, string][] = [
      ["Patient Name", appointment.patientName],
      ["Email", appointment.patientEmail],
      ["Phone", appointment.patientPhone],
      ["Doctor", appointment.doctorName],
      ["Appointment Date", formatDate(appointment.date)],
      ["Time Slot", appointment.timeSlot],
      ["Serial Number", `#${appointment.serialNumber}`],
      ["Status", appointment.status.replace("-", " ").toUpperCase()],
      [
        "Consultation Fee",
        `INR ${appointment.consultationFee.toLocaleString("en-IN")}`,
      ],
      [
        "Payment",
        formatPayment(appointment.paymentMethod, appointment.paymentStatus),
      ],
    ];

    if (appointment.symptoms) {
      rows.push(["Symptoms", appointment.symptoms]);
    }
    if (appointment.notes) {
      rows.push(["Doctor Notes", appointment.notes]);
    }

    for (const [label, value] of rows) {
      y = drawRow(doc, label, value, y);
      if (y > doc.page.height - 120) {
        doc.addPage();
        y = 50;
      }
    }

    y += 16;
    doc
      .roundedRect(50, y, doc.page.width - 100, isCompletion ? 70 : 55, 8)
      .fill(isCompletion ? "#ecfdf5" : "#eff6ff");

    doc
      .fillColor(isCompletion ? "#065f46" : "#1e40af")
      .fontSize(11)
      .text(
        isCompletion
          ? "Your treatment has been marked as completed. Please keep this document for your records."
          : "Please arrive 10 minutes before your scheduled time. Bring this PDF or your serial number.",
        65,
        y + 16,
        { width: doc.page.width - 130 }
      );

    doc
      .fontSize(9)
      .fillColor("#9ca3af")
      .text(
        `Generated on ${new Date().toLocaleString("en-IN")} | MedCare Hospital`,
        50,
        doc.page.height - 50,
        { align: "center", width: doc.page.width - 100 }
      );

    doc.end();
  });
}
