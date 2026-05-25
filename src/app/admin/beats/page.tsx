"use client";

import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Music, Play, Pause } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

export default function AdminBeatsPage() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveInstance = useRef<any>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [tags, setTags] = useState("");

  const [basic, setBasic] = useState("");
  const [premium, setPremium] = useState("");
  const [exclusive, setExclusive] = useState("");

  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!cover) {
      setCoverPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(cover);
    setCoverPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [cover]);

  const uploadFileWithProgress = async (file: File, path: string) => {
    setProgress(20);
    setUploadError(null);

    const safePath = path
      .split("/")
      .map((segment) =>
        segment
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9._-]/g, "")
      )
      .join("/");

    const { data, error } = await supabase.storage
      .from("beats")
      .upload(safePath, file, { upsert: false });

    if (error) {
      throw new Error(error.message);
    }

    setProgress(60);

    const publicData = await supabase.storage
      .from("beats")
      .getPublicUrl(safePath);

    if (!publicData?.data?.publicUrl) {
      const signedData = await supabase.storage
        .from("beats")
        .createSignedUrl(safePath, 60 * 60);

      if (!signedData?.data?.signedUrl) {
        throw new Error("Unable to get public or signed URL");
      }

      setProgress(100);
      return signedData.data.signedUrl;
    }

    setProgress(100);
    return publicData.data.publicUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setUploadError(null);
    setProgress(0);

    try {
      if (!cover || !preview) {
        throw new Error("Please upload both a cover image and preview audio file.");
      }

      if (!title.trim() || !genre.trim() || !basic.trim()) {
        throw new Error("Please provide a title, genre, and basic license price.");
      }

      const basicPrice = Number(basic);
      const premiumPrice = premium ? Number(premium) : 0;
      const exclusivePrice = exclusive ? Number(exclusive) : 0;

      if (Number.isNaN(basicPrice) || Number.isNaN(premiumPrice) || Number.isNaN(exclusivePrice)) {
        throw new Error("Please enter valid numeric prices for licenses.");
      }

      const coverUrl = await uploadFileWithProgress(
        cover,
        `covers/${Date.now()}-${cover.name}`
      );

      const previewUrl = await uploadFileWithProgress(
        preview,
        `audio/${Date.now()}-${preview.name}`
      );

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const { data, error } = await supabase
        .from("beats")
        .insert({
          title,
          genre,
          bpm: Number(bpm),
          musical_key: key,
          cover: coverUrl,
          preview: previewUrl,
          ...(tagArray.length ? { tags: tagArray } : {}),
          price_basic: basicPrice,
          price_premium: premiumPrice,
          price_exclusive: exclusivePrice,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Beat uploaded successfully");
      router.refresh();
      router.push(`/beats/${data.id}`);
    
      setTitle("");
      setGenre("");
      setBpm("");
      setKey("");
      setCover(null);
      setPreview(null);
      setBasic("");
      setPremium("");
      setExclusive("");
    } catch (err: any) {
      const message = err?.message || "Upload failed";
      setUploadError(message);
      toast.error(message);
    }

    setLoading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
  } else if (e.type === "dragleave") {
    setDragActive(false);
  }
};

const handleDrop = (e: React.DragEvent, type: "cover" | "preview") => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const file = e.dataTransfer.files?.[0];
  if (!file) return;

  if (type === "cover") setCover(file);
  if (type === "preview") setPreview(file);
};

const detectTempo = async (audioBuffer: AudioBuffer): Promise<number | null> => {
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const blockSize = 2048;
  const energies: number[] = [];

  for (let i = 0; i < channelData.length; i += blockSize) {
    let sum = 0;
    const end = Math.min(i + blockSize, channelData.length);
    for (let j = i; j < end; j += 1) {
      sum += channelData[j] * channelData[j];
    }
    energies.push(Math.sqrt(sum));
  }

  const maxEnergy = Math.max(...energies, 0.0001);
  const threshold = maxEnergy * 0.45;
  const peaks: number[] = [];

  for (let i = 1; i < energies.length - 1; i += 1) {
    if (energies[i] > threshold && energies[i] > energies[i - 1] && energies[i] > energies[i + 1]) {
      peaks.push(i);
    }
  }

  if (peaks.length < 2) return null;

  const tempoCounts = new Map<number, number>();
  for (let i = 0; i < peaks.length - 1; i += 1) {
    const interval = peaks[i + 1] - peaks[i];
    const tempo = Math.round(60 / ((interval * blockSize) / sampleRate));
    if (tempo >= 50 && tempo <= 190) {
      tempoCounts.set(tempo, (tempoCounts.get(tempo) ?? 0) + 1);
    }
  }

  if (!tempoCounts.size) return null;

  let bestTempo = 0;
  let bestCount = 0;
  tempoCounts.forEach((count, tempo) => {
    if (count > bestCount) {
      bestCount = count;
      bestTempo = tempo;
    }
  });

  if (bestTempo < 70) bestTempo *= 2;
  if (bestTempo > 180) bestTempo = Math.round(bestTempo / 2);

  return bestTempo;
};

