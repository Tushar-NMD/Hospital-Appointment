"use client";

import Link from "next/link";
import { Star, MapPin, Clock, IndianRupee } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { User, DoctorProfile } from "@/types";

interface DoctorCardProps {
  user: User;
  profile: DoctorProfile;
}

export default function DoctorCard({ user, profile }: DoctorCardProps) {
  const photo = user.photo || profile.image;

  return (
    <Card hover className="overflow-hidden">
      <div className="p-6">
        <div className="flex gap-4">
          <Avatar src={photo} name={user.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-lg text-gray-900 truncate">
              {user.name}
            </h3>
            <p className="text-primary-600 font-medium text-sm">
              {profile.specialization}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="text-sm font-semibold">{profile.rating}</span>
              <span className="text-xs text-gray-400">
                ({profile.totalPatients}+ patients)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{profile.hospital}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{profile.experience} years experience</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              ₹{profile.consultationFee}
            </span>
            <span>consultation fee</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.availableDays.slice(0, 3).map((day) => (
            <span
              key={day}
              className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium"
            >
              {day.slice(0, 3)}
            </span>
          ))}
          {profile.availableDays.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{profile.availableDays.length - 3} more
            </span>
          )}
        </div>

        <Link href={`/patient/doctors/${user.id}`} className="block mt-5">
          <Button className="w-full">View Profile & Book</Button>
        </Link>
      </div>
    </Card>
  );
}
