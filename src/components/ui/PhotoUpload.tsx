"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { readFileAsDataUrl, validateImageFile } from "@/lib/image";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";

interface PhotoUploadProps {
  value?: string;
  name: string;
  onChange: (photo: string) => void;
  onClear?: () => void;
  label?: string;
  required?: boolean;
  size?: "md" | "lg";
  className?: string;
}

export default function PhotoUpload({
  value,
  name,
  onChange,
  onClear,
  label = "Profile Photo",
  required = false,
  size = "lg",
  className,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    const dataUrl = await readFileAsDataUrl(file);
    onChange(dataUrl);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="flex items-center gap-5">
        <div className="relative group">
          <Avatar src={value} name={name} size={size} className="ring-4 ring-white shadow-lg" />
          {value && onClear && (
            <button
              type="button"
              onClick={() => {
                onClear();
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary-300 text-primary-600 text-sm font-medium hover:bg-primary-50 hover:border-primary-400 transition-all"
          >
            <Camera className="w-4 h-4" />
            {value ? "Change Photo" : "Upload Photo"}
          </button>
          <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP. Max 2MB.</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
