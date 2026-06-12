"use client";

import { motion } from "framer-motion";
import { Activity, Users } from "lucide-react";
import { QueueInfo, AppointmentStatus } from "@/types";

const STEPS: { key: AppointmentStatus; label: string }[] = [
  { key: "waiting", label: "Waiting" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in-progress", label: "In Treatment" },
  { key: "completed", label: "Done" },
];

const STATUS_INDEX: Record<string, number> = {
  waiting: 0,
  confirmed: 1,
  "in-progress": 2,
  completed: 3,
};

interface WaitingProgressLineProps {
  status: AppointmentStatus;
  queueInfo: QueueInfo;
}

export default function WaitingProgressLine({
  status,
  queueInfo,
}: WaitingProgressLineProps) {
  const activeStep = STATUS_INDEX[status] ?? 0;
  const lineProgress =
    status === "in-progress"
      ? 75
      : status === "confirmed"
      ? 50
      : queueInfo.progressPercent;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-800">
          <Activity className="w-4 h-4 animate-pulse" />
          Live Queue Update
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary-600 bg-white/70 px-2 py-1 rounded-full">
          <Users className="w-3.5 h-3.5" />
          {queueInfo.ahead === 0
            ? "You're next!"
            : `${queueInfo.ahead} patient${queueInfo.ahead > 1 ? "s" : ""} ahead`}
        </div>
      </div>

      <div className="relative h-2 bg-white/80 rounded-full overflow-hidden mb-3">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${lineProgress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ left: ["-10%", "110%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="flex justify-between relative">
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
        {STEPS.map((step, index) => {
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;
          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10"
            >
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  isActive
                    ? "bg-primary-600 border-primary-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
                animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {index + 1}
              </motion.div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isCurrent ? "text-primary-700" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-primary-700 mt-3 text-center">
        Token #{queueInfo.position} · Now serving #
        {queueInfo.currentServing}
        {queueInfo.nowServingName
          ? ` (${queueInfo.nowServingName})`
          : ""} · {queueInfo.total} in queue today
      </p>
    </div>
  );
}
