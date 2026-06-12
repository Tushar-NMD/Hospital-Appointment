import { IAppointment } from "@/models/Appointment";
import { AppointmentStatus } from "@/types";

export interface QueueInfo {
  position: number;
  currentServing: number;
  ahead: number;
  total: number;
  progressPercent: number;
  nowServingName?: string;
}

const STATUS_PROGRESS: Record<AppointmentStatus, number> = {
  waiting: 20,
  confirmed: 45,
  "in-progress": 75,
  completed: 100,
  cancelled: 0,
};

export function parseAppointmentDateTime(date: string, timeSlot: string): Date {
  const match = timeSlot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return new Date(`${date}T23:59:59`);

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return new Date(
    `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`
  );
}

export function isBeforeAppointmentTime(date: string, timeSlot: string): boolean {
  return Date.now() < parseAppointmentDateTime(date, timeSlot).getTime();
}

export function canRequestCancellation(
  status: AppointmentStatus,
  date: string,
  timeSlot: string,
  cancelRequest?: { status: string }
): boolean {
  if (!["waiting", "confirmed"].includes(status)) return false;
  if (cancelRequest) return false;
  return isBeforeAppointmentTime(date, timeSlot);
}

export function buildQueueInfo(
  appointment: Pick<IAppointment, "serialNumber" | "status" | "doctorName">,
  sameDayAppointments: Pick<
    IAppointment,
    "serialNumber" | "status" | "patientName"
  >[]
): QueueInfo | null {
  if (["completed", "cancelled"].includes(appointment.status)) return null;

  const active = sameDayAppointments.filter((a) => a.status !== "cancelled");
  const total = active.length;

  const inProgress = active.find((a) => a.status === "in-progress");
  const completed = active.filter((a) => a.status === "completed");
  const maxCompletedSerial =
    completed.length > 0
      ? Math.max(...completed.map((a) => a.serialNumber))
      : 0;

  const currentServing = inProgress
    ? inProgress.serialNumber
    : Math.min(maxCompletedSerial + 1, total > 0 ? active[active.length - 1].serialNumber : 1);

  const ahead = active.filter(
    (a) =>
      a.serialNumber < appointment.serialNumber &&
      ["waiting", "confirmed", "in-progress"].includes(a.status)
  ).length;

  let progressPercent = STATUS_PROGRESS[appointment.status as AppointmentStatus];

  if (["waiting", "confirmed"].includes(appointment.status) && total > 1) {
    const queueProgress = Math.round(
      ((appointment.serialNumber - ahead - 1) / Math.max(total - 1, 1)) * 35
    );
    progressPercent = Math.min(44, 12 + queueProgress);
    if (currentServing >= appointment.serialNumber) {
      progressPercent = appointment.status === "confirmed" ? 45 : 40;
    }
  }

  if (appointment.status === "in-progress") progressPercent = 75;

  return {
    position: appointment.serialNumber,
    currentServing,
    ahead,
    total,
    progressPercent,
    nowServingName: inProgress?.patientName,
  };
}
