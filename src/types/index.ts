export type UserRole = "patient" | "doctor";

export type AppointmentStatus =
  | "waiting"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash" | "upi";

export type PaymentStatus = "pending" | "paid";

export type CancelRequestStatus = "pending" | "rejected";

export interface CancelRequest {
  message: string;
  requestedAt: string;
  status: CancelRequestStatus;
}

export interface QueueInfo {
  position: number;
  currentServing: number;
  ahead: number;
  total: number;
  progressPercent: number;
  nowServingName?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  photo?: string;
  createdAt: string;
}

export interface DoctorProfile {
  userId: string;
  specialization: string;
  degree: string;
  experience: number;
  hospital: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: string[];
  rating: number;
  totalPatients: number;
  profileComplete: boolean;
  image?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientPhoto?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  serialNumber: number;
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  consultationFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  emailSent: boolean;
  cancelRequest?: CancelRequest;
  queueInfo?: QueueInfo;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Razorpay types for window object
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
