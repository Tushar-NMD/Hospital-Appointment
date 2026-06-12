"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Mail,
  Clock,
  Shield,
  Activity,
} from "lucide-react";
import Card from "@/components/ui/Card";

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description:
      "Book appointments with top doctors in just a few clicks. Choose your preferred date and time slot.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Expert Doctors",
    description:
      "Browse detailed profiles with degrees, experience, specializations, and patient reviews.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Mail,
    title: "Email Confirmations",
    description:
      "Receive instant email confirmations with appointment details and your serial number.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Clock,
    title: "Serial Queue System",
    description:
      "Get your token number and track your position in the queue for organized patient flow.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your health data is protected with industry-standard security and privacy measures.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Activity,
    title: "Real-time Updates",
    description:
      "Doctors update appointment status in real-time. Track waiting, confirmed, and completed visits.",
    color: "bg-teal-100 text-teal-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Why Choose MedCare
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Everything You Need for Healthcare
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A complete platform connecting patients with doctors for seamless
            appointment management and quality healthcare.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
