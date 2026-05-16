"use client";

import { ButtonHTMLAttributes, useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  success?: boolean;
};

export default function GlassButton({
  children,
  className = "",
  loading = false,
  success = false,
  disabled,
  ...props
}: Props) {
  const isDisabled = disabled || loading || success;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        relative overflow-hidden rounded-xl px-4 py-3 font-semibold
        backdrop-blur-xl border transition-all duration-300
        active:scale-[0.97]
        disabled:opacity-60 disabled:cursor-not-allowed

        /* LIQUID GLASS BASE */
        bg-white/10 border-white/20 text-white
        hover:bg-white/15 hover:border-white/30

        /* LIQUID SHINE SWEEP */
        before:absolute before:inset-0
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/10
        before:to-transparent
        before:translate-x-[-120%]
        hover:before:translate-x-[120%]
        before:transition-transform
        before:duration-700

        ${className}
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {/* LOADING STATE */}
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}

        {/* SUCCESS STATE */}
        {success && <Check className="w-4 h-4 text-green-400" />}

        {/* LABEL */}
        <span>{children}</span>
      </span>
    </button>
  );
}