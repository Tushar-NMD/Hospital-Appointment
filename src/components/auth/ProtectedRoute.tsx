"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/auth/login?role=${allowedRole}`);
      } else if (user.role !== allowedRole) {
        router.push(
          user.role === "doctor" ? "/doctor/dashboard" : "/patient/doctors"
        );
      }
    }
  }, [user, isLoading, allowedRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== allowedRole) return null;

  return <>{children}</>;
}
