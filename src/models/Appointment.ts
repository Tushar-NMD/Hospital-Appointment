import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AppointmentStatus =
  | "waiting"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export type CancelRequestStatus = "pending" | "rejected";

export interface ICancelRequest {
  message: string;
  requestedAt: Date;
  status: CancelRequestStatus;
}

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: Types.ObjectId;
  doctorName: string;
  date: string;
  timeSlot: string;
  serialNumber: number;
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  consultationFee: number;
  paymentMethod: "cash" | "upi";
  paymentStatus: "pending" | "paid";
  emailSent: boolean;
  cancelRequest?: ICancelRequest;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    serialNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["waiting", "confirmed", "in-progress", "completed", "cancelled"],
      default: "waiting",
    },
    symptoms: { type: String, required: true },
    notes: { type: String },
    consultationFee: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "upi"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    emailSent: { type: Boolean, default: false },
    cancelRequest: {
      message: { type: String },
      requestedAt: { type: Date },
      status: { type: String, enum: ["pending", "rejected"] },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AppointmentSchema.index({ doctorId: 1, date: 1, serialNumber: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 });

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ??
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export function formatAppointment(apt: IAppointment) {
  return {
    id: apt._id.toString(),
    patientId: apt.patientId.toString(),
    patientName: apt.patientName,
    patientEmail: apt.patientEmail,
    patientPhone: apt.patientPhone,
    doctorId: apt.doctorId.toString(),
    doctorName: apt.doctorName,
    date: apt.date,
    timeSlot: apt.timeSlot,
    serialNumber: apt.serialNumber,
    status: apt.status,
    symptoms: apt.symptoms,
    notes: apt.notes,
    consultationFee: apt.consultationFee,
    paymentMethod: apt.paymentMethod,
    paymentStatus: apt.paymentStatus,
    emailSent: apt.emailSent,
    cancelRequest: apt.cancelRequest
      ? {
          message: apt.cancelRequest.message,
          requestedAt: apt.cancelRequest.requestedAt?.toISOString(),
          status: apt.cancelRequest.status,
        }
      : undefined,
    createdAt: apt.createdAt.toISOString(),
  };
}
