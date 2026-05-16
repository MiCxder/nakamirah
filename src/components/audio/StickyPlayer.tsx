"use client";

import { useAudio } from "@/lib/AudioContext";
import { Play, Pause } from "lucide-react";

export default function StickyPlayer() {
  const {
    current,
    title,
    isPlaying,
    play,
    pause,
    currentTime,
    duration,
    showPlayer,
    setShowPlayer,
  } = useAudio();

  // Hide if no audio OR user closed player
  if (!current || !showPlayer) return null;

  const progressPercent =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (t: number) => {
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 z-50">

      {/* FLOATING PLAYER CARD (must be relative for close button) */}
      <div className="relative bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl rounded-2xl p-4 shadow-[0_0_25px_rgba(0,0,0,0.6)]">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowPlayer(false)}
          className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white"
        >
          ×
        </button>

        {/* TOP INFO */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium truncate">
              {title || "Now Playing"}
            </span>
            <span className="text-xs text-zinc-400">
              Beat Preview
            </span>
          </div>

          <button
            onClick={() => (isPlaying ? pause() : play(current, title))}
            className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-1">

          <div className="relative w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-purple-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

        </div>

      </div>
    </div>
  );
}