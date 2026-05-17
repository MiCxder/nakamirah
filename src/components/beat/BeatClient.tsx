"use client";

import { useState } from "react";
import GlassButton from "@/components/ui/GlassButton";
import Toast from "@/components/ui/Toast";
import { useCart } from "@/lib/CartContext";
import WaveformPlayer from "@/components/audio/WaveformPlayer";
import LicenseSelector from "@/components/beat/LicenseSelector";

type LicenseType = "basic" | "premium" | "exclusive";

type Beat = {
  id: number;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  preview: string;
  price: number;
  licenses: Record<LicenseType, number>;
};

export default function BeatClient({ beat }: { beat: Beat }) {
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [license, setLicense] = useState<LicenseType>("basic");
const [showToast, setShowToast] = useState(false);
const { addToCart } = useCart();

  // 🔥 dynamic pricing based on selected license
  const price = beat.licenses[license];

  const handleAddToCart = async () => {
  setLoading(true);

  // simulate small UX delay (optional but feels premium)
  await new Promise((r) => setTimeout(r, 600));

  addToCart({
  id: beat.id,
  title: beat.title,
  price,
  license,
  preview: beat.preview, 
});

  setLoading(false);
  setSuccess(true);
  setShowToast(true);

  setTimeout(() => setSuccess(false), 1200);
  setTimeout(() => setShowToast(false), 2000);
};

  return (
    <main className="container mx-auto px-6 py-16 max-w-6xl">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold tracking-tight">
          {beat.title}
        </h1>

        <p className="text-zinc-400 mt-3 uppercase tracking-wider text-sm">
          {beat.genre} • {beat.bpm} BPM • {beat.key}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 backdrop-blur-xl">
            <WaveformPlayer url={beat.preview} />
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">
              About this beat
            </h2>

            <p className="text-zinc-400 text-sm">
              Professionally produced instrumental with industry mixing and mastering.
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">

            {/* PRICE CARD */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">

              <div className="flex items-end justify-between">
                <h3 className="text-sm text-zinc-400 uppercase">
                  Price
                </h3>

                <div className="text-3xl font-bold text-purple-400">
                  ${price}
                </div>
              </div>

              {/* 💎 LIQUID GLASS BUTTON */}
              <GlassButton
  onClick={handleAddToCart}
  loading={loading}
  success={success}
  className="w-full mt-5"
>
  Add to Cart
</GlassButton>

            </div>

            {/* LICENSE SELECTOR */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <LicenseSelector
                beat={beat}
                selected={license}
                setSelected={setLicense}
              />
            </div>

          </div>
        </div>

      </div>

      {/* TOAST */}
      <Toast
        show={showToast}
        message={beat.title}
        subMessage={`${license.toUpperCase()} License • $${price}`}
      />

    </main>
  );
}