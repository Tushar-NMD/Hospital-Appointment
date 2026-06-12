"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Save, Mail, Phone, Calendar } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PhotoUpload from "@/components/ui/PhotoUpload";
import Card from "@/components/ui/Card";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";

export default function PatientProfilePage() {
  const { user, updatePatientProfile } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", photo: "" });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        phone: user.phone,
        photo: user.photo || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!form.name || !form.phone) {
      setError("Please fill in all required fields");
      return;
    }
    if (!form.photo) {
      setError("Please upload your profile photo");
      return;
    }

    setSaving(true);
    setError("");
    const result = await updatePatientProfile({
      name: form.name,
      phone: form.phone,
      photo: form.photo,
    });

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(result.message);
    }
    setSaving(false);
  };

  return (
    <ProtectedRoute allowedRole="patient">
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900">My Profile</h1>
            </div>
            <p className="text-gray-600">View and update your personal information and photo.</p>
          </motion.div>

          <Card className="p-6 sm:p-8 space-y-6">
            <PhotoUpload
              value={form.photo}
              name={form.name || user?.name || "Patient"}
              onChange={(photo) => setForm({ ...form, photo })}
              onClear={() => setForm({ ...form, photo: "" })}
              required
            />

            <Input
              id="name"
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Input
              id="phone"
              label="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              {user?.createdAt && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Member since {formatDate(user.createdAt.split("T")[0])}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="capitalize">{user?.role}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
            )}

            <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
              <Save className="w-5 h-5" />
              {saved ? "Profile Saved!" : saving ? "Saving..." : "Save Profile"}
            </Button>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
