"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Settings,
  IndianRupee,
  CreditCard,
  Loader2,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppointmentRow from "@/components/doctor/AppointmentRow";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { Appointment, AppointmentStatus } from "@/types";
import { getTodayString, formatDate, formatCurrency } from "@/lib/utils";

type FilterStatus = "all" | AppointmentStatus;

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user, doctorProfile, fetchDoctorAppointments } = useApp();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    paymentPending: 0,
    paymentCollected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && doctorProfile && !doctorProfile.profileComplete) {
      router.push("/doctor/profile");
    }
  }, [user, doctorProfile, router]);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    const data = await fetchDoctorAppointments(selectedDate);
    setAppointments(data.appointments);
    setStats(data.stats);
    setLoading(false);
  }, [fetchDoctorAppointments, selectedDate]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const statCards = [
    { label: "Total Today", value: stats.total, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Waiting", value: stats.waiting, icon: AlertCircle, color: "bg-yellow-100 text-yellow-600" },
    { label: "Confirmed", value: stats.confirmed, icon: Clock, color: "bg-indigo-100 text-indigo-600" },
    { label: "In Progress", value: stats.inProgress, icon: Calendar, color: "bg-purple-100 text-purple-600" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "bg-red-100 text-red-600" },
  ];

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "waiting", label: "Waiting" },
    { key: "confirmed", label: "Confirmed" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <ProtectedRoute allowedRole="doctor">
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-primary-600" />
                </div>
                <h1 className="font-display text-3xl font-bold text-gray-900">
                  Doctor Dashboard
                </h1>
              </div>
              <p className="text-gray-600">
                Welcome, {user?.name}. Manage your daily patient appointments.
              </p>
            </div>
            <Link href="/doctor/profile">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.paymentPending}</p>
                <p className="text-sm text-gray-500">Payments Pending</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.paymentCollected)}
                </p>
                <p className="text-sm text-gray-500">Collected Today</p>
              </div>
            </Card>
          </div>

          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formatDate(selectedDate)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filter === f.key
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div>
            <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">
              Patient Queue (Serial Order)
            </h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No appointments for this date
                  {filter !== "all" ? ` with status "${filter}"` : ""}.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {filtered.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <AppointmentRow
                      appointment={apt}
                      onRefresh={loadAppointments}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
