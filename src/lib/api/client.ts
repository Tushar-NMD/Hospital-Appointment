import { getToken } from "@/lib/api/token";
import {
  Appointment,
  DoctorProfile,
  PaymentMethod,
  PaymentStatus,
  User,
} from "@/types";

const BASE = "/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  return res.json();
}

export const api = {
  auth: {
    register: (body: {
      name: string;
      email: string;
      password: string;
      phone: string;
      role: "patient" | "doctor";
      photo: string;
    }) =>
      request<{ user: User; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    login: (email: string, password: string) =>
      request<{ user: User; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    me: () =>
      request<{ user: User; doctorProfile?: DoctorProfile }>("/auth/me"),

    logout: () => request("/auth/logout", { method: "POST" }),
  },

  patient: {
    updateProfile: (body: { name?: string; phone?: string; photo?: string }) =>
      request<{ user: User }>("/patients/me", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },

  doctors: {
    list: (q?: string) =>
      request<{ doctors: Array<{ user: User; profile: DoctorProfile }> }>(
        `/doctors${q ? `?q=${encodeURIComponent(q)}` : ""}`
      ),

    get: (id: string) =>
      request<{ user: User; profile: DoctorProfile }>(`/doctors/${id}`),

    slots: (id: string, date: string) =>
      request<{ date: string; availableSlots: string[]; consultationFee: number }>(
        `/doctors/${id}/slots?date=${date}`
      ),

    getMyProfile: () =>
      request<{ profile: DoctorProfile }>("/doctors/me/profile"),

    updateMyProfile: (body: Partial<DoctorProfile>) =>
      request<{ profile: DoctorProfile }>("/doctors/me/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },

  appointments: {
    book: (body: {
      doctorId: string;
      date: string;
      timeSlot: string;
      symptoms: string;
      paymentMethod: PaymentMethod;
    }) =>
      request<{ appointment: Appointment; message: string }>("/appointments", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    patientList: () =>
      request<{ appointments: Appointment[] }>("/appointments/patient"),

    doctorList: (date?: string) =>
      request<{
        appointments: Appointment[];
        stats: {
          total: number;
          waiting: number;
          confirmed: number;
          inProgress: number;
          completed: number;
          cancelled: number;
          paymentPending: number;
          paymentCollected: number;
        };
      }>(`/appointments/doctor${date ? `?date=${date}` : ""}`),

    updateStatus: (id: string, status: string, notes?: string) =>
      request<{ appointment: Appointment }>(`/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      }),

    updatePayment: (id: string, paymentStatus: PaymentStatus) =>
      request<{ appointment: Appointment }>(`/appointments/${id}/payment`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus }),
      }),

    requestCancel: (id: string, message: string) =>
      request<{ appointment: Appointment; message: string }>(
        `/appointments/${id}/cancel-request`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
        }
      ),

    reviewCancelRequest: (id: string, action: "approve" | "reject") =>
      request<{ appointment: Appointment; message: string }>(
        `/appointments/${id}/cancel-request`,
        {
          method: "PATCH",
          body: JSON.stringify({ action }),
        }
      ),
  },
};
