"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useApp();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardLink =
    user?.role === "doctor" ? "/doctor/dashboard" : "/patient/doctors";
  const profileLink =
    user?.role === "doctor" ? "/doctor/profile" : "/patient/profile";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span
              className={cn(
                "font-display font-bold text-xl",
                scrolled || !isHome ? "text-gray-900" : "text-white"
              )}
            >
              Med<span className="text-primary-400">Care</span>
            </span>
          </Link>

          {isHome && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary-400",
                    scrolled ? "text-gray-700" : "text-white/90"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === "patient" && (
                  <>
                    <Link href="/patient/doctors">
                      <Button 
                        variant={pathname.startsWith("/patient/doctors") ? "primary" : "ghost"} 
                        size="sm" 
                        className={!pathname.startsWith("/patient/doctors") && (scrolled || !isHome) ? "" : "text-white hover:bg-white/10"}
                      >
                        Find Doctors
                      </Button>
                    </Link>
                    <Link href="/patient/appointments">
                      <Button 
                        variant={pathname.startsWith("/patient/appointments") ? "primary" : "ghost"} 
                        size="sm" 
                        className={!pathname.startsWith("/patient/appointments") && (scrolled || !isHome) ? "" : "text-white hover:bg-white/10"}
                      >
                        My Appointments
                      </Button>
                    </Link>
                    <Link href="/patient/profile">
                      <Button 
                        variant={pathname === "/patient/profile" ? "primary" : "ghost"} 
                        size="sm" 
                        className={pathname !== "/patient/profile" && (scrolled || !isHome) ? "" : "text-white hover:bg-white/10"}
                      >
                        Profile
                      </Button>
                    </Link>
                  </>
                )}
                {user.role === "doctor" && (
                  <>
                    <Link href="/doctor/dashboard">
                      <Button 
                        variant={pathname === "/doctor/dashboard" ? "primary" : "ghost"} 
                        size="sm" 
                        className={pathname !== "/doctor/dashboard" && (scrolled || !isHome) ? "" : "text-white hover:bg-white/10"}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/doctor/profile">
                      <Button 
                        variant={pathname === "/doctor/profile" ? "primary" : "ghost"} 
                        size="sm" 
                        className={pathname !== "/doctor/profile" && (scrolled || !isHome) ? "" : "text-white hover:bg-white/10"}
                      >
                        Profile
                      </Button>
                    </Link>
                  </>
                )}
                <Link
                  href={profileLink}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Avatar src={user.photo} name={user.name} size="sm" className="rounded-lg" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login?role=patient">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={scrolled || !isHome ? "" : "text-white hover:bg-white/10"}
                  >
                    Patient Login
                  </Button>
                </Link>
                <Link href="/auth/login?role=doctor">
                  <Button size="sm">Doctor Login</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={cn("w-6 h-6", scrolled || !isHome ? "text-gray-900" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", scrolled || !isHome ? "text-gray-900" : "text-white")} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {isHome &&
                navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-gray-700 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              {user ? (
                <>
                  <Link href={dashboardLink} onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login?role=patient" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Patient Login
                    </Button>
                  </Link>
                  <Link href="/auth/login?role=doctor" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Doctor Login</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
