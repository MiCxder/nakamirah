"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/lib/AudioContext";

export default function WaveformPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);
  const loadingRef = useRef(false);

  const [progress, setProgress] = useState(0); // 0 - 100

  const { current, play, isPlaying } = useAudio();

const isActive = current === url;

  useEffect(() => {
    if (!containerRef.current) return;

    // ---------------------------
    // INIT WAVESURFER
    // ---------------------------
    if (!waveRef.current) {
      waveRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#3f3f46",
        progressColor: "#a855f7",
        cursorColor: "#a855f7",
        barWidth: 2,
        barGap: 2,
        barRadius: 3,
        height: 80,
        normalize: true,
      });

      const wave = waveRef.current;

      // ---------------------------
      // REAL-TIME PROGRESS TRACKING
      // ---------------------------
      wave.on("audioprocess", () => {
        const current = wave.getCurrentTime();
        const duration = wave.getDuration();

        if (duration > 0) {
          setProgress((current / duration) * 100);
        }
      });

      // also update when seeking
      wave.on("interaction", () => {
  const currentTime = wave.getCurrentTime();
  const duration = wave.getDuration();

  const progress = (currentTime / duration) * 100;
  setProgress(progress);
});

      wave.on("finish", () => {
  pause();        // stops audio properly
  setProgress(0); // reset UI only
});
    }

    const wave = waveRef.current;

    const loadAudio = async () => {
      if (!wave || loadingRef.current) return;

      loadingRef.current = true;

      try {
        wave.stop?.();

        await new Promise((res) => setTimeout(res, 50));

        wave.load(url);
        setIsPlaying(false);
        setProgress(0);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("Waveform load error:", err);
        }
      } finally {
        loadingRef.current = false;
      }
    };

    loadAudio();

    return () => {
      try {
        waveRef.current?.unAll?.();
        waveRef.current?.destroy();
        waveRef.current = null;
      } catch {}
    };
  }, [url]);

  // ---------------------------
  // PLAY / PAUSE
  // ---------------------------
  const togglePlay = () => {
  if (isActive && isPlaying) {
    pause();
  } else {
    play(url);
  }
};

  // ---------------------------
  // CLICK PROGRESS BAR (SCRUB)
  // ---------------------------
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;

    waveRef.current.seekTo(percent);
    setProgress(percent * 100);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-5 hover:border-purple-500/30 transition">

      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-4">

        <div>
          <p className="text-sm text-zinc-300 font-medium">Preview</p>
          <p className="text-xs text-zinc-500">High-quality audio preview</p>
        </div>

        <button
          onClick={togglePlay}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            border border-zinc-700 bg-black/30
            hover:bg-purple-600 hover:border-purple-500
            transition-all duration-300
          `}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span className="text-sm">
            {isPlaying ? "Pause" : "Play Preview"}
          </span>
        </button>
      </div>

      {/* WAVEFORM */}
      <div ref={containerRef} className="rounded-lg overflow-hidden" />

      {/* REAL PROGRESS BAR (CLICKABLE) */}
      <div
        onClick={handleSeek}
        className="mt-4 w-full h-2 bg-zinc-800 rounded-full cursor-pointer overflow-hidden"
      >
        <div
          className="h-full bg-purple-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* FOOTER INFO */}
      <div className="mt-2 flex justify-between text-xs text-zinc-500">
        <span>{Math.floor(progress)}%</span>
        <span>Click to seek</span>
      </div>
    </div>
  );
}