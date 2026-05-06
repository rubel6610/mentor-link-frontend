"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
}

const Logo = ({ variant = "default" }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <GraduationCap 
        className={cn(
          "w-6 h-6 transition-transform group-hover:scale-110",
          variant === "light" ? "text-white" : "text-emerald-600"
        )} 
      />
      <span 
        className={cn(
          "font-bold text-xl tracking-tight",
          variant === "light" 
            ? "text-white" 
            : "bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent"
        )}
      >
        MentorLink
      </span>
    </Link>
  );
};

export default Logo;