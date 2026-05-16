"use client";

import { useEffect, useState } from "react";
import GlassButton from "@/components/ui/GlassButton";

type CartItem = {
  id: number;
  title: string;
  price: number;
  license: "basic" | "premium" | "exclusive";
  cover?: string;
  preview?: string;
};

export default function DownloadsPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ Load purchased items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("nakamirah_last_order");

    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">No downloads available</h1>
        <p className="text-zinc-400">
          Complete a purchase to access your files.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8">Your Downloads</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.license}`}
            className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl"
          >
            {/* LEFT */}
            <div>
              <h2 className="font-semibold text-lg">{item.title}</h2>

              <p className="text-sm text-zinc-400 capitalize">
                {item.license} license
              </p>

              <p className="text-purple-400 font-semibold">
                ${item.price}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-3">

              {/* MP3 DOWNLOAD */}
              <a
                href={item.preview}
                download
              >
                <GlassButton>
                  Download
                </GlassButton>
              </a>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
}