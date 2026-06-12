"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-20 h-20 text-xl",
  xl: "w-32 h-32 text-4xl",
};

const imageSizes = { sm: 32, md: 48, lg: 80, xl: 128 };

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isDataUrl = src?.startsWith("data:");
  const isRemote = src?.startsWith("http");

  if (src && (isDataUrl || isRemote)) {
    if (isDataUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={cn("rounded-2xl object-cover flex-shrink-0", sizes[size], className)}
        />
      );
    }
    return (
      <div className={cn("relative rounded-2xl overflow-hidden flex-shrink-0", sizes[size], className)}>
        <Image src={src} alt={name} fill className="object-cover" sizes={`${imageSizes[size]}px`} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
