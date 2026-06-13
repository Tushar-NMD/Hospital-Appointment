"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  IndianRupee,
  ArrowLeft,
  Calendar,
  Award,
  CheckCircle,
  Mail,
  Loader2,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Textarea from "@/components/ui/Textarea";
import PaymentMethodSelect from "@/components/patient/PaymentMethodSelect";
import { useApp } from "@/context/AppContext";
import { DoctorProfile, PaymentMethod, User, RazorpayResponse } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchDoctor, fetchSlots, bookAppointment } = useApp();

  const doctorId = params.id as string;
  const [doctor, setDoctor] = useState<User | null>(null);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctor(doctorId).then((data) => {
      if (data) {
        setDoctor(data.user);
        setProfile(data.profile);
      }
      setPageLoading(false);
    });
  }, [doctorId, fetchDoctor]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    setSlotsLoading(true);
    setSelectedSlot("");
    fetchSlots(doctorId, selectedDate).then((slots) => {
      setAvailableSlots(slots);
      setSlotsLoading(false);
    });
  }, [selectedDate, doctorId, fetchSlots]);

  const getMinDate = () => new Date().toISOString().split("T")[0];

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot || !symptoms.trim()) {
      setError("Please select date, time slot, and describe your symptoms");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    // If UPI payment, initiate Razorpay
    if (paymentMethod === "upi") {
      await handleRazorpayPayment();
      return;
    }

    // For cash payment, book directly
    setBooking(true);
    setError("");
    const result = await bookAppointment({
      doctorId,
      date: selectedDate,
      timeSlot: selectedSlot,
      symptoms,
      paymentMethod,
    });
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
    setBooking(false);
  };

  const handleRazorpayPayment = async () => {
    setBooking(true);
    setError("");

    try {
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      // Create Razorpay order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: profile!.consultationFee,
          doctorId,
          date: selectedDate,
          timeSlot: selectedSlot,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success || !orderData.data) {
        setError(orderData.message || "Failed to create payment order");
        setBooking(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: orderData.data.key,
        amount: orderData.data.order.amount,
        currency: "INR",
        name: "MedCare Hospital",
        description: `Consultation with ${doctor?.name}`,
        order_id: orderData.data.order.id,
        handler: async (response: RazorpayResponse) => {
          // Verify payment and book appointment
          const result = await bookAppointment({
            doctorId,
            date: selectedDate,
            timeSlot: selectedSlot,
            symptoms,
            paymentMethod: "upi",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (result.success) {
            setSuccess(true);
          } else {
            setError(result.message);
          }
          setBooking(false);
        },
        prefill: {
          name: doctor?.name || "",
          email: doctor?.email || "",
        },
        theme: {
          color: "#0EA5E9",
        },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled");
            setBooking(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      setError("Payment initialization failed");
      setBooking(false);
    }
  };

  if (pageLoading) {
    return (
      <ProtectedRoute allowedRole="patient">
        <div className="min-h-screen flex items-center justify-center pt-24">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!doctor || !profile) {
    return (
      <ProtectedRoute allowedRole="patient">
        <div className="min-h-screen flex items-center justify-center pt-24">
          <p className="text-gray-500">Doctor not found.</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (success) {
    return (
      <ProtectedRoute allowedRole="patient">
        <div className="min-h-screen flex items-center justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
              Appointment Booked!
            </h2>
            <p className="text-gray-600 mb-4">
              Your appointment with {doctor.name} has been confirmed.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl p-3 mb-6">
              <Mail className="w-4 h-4" />
              Confirmation email sent to your inbox
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/patient/appointments">
                <Button>View My Appointments</Button>
              </Link>
              <Button variant="outline" onClick={() => router.push("/patient/doctors")}>
                Browse More Doctors
              </Button>
            </div>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRole="patient">
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/patient/doctors"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar
                    src={doctor.photo || profile.image}
                    name={doctor.name}
                    size="xl"
                    className="mx-auto sm:mx-0"
                  />
                  <div>
                    <h1 className="font-display text-2xl font-bold text-gray-900">
                      {doctor.name}
                    </h1>
                    <p className="text-primary-600 font-semibold text-lg">
                      {profile.specialization}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                      <span className="font-bold">{profile.rating}</span>
                      <span className="text-gray-400 text-sm">
                        ({profile.totalPatients}+ patients)
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="w-4 h-4 text-primary-500" />
                        {profile.degree}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-primary-500" />
                        {profile.experience} years exp.
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        {profile.hospital}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <IndianRupee className="w-4 h-4 text-primary-500" />
                        ₹{profile.consultationFee} fee
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </Card>

              <Card className="p-6">
                <h2 className="font-display font-semibold text-lg mb-3">Available Days</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.availableDays.map((day) => (
                    <span
                      key={day}
                      className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 sticky top-28">
                <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Book Appointment
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Select Date
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Select Time Slot
                      </label>
                      {slotsLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <p className="text-sm text-red-500">No slots available for this date</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={cn(
                                "px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                                selectedSlot === slot
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-primary-300"
                              )}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Textarea
                    id="symptoms"
                    label="Symptoms / Reason for Visit"
                    placeholder="Describe your symptoms or reason for the visit..."
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />

                  <PaymentMethodSelect
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    fee={profile.consultationFee}
                  />

                  {paymentMethod === "upi" && (
                    <div className="p-3 rounded-xl bg-accent-50 border border-accent-100 text-sm text-accent-800">
                      Pay {formatCurrency(profile.consultationFee)} securely via Razorpay.
                      Payment will be processed when you click Confirm Booking.
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleBook}
                    disabled={booking || !selectedDate || !selectedSlot || !paymentMethod}
                  >
                    {booking ? "Booking..." : "Confirm Booking"}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    You will receive an email confirmation with your serial number
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
