"use client";

import { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import PatientNav from "@/components/layout/PatientNav";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Navbar />
      <main className="pb-16 md:pb-0">{children}</main>
      <PatientNav />
    </AppProvider>
  );
}
