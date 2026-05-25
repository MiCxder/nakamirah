"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Beat } from "@/types/beat";

type EditBeatClientProps = {
  beat: Beat;
};

export default function EditBeatClient({ beat }: EditBeatClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(beat.title);
  const [genre, setGenre] = useState(beat.genre);
  const [bpm, setBpm] = useState(String(beat.bpm ?? ""));
  const [key, setKey] = useState(beat.musical_key ?? "");
  const [description, setDescription] = useState(beat.description ?? "");
  const [tags, setTags] = useState((beat.tags ?? []).join(", "));
  const [basic, setBasic] = useState(String(beat.price_basic ?? ""));
  const [premium, setPremium] = useState(String(beat.price_premium ?? ""));
  const [exclusive, setExclusive] = useState(String(beat.price_exclusive ?? ""));
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>(beat.cover);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(beat.cover);
      return;
    }

    const objectUrl = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [coverFile, beat.cover]);

  const uploadCover = async (file: File) => {
    const safePath = `covers/${Date.now()}-${file.name}`
      .split("/")
      .map((segment) =>
        segment
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9._-]/g, "")
      )
      .join("/");

    const { error } = await supabase.storage
      .from("beats")
      .upload(safePath, file, { upsert: true });

    if (error) {
      throw new Error(error.message);
    }

    const publicData = await supabase.storage
      .from("beats")
      .getPublicUrl(safePath);

    if (publicData?.data?.publicUrl) {
      return publicData.data.publicUrl;
    }

    const signedData = await supabase.storage
      .from("beats")
      .createSignedUrl(safePath, 60 * 60);

    if (!signedData?.data?.signedUrl) {
      throw new Error("Unable to get cover URL");
    }

    return signedData.data.signedUrl;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (!title.trim() || !genre.trim() || !basic.trim()) {
        throw new Error("Please provide a title, genre, and basic license price.");
      }

      const basicPrice = Number(basic);
      const premiumPrice = premium ? Number(premium) : 0;
      const exclusivePrice = exclusive ? Number(exclusive) : 0;
      const bpmValue = bpm ? Number(bpm) : null;

      if (
        Number.isNaN(basicPrice) ||
        Number.isNaN(premiumPrice) ||
        Number.isNaN(exclusivePrice) ||
        (bpm && Number.isNaN(bpmValue!))
      ) {
        throw new Error("Please enter valid numeric values for prices and BPM.");
      }

      let coverUrl = beat.cover;
      if (coverFile) {
        coverUrl = await uploadCover(coverFile);
      }

      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const { data: updatedBeat, error } = await supabase
        .from("beats")
        .update({
          title,
          genre,
          bpm: bpmValue,
          musical_key: key,
          description: description.trim() || null,
          cover: coverUrl,
          tags: tagArray,
          price_basic: basicPrice,
          price_premium: premiumPrice,
          price_exclusive: exclusivePrice,
        })
        .eq("id", beat.id)
        .select("id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!updatedBeat) {
        throw new Error(
          "No beat was updated. Check that your Supabase beats table allows updates for the logged-in admin user."
        );
      }

      toast.success("Beat updated successfully");
      router.push("/admin/beats/manage");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error?.message || "Update failed");
      toast.error(error?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Beat</h1>
          <p className="text-zinc-400 mt-2">Update metadata, cover, pricing, and tags.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-zinc-400">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm text-zinc-400">Genre</span>
              <input
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-zinc-400">BPM</span>
              <input
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-400">Key</span>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm text-zinc-400">Tags</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="drill, afrobeats, club"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
            />
          </label>

          <label className="space-y-2 block">
            <span className="text-sm text-zinc-400">About This Beat</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Optional producer notes, mood, usage ideas, or story behind the beat."
              className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm text-zinc-400">Basic Price (NGN)</span>
              <input
                value={basic}
                onChange={(e) => setBasic(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-400">Premium Price (NGN)</span>
              <input
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-400">Exclusive Price (NGN)</span>
              <input
                value={exclusive}
                onChange={(e) => setExclusive(e.target.value)}
                inputMode="decimal"
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-zinc-400">Cover Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm text-zinc-400">Current Cover</span>
              <img
                src={coverPreviewUrl}
                alt="Cover preview"
                className="h-40 w-full rounded-3xl object-cover border border-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-zinc-400">Preview audio (unchangeable)</span>
            <audio controls src={beat.preview} className="w-full" />
            <p className="text-xs text-zinc-500">Audio cannot be updated from this edit screen.</p>
          </div>

          {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-purple-600 px-6 py-4 text-white transition hover:bg-purple-500 disabled:opacity-70"
          >
            {loading ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
