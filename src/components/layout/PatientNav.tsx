"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/patient/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/patient/appointments", label: "Appointments", icon: History },
  { href: "/patient/profile", label: "Profile", icon: User },
];

export default function PatientNav() {
  const pathname = usePathname();

  if (!pathname.startsWith("/patient")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg md:hidden">
      <div className="flex">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active ? "text-primary-600" : "text-gray-500"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
