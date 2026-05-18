"use client";

import { useState } from "react";

export default function NewBeat() {
  const [title, setTitle] = useState("");

  return (
    <main className="p-8 bg-zinc-950 text-white min-h-screen">

      <h1 className="text-3xl font-bold mb-8">Upload New Beat</h1>

      <form className="space-y-6 max-w-xl">

        <input
          placeholder="Beat Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
        />

        <button className="bg-purple-600 px-6 py-3 rounded-xl">
          Upload
        </button>

      </form>

    </main>
  );
}