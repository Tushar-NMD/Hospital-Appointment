"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Clock,
  Hash,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useApp } from "@/context/AppContext";
import { Appointment, AppointmentStatus } from "@/types";
import {
  formatCurrency,
  getPaymentMethodLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";

interface AppointmentRowProps {
  appointment: Appointment;
  onRefresh: () => void;
}

const statusActions: Record<
  AppointmentStatus,
  { next?: AppointmentStatus; label?: string }[]
> = {
  waiting: [
    { next: "confirmed", label: "Confirm" },
    { next: "cancelled", label: "Cancel" },
  ],
  confirmed: [
    { next: "in-progress", label: "Start Treatment" },
    { next: "cancelled", label: "Cancel" },
  ],
  "in-progress": [{ next: "completed", label: "Mark Completed" }],
  completed: [],
  cancelled: [],
};

export default function AppointmentRow({ appointment, onRefresh }: AppointmentRowProps) {
  const { updateAppointmentStatus, updatePaymentStatus, reviewCancelRequest } =
    useApp();
  const [expanded, setExpanded] = useState(
    appointment.cancelRequest?.status === "pending"
  );
  const [updating, setUpdating] = useState(false);
  const actions = statusActions[appointment.status];
  const hasPendingCancel = appointment.cancelRequest?.status === "pending";

  const handleStatus = async (status: AppointmentStatus) => {
    setUpdating(true);
    await updateAppointmentStatus(appointment.id, status);
    onRefresh();
    setUpdating(false);
  };

  const handlePayment = async () => {
    setUpdating(true);
    await updatePaymentStatus(appointment.id, "paid");
    onRefresh();
    setUpdating(false);
  };

  const handleCancelReview = async (action: "approve" | "reject") => {
    setUpdating(true);
    await reviewCancelRequest(appointment.id, action);
    onRefresh();
    setUpdating(false);
  };

  return (
    <Card
      className={`overflow-hidden ${hasPendingCancel ? "ring-2 ring-amber-400" : ""}`}
    >
      <div
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <Avatar
          src={appointment.patientPhoto}
          name={appointment.patientName}
          size="md"
          className="rounded-xl"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusLabel(appointment.status)}
            </Badge>
            <Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
              {getPaymentStatusLabel(appointment.paymentStatus)}
            </Badge>
            {hasPendingCancel && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                Cancel Requested
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {appointment.timeSlot}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5" />
              Token #{appointment.serialNumber}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              {formatCurrency(appointment.consultationFee)}
            </span>
          </div>
        </div>

        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
          {hasPendingCancel && appointment.cancelRequest && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-medium text-sm">
                <AlertTriangle className="w-4 h-4" />
                Patient Cancel Request
              </div>
              <p className="text-sm text-amber-900 bg-white/60 rounded-lg p-3">
                {appointment.cancelRequest.message}
              </p>
              <p className="text-xs text-amber-600">
                Requested on{" "}
                {new Date(appointment.cancelRequest.requestedAt).toLocaleString(
                  "en-IN"
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="danger"
                  disabled={updating}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelReview("approve");
                  }}
                >
                  Approve Cancellation
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updating}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelReview("reject");
                  }}
                >
                  Reject Request
                </Button>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-gray-400" />
              {appointment.patientName}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              {appointment.patientPhone}
            </div>
            <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {appointment.patientEmail}
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary-900">
              <CreditCard className="w-4 h-4" />
              Payment Details
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">
                <span className="text-gray-500">Amount: </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(appointment.consultationFee)}
                </span>
              </div>
              <div className="text-gray-600">
                <span className="text-gray-500">Method: </span>
                <span className="font-medium">
                  {getPaymentMethodLabel(appointment.paymentMethod)}
                </span>
              </div>
              <div className="text-gray-600">
                <span className="text-gray-500">Status: </span>
                <Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
                  {getPaymentStatusLabel(appointment.paymentStatus)}
                </Badge>
              </div>
            </div>
            {appointment.paymentStatus === "pending" && appointment.status !== "cancelled" && (
              <Button
                size="sm"
                variant="secondary"
                className="mt-2"
                disabled={updating}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePayment();
                }}
              >
                Mark Payment as Received
              </Button>
            )}
          </div>

          {appointment.symptoms && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <span className="font-medium text-gray-700">Symptoms: </span>
              <span className="text-gray-600">{appointment.symptoms}</span>
            </div>
          )}

          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button
                  key={action.next}
                  size="sm"
                  disabled={updating}
                  variant={
                    action.next === "cancelled"
                      ? "danger"
                      : action.next === "completed"
                      ? "secondary"
                      : "primary"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (action.next) handleStatus(action.next);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
