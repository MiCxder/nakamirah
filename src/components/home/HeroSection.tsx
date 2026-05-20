"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import FadeIn from "@/components/ui/FadeIn";


export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const particles = [
    { top: "10%", left: "20%", duration: "12s" },
    { top: "30%", left: "70%", duration: "15s" },
    { top: "60%", left: "40%", duration: "18s" },
    { top: "80%", left: "10%", duration: "14s" },
    { top: "25%", left: "50%", duration: "16s" },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center scale-110 animate-slowZoom"
        style={{
          backgroundImage: "url('/hero-bg.jpeg')",
          transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
          filter: `blur(${Math.min(scrollY * 0.02, 4)}px)`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
            style={{
              top: p.top,
              left: p.left,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />

      <div
        className="relative z-10 max-w-3xl px-6 transition-all duration-700"
        style={{
          opacity: Math.max(1 - scrollY / 300, 0),
          transform: `translateY(${Math.min(scrollY * 0.3, 80)}px)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold">
            NAKAMIRAH BEATS
          </h1>

          <p className="mt-6 text-zinc-300 text-lg">
            Premium instrumentals for serious artists.
          </p>
        </motion.div>

        {/* CTA BUTTONS */}
    <div className="mt-8 flex gap-4 justify-center">
  <MagneticButton>
    <Link
      href="/beats"
      className="bg-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-[0_0_25px_rgba(168,85,247,0.3)]"
    >
      Browse Beats
    </Link>
  </MagneticButton>

  <MagneticButton>
    <Link
      href="/beats"
      className="border border-zinc-700 px-6 py-3 rounded-xl hover:border-purple-500 transition"
    >
      Listen Now
    </Link>
  </MagneticButton>
</div>

  </div>

</section>

  );
}