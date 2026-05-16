"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

type LicenseType = "basic" | "premium" | "exclusive";

type AudioContextType = {
  current: string | null;
  title: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  play: (url: string, title?: string) => void;
  pause: () => void;

  showPlayer: boolean;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>;
};

const AudioCtx = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [current, setCurrent] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [showPlayer, setShowPlayer] = useState(true);

  // -----------------------------
  // SINGLE AUDIO INSTANCE
  // -----------------------------
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // -----------------------------
  // PLAY (GLOBAL CONTROL)
  // -----------------------------
  const play = (url: string, beatTitle?: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If same track → toggle play/pause
    if (current === url) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    // New track
    audio.src = url;
    audio.load();

    audio.play();

    setCurrent(url);
    setTitle(beatTitle || "");
    setIsPlaying(true);
  };

  // -----------------------------
  // PAUSE
  // -----------------------------
  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  return (
    <AudioCtx.Provider
      value={{
        current,
        title,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        showPlayer,
        setShowPlayer,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}