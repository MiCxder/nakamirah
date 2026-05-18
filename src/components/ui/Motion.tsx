"use client";

import { motion } from "framer-motion";

/* 🔥 Container for stagger animations */
export const MotionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/* 🔥 Individual item animation */
export const MotionItem = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 40,
          scale: 0.96,
        },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/* 🔥 Hover magnetic feel */
export const MotionHover = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -4,
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
};