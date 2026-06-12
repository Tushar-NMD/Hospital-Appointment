"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Stethoscope, User, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PhotoUpload from "@/components/ui/PhotoUpload";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || "patient";
  const { login, register } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    photo: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDoctor = role === "doctor";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      if (!/^[a-zA-Z@.]+$/.test(form.email) || form.email.length > 20) {
        setError("Email can only contain letters (max 20 characters)");
        setLoading(false);
        return;
      }
      if (form.password.length !== 5) {
        setError("Password must be exactly 5 characters");
        setLoading(false);
        return;
      }
      const result = await login(form.email, form.password);
      if (result.success) {
        router.push(isDoctor ? "/doctor/dashboard" : "/patient/doctors");
      } else {
        setError(result.message);
      }
    } else {
      if (!form.name || !form.email || !form.password || !form.phone) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }
      if (form.name.length < 5 || form.name.length > 20) {
        setError("Name must be 5-20 characters");
        setLoading(false);
        return;
      }
      if (!/^[a-zA-Z@.]+$/.test(form.email) || form.email.length > 20) {
        setError("Email can only contain letters (max 20 characters)");
        setLoading(false);
        return;
      }
      const phoneDigits = form.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        setError("Phone must be exactly 10 digits");
        setLoading(false);
        return;
      }
      if (form.password.length !== 5) {
        setError("Password must be exactly 5 characters");
        setLoading(false);
        return;
      }
      if (!form.photo) {
        setError("Please upload your profile photo");
        setLoading(false);
        return;
      }
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: `+91${phoneDigits}`,
        photo: form.photo,
        role,
      });
      if (result.success) {
        router.push(isDoctor ? "/doctor/profile" : "/patient/profile");
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/30 mb-4">
            {isDoctor ? (
              <Stethoscope className="w-7 h-7 text-white" />
            ) : (
              <User className="w-7 h-7 text-white" />
            )}
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isDoctor ? "Doctor" : "Patient"}{" "}
            {mode === "login" ? "Login" : "Registration"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <Link
              href={`/auth/${mode}?role=patient`}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
                !isDoctor
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Patient
            </Link>
            <Link
              href={`/auth/${mode}?role=doctor`}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all ${
                isDoctor
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Doctor
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <PhotoUpload
                  value={form.photo}
                  name={form.name || "User"}
                  onChange={(photo) => setForm({ ...form, photo })}
                  onClear={() => setForm({ ...form, photo: "" })}
                  required
                />
                <Input
                  id="name"
                  label="Full Name"
                  placeholder={isDoctor ? "Dr. John Smith" : "John Smith"}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 20) })}
                  required
                  maxLength={20}
                />
              </>
            )}
            <Input
              id="email"
              label="Email Address"
              type="text"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z@.]/g, "").slice(0, 20);
                setForm({ ...form, email: val });
              }}
              required
              maxLength={20}
            />
            {mode === "register" && (
              <Input
                id="phone"
                label="Phone Number"
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, phone: val });
                }}
                required
              />
            )}
            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="5 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value.slice(0, 5) })}
                required
                maxLength={5}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {mode === "login" && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
              <p className="font-medium text-gray-700 mb-1">Demo Credentials:</p>
              {isDoctor ? (
                <p>doctor@medcare.com / doctor123</p>
              ) : (
                <p>patient@medcare.com / patient123</p>
              )}
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href={`/auth/register?role=${role}`}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href={`/auth/login?role=${role}`}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  Login
                </Link>
              </>
            )}
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-primary-600 inline-flex items-center gap-1">
            <Heart className="w-3 h-3" />
            Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
