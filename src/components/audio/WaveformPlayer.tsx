"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/lib/AudioContext";

export default function WaveformPlayer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);
  const loadingRef = useRef(false);

  const [progress, setProgress] = useState(0);

  const { current, play, pause, isPlaying } = useAudio();

  const isActive = current === url;

  // ---------------------------
  // INIT WAVESURFER
  // ---------------------------
  useEffect(() => {
    if (!containerRef.current) return;

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

      wave.on("timeupdate", (currentTime: number) => {
        const duration = wave.getDuration();
        if (duration > 0) {
          setProgress((currentTime / duration) * 100);
        }
      });

      wave.on("finish", () => {
        pause();
        setProgress(0);
      });

      wave.on("error", (err) => {
        console.warn("Waveform error:", err);
      });
    }

    const wave = waveRef.current;

    const loadAudio = async () => {
      if (!url) {
        console.warn("No audio URL provided");
        return;
      }

      try {
        wave.load(url);
      } catch (err) {
        console.warn("WaveSurfer load failed:", err);
      }
    };

    loadAudio();

    return () => {
  const wave = waveRef.current;

  if (wave) {
    try {
      wave.unAll?.(); // remove all listeners
      wave.destroy?.();
    } catch (err: any) {
      // Ignore AbortError (normal when unmounting during load)
      if (err?.name !== "AbortError") {
        console.warn("WaveSurfer destroy error:", err);
      }
    } finally {
      waveRef.current = null;
    }
  }
};
  }, [url, isActive, isPlaying, play, pause]);

  // ---------------------------
  // PLAY / PAUSE (SYNCED)
  // ---------------------------
  const togglePlay = () => {
    const wave = waveRef.current;
    if (!wave) return;

    if (isActive && isPlaying) {
      wave.pause();
      pause();
    } else {
      wave.play();
      play(url);
    }
  };

  // ---------------------------
  // SEEK
  // ---------------------------
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const wave = waveRef.current;
    if (!wave) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    wave.seekTo(percent);
    setProgress(percent * 100);
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-5 hover:border-purple-500/30 transition">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-zinc-300 font-medium">Preview</p>
          <p className="text-xs text-zinc-500">High-quality audio preview</p>
        </div>

        <button
          onClick={togglePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-black/30 hover:bg-purple-600 hover:border-purple-500 transition-all"
        >
          {isActive && isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span className="text-sm">
            {isActive && isPlaying ? "Pause" : "Play Preview"}
          </span>
        </button>
      </div>

      {/* WAVEFORM */}
      <div ref={containerRef} className="rounded-lg overflow-hidden" />

      {/* PROGRESS BAR */}
      <div
        onClick={handleSeek}
        className="mt-4 w-full h-2 bg-zinc-800 rounded-full cursor-pointer overflow-hidden"
      >
        <div
          className="h-full bg-purple-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* FOOTER */}
      <div className="mt-2 flex justify-between text-xs text-zinc-500">
        <span>{Math.floor(progress)}%</span>
        <span>Click to seek</span>
      </div>
    </div>
  );
}