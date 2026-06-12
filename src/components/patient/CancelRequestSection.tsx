"use client";

import { useEffect, useState } from "react";
import { Clock, MessageSquare, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Appointment } from "@/types";
import { formatCountdown } from "@/lib/utils";
import {
  canRequestCancellation,
  parseAppointmentDateTime,
} from "@/lib/appointment-queue";

interface CancelRequestSectionProps {
  appointment: Appointment;
  onSubmit: (id: string, message: string) => Promise<{ success: boolean; message: string }>;
  onSuccess: () => void;
}

export default function CancelRequestSection({
  appointment,
  onSubmit,
  onSuccess,
}: CancelRequestSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const appointmentTime = parseAppointmentDateTime(
    appointment.date,
    appointment.timeSlot
  );
  const canCancel = canRequestCancellation(
    appointment.status,
    appointment.date,
    appointment.timeSlot,
    appointment.cancelRequest
  );

  useEffect(() => {
    const tick = () => {
      setTimeLeft(Math.max(0, appointmentTime.getTime() - Date.now()));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [appointment.date, appointment.timeSlot, appointmentTime]);

  if (appointment.cancelRequest?.status === "pending") {
    return (
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-center gap-2 text-amber-800 font-medium text-sm mb-1">
          <Clock className="w-4 h-4" />
          Cancel Request Pending
        </div>
        <p className="text-sm text-amber-700">
          Waiting for doctor to review your request.
        </p>
        <p className="text-xs text-amber-600 mt-2 bg-amber-100/50 rounded-lg p-2">
          <span className="font-medium">Your reason: </span>
          {appointment.cancelRequest.message}
        </p>
      </div>
    );
  }

  if (appointment.cancelRequest?.status === "rejected") {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
        Your cancel request was declined by the doctor. Please attend your
        appointment or contact the clinic directly.
      </div>
    );
  }

  if (!canCancel && appointment.status !== "cancelled") {
    if (timeLeft <= 0 && ["waiting", "confirmed"].includes(appointment.status)) {
      return (
        <div className="mt-4 p-3 bg-gray-100 rounded-xl text-sm text-gray-600 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Cancellation window closed — appointment time has passed.
        </div>
      );
    }
    return null;
  }

  const handleSubmit = async () => {
    setError("");
    if (message.trim().length < 10) {
      setError("Please write at least 10 characters explaining why you want to cancel.");
      return;
    }
    setSubmitting(true);
    const result = await onSubmit(appointment.id, message.trim());
    setSubmitting(false);
    if (result.success) {
      setShowForm(false);
      setMessage("");
      onSuccess();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            Request Cancellation
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            You can cancel only before your appointment time.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg">
          <Clock className="w-4 h-4" />
          {formatCountdown(timeLeft)} left
        </div>
      </div>

      {!showForm ? (
        <Button
          size="sm"
          variant="danger"
          onClick={() => setShowForm(true)}
        >
          Request Cancel
        </Button>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Why do you want to cancel?
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. I have an emergency and cannot visit on this date..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="danger"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Cancel Request"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
