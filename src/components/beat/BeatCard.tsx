"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/lib/AudioContext";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Beat as BeatType } from "@/types/beat";

export default function BeatCard({ beat }: { beat: BeatType }) {
  const { current, play, pause, isPlaying } = useAudio();

  const isActive = current === beat.preview;

  const displayPrice =
    beat.price_basic ?? beat.price_premium ?? beat.price_exclusive ?? 0;

  const coverSrc = beat.cover ?? "/hero-bg.jpeg";

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isActive && isPlaying) {
      pause();
      return;
    }

    play(beat.preview, beat.title);
  };

  return (
    <Link href={`/beats/${beat.id}`}>
      <motion.div
        className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl cursor-pointer"
        whileHover={{
          scale: 1.02,
          boxShadow: "0px 20px 50px rgba(168,85,247,0.25)",
        }}
        whileTap={{ scale: 0.98 }}
      >

        {/* IMAGE */}
        <div className="relative h-52 w-full overflow-hidden">

          {/*  IMAGE MOTION */}
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src={coverSrc}
             alt={beat.title}
             fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-700 ease-out group-hover:blur-[1.5px] group-hover:brightness-75"
            />
          </motion.div>

          {/*  GRADIENT OVERLAY (animated feel) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition duration-500" />

          {/* SOFT GLOW */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />

          {/* PLAY BUTTON */}
          <motion.button
            onClick={handlePlay}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute bottom-3 left-3 flex items-center justify-center w-11 h-11 rounded-full border transition shadow-lg backdrop-blur-md ${
              isActive && isPlaying
                ? "bg-purple-600 border-purple-500"
                : "bg-white/10 border-white/10 hover:bg-purple-600"
            }`}
          >
            {isActive && isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </motion.button>

          {/* PRICE */}
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-sm text-purple-400 font-semibold">
            ${displayPrice}
          </div>
        </div>

        {/* INFO */}
        <div className="p-4 space-y-2">

          <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-purple-400">
            {beat.title}
          </h3>

          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            {beat.genre} • {beat.bpm} BPM
          </p>

          {/*  animated divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-40 group-hover:opacity-100 transition duration-500" />

          <p className="text-xs text-zinc-500 group-hover:text-zinc-300 transition">
            Click to view license options
          </p>
        </div>

      </motion.div>
    </Link>
  );
}