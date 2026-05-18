"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBeatsPage() {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");

  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);

  const [basic, setBasic] = useState("");
  const [premium, setPremium] = useState("");
  const [exclusive, setExclusive] = useState("");

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

  return (
    <div className="max-w-2xl mx-auto p-10 space-y-4">
      <h1 className="text-2xl font-bold">Admin Upload Beats</h1>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
      <input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="input" />
      <input placeholder="BPM" value={bpm} onChange={(e) => setBpm(e.target.value)} className="input" />
      <input placeholder="Key" value={key} onChange={(e) => setKey(e.target.value)} className="input" />

      <input type="file" onChange={(e) => setCover(e.target.files?.[0] || null)} />
      <input type="file" onChange={(e) => setPreview(e.target.files?.[0] || null)} />

      <input placeholder="Basic price" value={basic} onChange={(e) => setBasic(e.target.value)} className="input" />
      <input placeholder="Premium price" value={premium} onChange={(e) => setPremium(e.target.value)} className="input" />
      <input placeholder="Exclusive price" value={exclusive} onChange={(e) => setExclusive(e.target.value)} className="input" />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 px-4 py-2 rounded-lg text-white"
      >
        {loading ? "Uploading..." : "Upload Beat"}
      </button>
    </div>
  );
}