"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Appointment,
  AppointmentStatus,
  DoctorProfile,
  PaymentStatus,
  User,
} from "@/types";
import { api } from "@/lib/api/client";
import { setToken, clearToken, getToken } from "@/lib/api/token";

interface DoctorStats {
  total: number;
  waiting: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  paymentPending: number;
  paymentCollected: number;
}

interface AppContextType {
  user: User | null;
  doctorProfile: DoctorProfile | null;
  isLoading: boolean;
  login: (email: string, password: string, role: "patient" | "doctor") => Promise<{ success: boolean; message: string }>;
  register: (
    data: Omit<User, "id" | "createdAt"> & { password: string }
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updatePatientProfile: (
    data: Partial<Pick<User, "name" | "phone" | "photo">>
  ) => Promise<{ success: boolean; message: string }>;
  updateDoctorProfile: (
    data: Partial<DoctorProfile>
  ) => Promise<{ success: boolean; message: string }>;
  fetchDoctors: (q?: string) => Promise<Array<{ user: User; profile: DoctorProfile }>>;
  fetchDoctor: (id: string) => Promise<{ user: User; profile: DoctorProfile } | null>;
  fetchSlots: (doctorId: string, date: string) => Promise<string[]>;
  bookAppointment: (data: {
    doctorId: string;
    date: string;
    timeSlot: string;
    symptoms: string;
    paymentMethod: "cash" | "upi";
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
  }) => Promise<{ success: boolean; message: string; appointment?: Appointment }>;
  fetchPatientAppointments: () => Promise<Appointment[]>;
  fetchDoctorAppointments: (
    date: string
  ) => Promise<{ appointments: Appointment[]; stats: DoctorStats }>;
  updateAppointmentStatus: (
    appointmentId: string,
    status: AppointmentStatus,
    notes?: string
  ) => Promise<{ success: boolean; message: string }>;
  updatePaymentStatus: (
    appointmentId: string,
    status: PaymentStatus
  ) => Promise<{ success: boolean; message: string }>;
  requestCancelAppointment: (
    appointmentId: string,
    message: string
  ) => Promise<{ success: boolean; message: string }>;
  reviewCancelRequest: (
    appointmentId: string,
    action: "approve" | "reject"
  ) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setDoctorProfile(null);
      return;
    }
    const res = await api.auth.me();
    if (res.success && res.data) {
      setUser(res.data.user);
      setDoctorProfile(res.data.doctorProfile ?? null);
    } else {
      clearToken();
      setUser(null);
      setDoctorProfile(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string, role: "patient" | "doctor") => {
    const res = await api.auth.login(email, password, role);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      await refreshUser();
      return { success: true, message: "Login successful" };
    }
    return { success: false, message: res.message || "Invalid email or password" };
  }, [refreshUser]);

  const register = useCallback(
    async (data: Omit<User, "id" | "createdAt"> & { password: string }) => {
      const res = await api.auth.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        photo: data.photo || "",
      });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        await refreshUser();
        return { success: true, message: "Registration successful" };
      }
      return { success: false, message: res.message || "Registration failed" };
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    await api.auth.logout();
    clearToken();
    setUser(null);
    setDoctorProfile(null);
  }, []);

  const updatePatientProfile = useCallback(
    async (data: Partial<Pick<User, "name" | "phone" | "photo">>) => {
      const res = await api.patient.updateProfile(data);
      if (res.success && res.data) {
        setUser(res.data.user);
        return { success: true, message: "Profile updated" };
      }
      return { success: false, message: res.message || "Update failed" };
    },
    []
  );

  const updateDoctorProfile = useCallback(async (data: Partial<DoctorProfile>) => {
    const res = await api.doctors.updateMyProfile(data);
    if (res.success && res.data) {
      setDoctorProfile(res.data.profile);
      await refreshUser();
      return { success: true, message: "Profile updated" };
    }
    return { success: false, message: res.message || "Update failed" };
  }, [refreshUser]);

  const fetchDoctors = useCallback(async (q?: string) => {
    const res = await api.doctors.list(q);
    return res.success && res.data ? res.data.doctors : [];
  }, []);

  const fetchDoctor = useCallback(async (id: string) => {
    const res = await api.doctors.get(id);
    return res.success && res.data ? res.data : null;
  }, []);

  const fetchSlots = useCallback(async (doctorId: string, date: string) => {
    const res = await api.doctors.slots(doctorId, date);
    return res.success && res.data ? res.data.availableSlots : [];
  }, []);

  const bookAppointment = useCallback(
    async (data: {
      doctorId: string;
      date: string;
      timeSlot: string;
      symptoms: string;
      paymentMethod: "cash" | "upi";
      razorpayPaymentId?: string;
      razorpayOrderId?: string;
      razorpaySignature?: string;
    }) => {
      const res = await api.appointments.book(data);
      if (res.success && res.data) {
        return {
          success: true,
          message: res.data.message,
          appointment: res.data.appointment,
        };
      }
      return { success: false, message: res.message || "Booking failed" };
    },
    []
  );

  const fetchPatientAppointments = useCallback(async () => {
    const res = await api.appointments.patientList();
    return res.success && res.data ? res.data.appointments : [];
  }, []);

  const fetchDoctorAppointments = useCallback(async (date: string) => {
    const res = await api.appointments.doctorList(date);
    if (res.success && res.data) {
      return { appointments: res.data.appointments, stats: res.data.stats };
    }
    return {
      appointments: [],
      stats: {
        total: 0,
        waiting: 0,
        confirmed: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        paymentPending: 0,
        paymentCollected: 0,
      },
    };
  }, []);

  const updateAppointmentStatus = useCallback(
    async (appointmentId: string, status: AppointmentStatus, notes?: string) => {
      const res = await api.appointments.updateStatus(appointmentId, status, notes);
      if (res.success) return { success: true, message: "Status updated" };
      return { success: false, message: res.message || "Update failed" };
    },
    []
  );

  const updatePaymentStatus = useCallback(
    async (appointmentId: string, paymentStatus: PaymentStatus) => {
      const res = await api.appointments.updatePayment(appointmentId, paymentStatus);
      if (res.success) return { success: true, message: "Payment updated" };
      return { success: false, message: res.message || "Update failed" };
    },
    []
  );

  const requestCancelAppointment = useCallback(
    async (appointmentId: string, message: string) => {
      const res = await api.appointments.requestCancel(appointmentId, message);
      if (res.success) {
        return {
          success: true,
          message: res.data?.message || "Cancel request sent",
        };
      }
      return { success: false, message: res.message || "Request failed" };
    },
    []
  );

  const reviewCancelRequest = useCallback(
    async (appointmentId: string, action: "approve" | "reject") => {
      const res = await api.appointments.reviewCancelRequest(appointmentId, action);
      if (res.success) {
        return {
          success: true,
          message: res.data?.message || "Request processed",
        };
      }
      return { success: false, message: res.message || "Action failed" };
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        user,
        doctorProfile,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updatePatientProfile,
        updateDoctorProfile,
        fetchDoctors,
        fetchDoctor,
        fetchSlots,
        bookAppointment,
        fetchPatientAppointments,
        fetchDoctorAppointments,
        updateAppointmentStatus,
        updatePaymentStatus,
        requestCancelAppointment,
        reviewCancelRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
