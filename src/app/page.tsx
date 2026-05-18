"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { beats } from "@/data/beats";
import BeatCard from "@/components/beat/BeatCard";
import MagneticButton from "@/components/ui/MagneticButton";
import FadeIn from "@/components/ui/FadeIn";

export default function HomePage() {
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
  { top: "70%", left: "80%", duration: "13s" },
  { top: "50%", left: "30%", duration: "17s" },
  { top: "15%", left: "85%", duration: "19s" },
  { top: "40%", left: "60%", duration: "11s" },
  { top: "90%", left: "25%", duration: "18s" },
  { top: "35%", left: "15%", duration: "14s" },
  { top: "75%", left: "55%", duration: "20s" },
  { top: "20%", left: "75%", duration: "16s" },
  { top: "65%", left: "5%", duration: "13s" },
  { top: "85%", left: "45%", duration: "17s" },
];

  return (
    <main className="flex flex-col">

      {/* HERO SECTION (RESTORED STYLE) */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden">

  {/* BACKGROUND IMAGE WITH ANIMATION */}
<div
  className="absolute inset-0 bg-cover bg-center scale-110 animate-slowZoom will-change-transform"
  style={{
  backgroundImage: "url('/hero-bg.jpeg')",
  transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
  filter: `blur(${Math.min(scrollY * 0.02, 4)}px)`,
}}
/>

{/* PARTICLES */}
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

  {/* DARK OVERLAY (important for readability) */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />

  {/* CONTENT */}
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
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <h1 className="text-5xl md:text-7xl font-bold">
    NAKAMIRAH BEATS
  </h1>

  <p className="mt-6 text-zinc-300 text-lg">
    Premium instrumentals, beats, and sample packs for serious artists.
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

      {/* FEATURED BEATS */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Featured Beats</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {beats.slice(0, 6).map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      </section>

    </main>
  );
}