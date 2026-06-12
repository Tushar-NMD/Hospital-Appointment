import { AppointmentStatus, PaymentMethod, PaymentStatus } from "@/types";

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getStatusColor(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    waiting: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    "in-progress": "bg-purple-100 text-purple-800 border-purple-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status];
}

export function getStatusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    waiting: "Waiting",
    confirmed: "Confirmed",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status];
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return method === "cash" ? "Cash on Visit" : "UPI";
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  return status === "paid"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-orange-100 text-orange-800 border-orange-200";
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return status === "paid" ? "Paid" : "Pending";
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "0s";

  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 && days === 0) parts.push(`${secs}s`);

  return parts.join(" ") || "0s";
}
