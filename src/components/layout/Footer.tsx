import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Med<span className="text-primary-400">Care</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your trusted platform for booking doctor appointments, managing
              patient queues, and delivering quality healthcare experiences.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#home" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-primary-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-primary-400 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">For Users</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/login?role=patient" className="hover:text-primary-400 transition-colors">
                  Patient Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=patient" className="hover:text-primary-400 transition-colors">
                  Patient Register
                </Link>
              </li>
              <li>
                <Link href="/auth/login?role=doctor" className="hover:text-primary-400 transition-colors">
                  Doctor Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=doctor" className="hover:text-primary-400 transition-colors">
                  Doctor Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                support@medcare.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                +91 1800-MEDCARE
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                123 Healthcare Avenue, New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MedCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
