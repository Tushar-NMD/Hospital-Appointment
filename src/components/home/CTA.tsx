"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-12 sm:p-16 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of patients and doctors using MedCare for seamless
              healthcare appointment management.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register?role=patient">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50"
                >
                  Register as Patient
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/register?role=doctor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Register as Doctor
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
