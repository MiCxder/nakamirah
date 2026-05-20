"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";

export default function AdminBeatsPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");

  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);

  const [basic, setBasic] = useState("");
  const [premium, setPremium] = useState("");
  const [exclusive, setExclusive] = useState("");

  const [dragActive, setDragActive] = useState(false);
  const coverPreviewUrl = cover ? URL.createObjectURL(cover) : null;
  const audioPreviewUrl = preview ? URL.createObjectURL(preview) : null;

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from("beats")
      .upload(path, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("beats")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!cover || !preview) {
        alert("Upload cover and preview audio");
        return;
      }

      const coverUrl = await uploadFile(
        cover,
        `covers/${Date.now()}-${cover.name}`
      );

      const previewUrl = await uploadFile(
        preview,
        `audio/${Date.now()}-${preview.name}`
      );

      const { error } = await supabase.from("beats").insert({
        title,
        genre,
        bpm: Number(bpm),
        musical_key: key,
        cover: coverUrl,
        preview: previewUrl,
        price_basic: Number(basic),
        price_premium: Number(premium),
        price_exclusive: Number(exclusive),
      });

      if (error) throw error;

      alert("Beat uploaded successfully");
    router.refresh();
    
      setTitle("");
      setGenre("");
      setBpm("");
      setKey("");
      setCover(null);
      setPreview(null);
      setBasic("");
      setPremium("");
      setExclusive("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
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

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="BPM"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl"
            />

            <input
              placeholder="Key (e.g F Minor)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl"
            />
          </div>

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
  {audioPreviewUrl && (
    <div className="w-full mt-6">
      <audio
        controls
        src={audioPreviewUrl}
        className="w-full rounded-lg"
      />
    </div>
  )}

  {/* INPUT */}
  <input
    type="file"
    accept="audio/*"
    onChange={(e) => setPreview(e.target.files?.[0] || null)}
    className="absolute inset-0 opacity-0 cursor-pointer"
  />
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
  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition px-4 py-3 rounded-xl font-semibold"
>
  {loading ? "Publishing Beat..." : "Publish Beat"}
</button>

        </div>
      </div>
    </div>
  </div>
);
}