const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const detectKeyNote = async (audioBuffer: AudioBuffer): Promise<string | null> => {
  const fftSize = 4096;
  const sampleRate = audioBuffer.sampleRate;
  const frame = audioBuffer.getChannelData(0).subarray(0, Math.min(audioBuffer.length, fftSize));
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);

  for (let n = 0; n < frame.length; n += 1) {
    real[n] = frame[n] * (0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (frame.length - 1)));
  }

  for (let k = 0; k < fftSize / 2; k += 1) {
    let sumRe = 0;
    let sumIm = 0;
    for (let n = 0; n < frame.length; n += 1) {
      const angle = (2 * Math.PI * k * n) / fftSize;
      sumRe += real[n] * Math.cos(angle);
      sumIm -= real[n] * Math.sin(angle);
    }
    real[k] = Math.sqrt(sumRe * sumRe + sumIm * sumIm);
  }

  let maxIndex = 0;
  let maxValue = 0;
  for (let k = 1; k < fftSize / 2; k += 1) {
    const frequency = (k * sampleRate) / fftSize;
    if (frequency < 55 || frequency > 1760) continue;
    const magnitude = real[k];
    if (magnitude > maxValue) {
      maxValue = magnitude;
      maxIndex = k;
    }
  }

  if (maxValue === 0) return null;
  const frequency = (maxIndex * sampleRate) / fftSize;
  const noteNumber = Math.round(12 * (Math.log(frequency / 440) / Math.log(2)) + 69);
  const noteIndex = ((noteNumber % 12) + 12) % 12;
  return noteNames[noteIndex] ?? null;
};

const analyzePreviewFile = async (file: File) => {
  const shouldAutoFill = autoDetect;
  setDetecting(true);
  setDetectionError(null);
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const bpmValue = await detectTempo(audioBuffer);
    const keyValue = await detectKeyNote(audioBuffer);
    await audioContext.close();
    if (shouldAutoFill) {
      if (bpmValue) setBpm(String(bpmValue));
      if (keyValue) setKey(keyValue);
    }
    if (!bpmValue && !keyValue) {
      setDetectionError("Unable to detect BPM or key from the preview.");
    }
  } catch (error) {
    console.warn("Preview metadata detection failed", error);
    setDetectionError("Automatic detection failed. Enter values manually.");
  } finally {
    setDetecting(false);
  }
};

const toggleWavePlayback = () => {
  const wave = waveInstance.current;
  if (!wave) return;

  if (isPlaying) {
    wave.pause();
    setIsPlaying(false);
  } else {
    wave.play();
    setIsPlaying(true);
  }
};

useEffect(() => {
  if (!preview || !waveformRef.current) return;

  if (waveInstance.current) {
    waveInstance.current.destroy();
  }

  const url = URL.createObjectURL(preview);

  waveInstance.current = WaveSurfer.create({
    container: waveformRef.current,
    waveColor: "#555",
    progressColor: "#a855f7",
    height: 80,
    barWidth: 2,
  });

  waveInstance.current.load(url);

  waveInstance.current.on("play", () => setIsPlaying(true));
  waveInstance.current.on("pause", () => setIsPlaying(false));
  waveInstance.current.on("finish", () => setIsPlaying(false));

  return () => {
    waveInstance.current?.destroy();
    URL.revokeObjectURL(url);
  };
}, [preview]);

useEffect(() => {
  if (!autoDetect || !preview) return;
  analyzePreviewFile(preview);
}, [preview, autoDetect]);

