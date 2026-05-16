"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/lib/AudioContext";
import Link from "next/link";

type Beat = {
  id: number;
  title: string;
  genre: string;
  bpm: number;
  price: number;
  cover: string;
  preview: string;
};

export default function BeatCard({ beat }: { beat: Beat }) {
  // ✅ Get audio state ONCE (you duplicated this before)
  const { current, play, pause, isPlaying } = useAudio();

  // ✅ Check if THIS beat is the active one
  const isActive = current === beat.preview;

  // ✅ Correct play/pause logic
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation when clicking play

    // If same beat is playing → pause
    if (isActive && isPlaying) {
      pause();
      return;
    }

    // Otherwise → play this beat
    play(beat.preview, beat.title);
  };

  return (
    <Link href={`/beats/${beat.id}`}>
      <div className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">

        {/* IMAGE */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={beat.cover}
            alt={beat.title}
            fill
            className="object-cover group-hover:scale-110 transition duration-700 ease-out"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* PLAY BUTTON */}
          <button
            onClick={handlePlay}
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
          </button>

          {/* PRICE */}
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-sm text-purple-400 font-semibold">
            ${beat.price}
          </div>
        </div>

        {/* INFO */}
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-purple-400 transition">
            {beat.title}
          </h3>

          <p className="text-xs text-zinc-400 uppercase tracking-widest">
            {beat.genre} • {beat.bpm} BPM
          </p>

          {/* Glow divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-40 group-hover:opacity-100 transition" />

          <p className="text-xs text-zinc-500 group-hover:text-zinc-300 transition">
            Click to view license options
          </p>
        </div>

      </div>
    </Link>
  );
}