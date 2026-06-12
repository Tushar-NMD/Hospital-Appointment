import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
