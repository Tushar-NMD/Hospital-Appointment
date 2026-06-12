"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Hash,
  Mail,
  History,
  IndianRupee,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import WaitingProgressLine from "@/components/patient/WaitingProgressLine";
import CancelRequestSection from "@/components/patient/CancelRequestSection";
import { useApp } from "@/context/AppContext";
import { Appointment } from "@/types";
import {
  formatCurrency,
  formatDate,
  getPaymentMethodLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";

const POLL_INTERVAL = 5000;

function isLiveAppointment(apt: Appointment) {
  return ["waiting", "confirmed", "in-progress"].includes(apt.status);
}

export default function PatientAppointmentsPage() {
  const { fetchPatientAppointments, requestCancelAppointment } = useApp();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = useCallback(
    async (silent = false) => {
      if (!silent) setRefreshing(true);
      const data = await fetchPatientAppointments();
      setAppointments(data);
      setLoading(false);
      setRefreshing(false);
    },
    [fetchPatientAppointments]
  );

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    const hasLive = appointments.some(isLiveAppointment);
    if (!hasLive) return;

    const interval = setInterval(() => loadAppointments(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [appointments, loadAppointments]);

  return (
    <ProtectedRoute allowedRole="patient">
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <History className="w-5 h-5 text-primary-600" />
                  </div>
                  <h1 className="font-display text-3xl font-bold text-gray-900">
                    My Appointments
                  </h1>
                </div>
                <p className="text-gray-600">
                  Track live queue status and manage your bookings.
                </p>
              </div>
              {appointments.some(isLiveAppointment) && (
                <div className="flex items-center gap-2 text-xs text-primary-600 bg-primary-50 px-3 py-2 rounded-full">
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Auto-updating every 5s
                </div>
              )}
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No appointments yet.</p>
              <Link
                href="/patient/doctors"
                className="text-primary-600 font-semibold hover:underline"
              >
                Browse doctors to book your first appointment
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-display font-semibold text-lg text-gray-900">
                            {apt.doctorName}
                          </h3>
                          <Badge className={getStatusColor(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                          <Badge
                            className={getPaymentStatusColor(apt.paymentStatus)}
                          >
                            {getPaymentStatusLabel(apt.paymentStatus)}
                          </Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(apt.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {apt.timeSlot}
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            Serial #{apt.serialNumber}
                          </div>
                          {apt.emailSent && (
                            <div className="flex items-center gap-2 text-green-600">
                              <Mail className="w-4 h-4" />
                              Email sent
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-gray-400" />
                            {formatCurrency(apt.consultationFee)}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            {getPaymentMethodLabel(apt.paymentMethod)}
                          </div>
                        </div>

                        {apt.queueInfo && isLiveAppointment(apt) && (
                          <WaitingProgressLine
                            status={apt.status}
                            queueInfo={apt.queueInfo}
                          />
                        )}

                        {apt.symptoms && (
                          <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                            <span className="font-medium text-gray-700">
                              Symptoms:{" "}
                            </span>
                            {apt.symptoms}
                          </p>
                        )}

                        {apt.notes && (
                          <p className="mt-2 text-sm text-gray-500 bg-primary-50 rounded-lg p-3">
                            <span className="font-medium text-primary-700">
                              Doctor Notes:{" "}
                            </span>
                            {apt.notes}
                          </p>
                        )}

                        {isLiveAppointment(apt) && (
                          <CancelRequestSection
                            appointment={apt}
                            onSubmit={requestCancelAppointment}
                            onSuccess={() => loadAppointments(true)}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl flex-shrink-0">
                        <span className="font-display font-bold text-2xl text-primary-600">
                          #{apt.serialNumber}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
