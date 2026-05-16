"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Music2 } from "lucide-react";

type ToastProps = {
  message: string;
  show: boolean;
  subMessage?: string;
};

export default function Toast({
  message,
  show,
  subMessage,
}: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 shadow-2xl rounded-2xl px-4 py-3 min-w-[280px] backdrop-blur-xl">

            {/* ICON */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <CheckCircle2 className="text-purple-400" size={18} />
            </div>

            {/* TEXT */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                Added to Cart
              </span>

              <span className="text-xs text-zinc-400">
                {message}
              </span>

              {subMessage && (
                <span className="text-[11px] text-zinc-500 mt-0.5">
                  {subMessage}
                </span>
              )}
            </div>

            {/* RIGHT ICON */}
            <Music2 size={16} className="text-zinc-600 ml-auto" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}