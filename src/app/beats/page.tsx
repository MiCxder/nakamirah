"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { beats } from "@/data/beats";
import BeatCard from "@/components/beat/BeatCard";

export default function BeatsPage() {
  // Get search from URL (THIS fixes your issue)
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  // Local state only for genre filter
  const [genre, setGenre] = useState("All");

  // Normalize search
  const normalizedSearch = urlSearch.trim().toLowerCase();

  // Filtering logic
  const filteredBeats = beats.filter((beat) => {
    const title = beat.title.toLowerCase();
    const beatGenre = beat.genre.toLowerCase();

    const matchesSearch =
      title.includes(normalizedSearch) ||
      beatGenre.includes(normalizedSearch);

    const matchesGenre =
      genre === "All" || beat.genre === genre;

    return matchesSearch && matchesGenre;
  });

  return (
    <main className="container mx-auto px-6 py-20">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Browse Beats</h1>
        <p className="text-zinc-400 mt-2">
          Find the perfect instrumental for your next project
        </p>
      </div>

      {/* SHOW ACTIVE SEARCH (optional but good UX) */}
      {urlSearch && (
        <p className="text-zinc-400 mb-6">
          Results for: <span className="text-white">{urlSearch}</span>
        </p>
      )}

      {/* GENRE FILTER */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "Trap", "Afrobeats", "Drill"].map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-4 py-2 rounded-lg border transition ${
              genre === g
                ? "bg-purple-600 border-purple-600 text-white"
                : "border-zinc-700 text-zinc-300 hover:border-purple-500"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBeats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredBeats.length === 0 && (
        <p className="text-zinc-500 mt-10">
          No beats found.
        </p>
      )}

    </main>
  );
}