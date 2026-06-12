"use client";

import { Banknote, Smartphone } from "lucide-react";
import { PaymentMethod } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";

interface PaymentMethodSelectProps {
  value: PaymentMethod | "";
  onChange: (method: PaymentMethod) => void;
  fee: number;
}

const methods: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Banknote;
}[] = [
  {
    id: "cash",
    label: "Cash on Visit",
    description: "Pay at the clinic on appointment day",
    icon: Banknote,
  },
  {
    id: "upi",
    label: "UPI",
    description: "Pay via UPI — doctor will confirm receipt",
    icon: Smartphone,
  },
];

export default function PaymentMethodSelect({
  value,
  onChange,
  fee,
}: PaymentMethodSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Payment Method <span className="text-red-500">*</span>
      </label>
      <p className="text-sm text-gray-500 mb-3">
        Consultation fee: <span className="font-semibold text-gray-900">{formatCurrency(fee)}</span>
      </p>
      <div className="grid grid-cols-1 gap-2">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
              value === method.id
                ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                : "border-gray-200 hover:border-primary-300 bg-white"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                value === method.id ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"
              )}
            >
              <method.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{method.label}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