useEffect(() => {
  if (!autoDetect) {
    setDetectionError(null);
  }
}, [autoDetect]);

  return (
  <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Upload Beat</h1>
        <p className="text-zinc-400 mt-2">
          Add a new beat to your marketplace
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

{loading && (
  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 rounded-2xl">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-purple-400/30 border-t-purple-500 rounded-full animate-spin" />
      <p className="text-sm text-zinc-300">Uploading your beat...</p>
    </div>
  </div>
)}

        {/* LEFT: DETAILS */}
        <div className="space-y-4">

          <input
            placeholder="Beat Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
          />

          <input
            placeholder="Genre (e.g Trap, Drill, Afrobeats)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
          />

          <input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="BPM"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl"
              disabled={autoDetect}
            />

            <input
              placeholder="Key (e.g F Minor)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl"
              disabled={autoDetect}
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500"
            />
            Auto detect BPM & key from preview
          </label>

          {detecting && (
            <p className="text-xs text-purple-300">Detecting BPM and key...</p>
          )}
          {detectionError && (
            <p className="text-xs text-red-400">{detectionError}</p>
          )}
          {uploadError && (
            <p className="text-xs text-red-400">{uploadError}</p>
          )}

          {/* FILE UPLOADS */}
          <div className="space-y-4">

  {/* COVER UPLOAD */}
  <div
    onDragEnter={handleDrag}
    onDragOver={handleDrag}
    onDragLeave={handleDrag}
    onDrop={(e) => handleDrop(e, "cover")}
    className={`border rounded-xl p-6 transition ${
      dragActive ? "border-purple-500 bg-purple-500/10" : "border-zinc-800 bg-zinc-900/40"
    }`}
  >
    <p className="text-sm text-zinc-400 mb-2">Cover Image</p>

    {coverPreviewUrl ? (
  <div className="relative">
    <img
      src={coverPreviewUrl}
      className="w-full h-48 object-cover rounded-xl border border-zinc-800"
    />
    <button
      onClick={() => setCover(null)}
      className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
    >
      Remove
    </button>
  </div>
) : (
  <p className="text-zinc-500 text-sm">
    Upload or drag & drop cover image
  </p>
)}

    <input
      type="file"
      onChange={(e) => setCover(e.target.files?.[0] || null)}
      className="mt-3 w-full text-sm"
    />
  </div>

  {/* AUDIO UPLOAD */}
<div
  onDragEnter={handleDrag}
  onDragOver={handleDrag}
  onDragLeave={handleDrag}
  onDrop={(e) => handleDrop(e, "preview")}
  className="relative border border-zinc-800 rounded-2xl bg-zinc-900/40 p-10 flex flex-col items-center justify-center text-center transition hover:border-purple-500/50"
>

  {/* ICON */}
  <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
    <Music className="text-purple-400 w-7 h-7" />
  </div>

  {/* TITLE */}
  <h3 className="text-lg font-semibold">
    Upload Preview Audio
  </h3>

  <p className="text-sm text-zinc-500 mt-1">
    Drag & drop your MP3/WAV file or click to browse
  </p>

  {/* AUDIO PREVIEW */}
  {/* INPUT */}
  <div className="border border-zinc-800 rounded-2xl p-6 text-center bg-zinc-900/40 backdrop-blur-md">
  <p className="text-sm text-zinc-400 mb-4">Upload Preview Audio</p>

  <input
    type="file"
    accept="audio/*"
    onChange={(e) => setPreview(e.target.files?.[0] || null)}
    className="mb-4"
  />

  {preview && (
    <>
      <div ref={waveformRef} className="w-full mb-4" />

      <button
        onClick={toggleWavePlayback}
        className="inline-flex items-center justify-center rounded-full bg-purple-600 p-3 text-white transition hover:bg-purple-500"
        aria-label={isPlaying ? "Pause waveform" : "Play waveform"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
    </>
  )}
</div>

</div>

</div>
        </div>

        {/* RIGHT: PRICING */}
        <div className="space-y-4">

          <h2 className="text-lg font-semibold mb-2">License Pricing</h2>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-zinc-400">Basic License</p>
            <input
              placeholder="Price"
              value={basic}
              onChange={(e) => setBasic(e.target.value)}
              className="w-full mt-2 bg-black border border-zinc-800 px-3 py-2 rounded-lg"
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-zinc-400">Premium License</p>
            <input
              placeholder="Price"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              className="w-full mt-2 bg-black border border-zinc-800 px-3 py-2 rounded-lg"
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-zinc-400">Exclusive License</p>
            <input
              placeholder="Price"
              value={exclusive}
              onChange={(e) => setExclusive(e.target.value)}
              className="w-full mt-2 bg-black border border-zinc-800 px-3 py-2 rounded-lg"
            />
          </div>

          {/* SUBMIT */}
          <button
  onClick={handleSubmit}
  disabled={loading}
  className="
    relative w-full bg-purple-600 px-4 py-3 rounded-xl text-white font-medium
    overflow-hidden transition
    hover:bg-purple-700 disabled:opacity-70
  "
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Uploading...
    </div>
  ) : (
    "Upload Beat"
  )}

  {loading && (
  <div className="mt-4">
    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-purple-500 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-zinc-400 mt-1">{progress}% uploaded</p>
  </div>
)}

</button>

        </div>
      </div>
    </div>
  </div>
);
}
