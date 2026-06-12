"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Stethoscope, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DoctorCard from "@/components/patient/DoctorCard";
import Input from "@/components/ui/Input";
import { useApp } from "@/context/AppContext";
import { DoctorProfile, User } from "@/types";

export default function DoctorsPage() {
  const { fetchDoctors } = useApp();
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Array<{ user: User; profile: DoctorProfile }>>([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    const data = await fetchDoctors(search || undefined);
    setDoctors(data);
    setLoading(false);
  }, [fetchDoctors, search]);

  useEffect(() => {
    const timer = setTimeout(loadDoctors, 300);
    return () => clearTimeout(timer);
  }, [loadDoctors]);

  return (
    <ProtectedRoute allowedRole="patient">
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900">
                Find Your Doctor
              </h1>
            </div>
            <p className="text-gray-600">
              Browse our network of qualified doctors and book your appointment.
            </p>
          </motion.div>

          <div className="mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <Input
              placeholder="Search by name, specialization, or hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No doctors found matching your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(({ user, profile }, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DoctorCard user={user} profile={profile} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
