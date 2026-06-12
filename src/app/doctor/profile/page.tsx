"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Save } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import PhotoUpload from "@/components/ui/PhotoUpload";
import { useApp } from "@/context/AppContext";
import { DoctorProfile } from "@/types";

const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const DEFAULT_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

export default function DoctorProfilePage() {
  const router = useRouter();
  const { user, doctorProfile, updateDoctorProfile } = useApp();

  const [form, setForm] = useState<Partial<DoctorProfile>>({
    specialization: "",
    degree: "",
    experience: 0,
    hospital: "",
    bio: "",
    consultationFee: 0,
    availableDays: [],
    availableTimeSlots: DEFAULT_SLOTS,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (doctorProfile || user) {
      setForm({
        specialization: doctorProfile?.specialization || "",
        degree: doctorProfile?.degree || "",
        experience: doctorProfile?.experience || 0,
        hospital: doctorProfile?.hospital || "",
        bio: doctorProfile?.bio || "",
        consultationFee: doctorProfile?.consultationFee || 0,
        availableDays: doctorProfile?.availableDays || [],
        availableTimeSlots: doctorProfile?.availableTimeSlots?.length
          ? doctorProfile.availableTimeSlots
          : DEFAULT_SLOTS,
        image: doctorProfile?.image || user?.photo || "",
      });
    }
  }, [doctorProfile, user]);

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays?.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...(prev.availableDays || []), day],
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (
      !form.specialization ||
      !form.degree ||
      !form.hospital ||
      !form.bio ||
      !form.availableDays?.length
    ) {
      setError("Please fill in all required fields and select available days");
      return;
    }
    if (!form.image) {
      setError("Please upload your profile photo");
      return;
    }

    setSaving(true);
    setError("");
    const result = await updateDoctorProfile({
      userId: user.id,
      specialization: form.specialization!,
      degree: form.degree!,
      experience: form.experience || 0,
      hospital: form.hospital!,
      bio: form.bio!,
      consultationFee: form.consultationFee || 0,
      availableDays: form.availableDays!,
      availableTimeSlots: form.availableTimeSlots || DEFAULT_SLOTS,
      rating: doctorProfile?.rating || 4.5,
      totalPatients: doctorProfile?.totalPatients || 0,
      profileComplete: true,
      image: form.image,
    });

    if (result.success) {
      setSaved(true);
      setTimeout(() => router.push("/doctor/dashboard"), 1500);
    } else {
      setError(result.message);
    }
    setSaving(false);
  };

  return (
    <ProtectedRoute allowedRole="doctor">
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900">
                Doctor Profile Setup
              </h1>
            </div>
            <p className="text-gray-600">
              Complete your profile so patients can find and book appointments with you.
            </p>
          </motion.div>

          <Card className="p-6 sm:p-8 space-y-6">
            <PhotoUpload
              value={form.image}
              name={user?.name || "Doctor"}
              onChange={(photo) => setForm({ ...form, image: photo })}
              onClear={() => setForm({ ...form, image: "" })}
              required
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="specialization"
                label="Specialization *"
                placeholder="e.g. Cardiology"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
              <Input
                id="degree"
                label="Degree & Qualifications *"
                placeholder="e.g. MBBS, MD (Cardiology)"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="experience"
                label="Years of Experience"
                type="number"
                min="0"
                value={form.experience || ""}
                onChange={(e) =>
                  setForm({ ...form, experience: parseInt(e.target.value) || 0 })
                }
              />
              <Input
                id="fee"
                label="Consultation Fee (₹)"
                type="number"
                min="0"
                value={form.consultationFee || ""}
                onChange={(e) =>
                  setForm({ ...form, consultationFee: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <Input
              id="hospital"
              label="Hospital / Clinic *"
              placeholder="e.g. Apollo Hospital, Delhi"
              value={form.hospital}
              onChange={(e) => setForm({ ...form, hospital: e.target.value })}
            />

            <Textarea
              id="bio"
              label="About You *"
              placeholder="Tell patients about your expertise..."
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days *
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      form.availableDays?.includes(day)
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
            )}

            <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
              <Save className="w-5 h-5" />
              {saved ? "Profile Saved! Redirecting..." : saving ? "Saving..." : "Save Profile"}
            </Button>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
