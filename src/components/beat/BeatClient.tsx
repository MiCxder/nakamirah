"use client";

import { useState } from "react";
import Image from "next/image";
import GlassButton from "@/components/ui/GlassButton";
import Toast from "@/components/ui/Toast";
import { useCart } from "@/lib/CartContext";
import WaveformPlayer from "@/components/audio/WaveformPlayer";
import LicenseSelector from "@/components/beat/LicenseSelector";
import type { Beat } from "@/types/beat";
import FadeIn from "@/components/ui/FadeIn";
import { formatCurrency } from "@/lib/currency";

type LicenseType = "basic" | "premium" | "exclusive";

export default function BeatClient({ beat }: { beat: Beat }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [license, setLicense] = useState<LicenseType>("basic");
  const [showToast, setShowToast] = useState(false);

  const { addToCart } = useCart();

  /**
   * SAFE LICENSE HANDLING
   * - If licenses exist in DB → use them
   * - If not → fallback to base price
   */

  const priceMap = {
  basic: beat.price_basic,
  premium: beat.price_premium,
  exclusive: beat.price_exclusive,
};

const price = priceMap[license];
const coverSrc = beat.cover || "/hero-bg.jpeg";
const about = beat.description?.trim();

  const handleAddToCart = async () => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    addToCart({
      id: beat.id,
      title: beat.title,
      price,
      license,
    });

    setLoading(false);
    setSuccess(true);
    setShowToast(true);

    setTimeout(() => setSuccess(false), 1200);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">

      <FadeIn y={32}>
        <section className="grid gap-8 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.35fr)] lg:items-end">
          <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
            <Image
              src={coverSrc}
              alt={`${beat.title} artwork`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4">
              <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-200 backdrop-blur-md">
                Artwork
              </span>
              <span className="rounded-full border border-purple-400/30 bg-purple-500/15 px-3 py-1 text-sm font-semibold text-purple-100 backdrop-blur-md">
                {formatCurrency(beat.price_basic)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300">
                {beat.genre}
              </p>
              <h1 className="mt-3 text-5xl font-bold tracking-tight md:text-7xl">
                {beat.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-300">
                <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2">
                  {beat.bpm} BPM
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2">
                  {beat.musical_key}
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2">
                  From {formatCurrency(beat.price_basic)}
                </span>
              </div>
            </div>

            {beat.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {beat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-purple-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </FadeIn>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">

        {/* LEFT */}
        <FadeIn y={36} delay={0.08} className="lg:col-span-2">
          <div className="space-y-8">

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 backdrop-blur-xl">
              <WaveformPlayer url={beat.preview} />
            </div>

            {about ? (
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-2">
                  About this beat
                </h2>

                <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">
                  {about}
                </p>
              </div>
            ) : null}

          </div>
        </FadeIn>

        {/* RIGHT */}
        <FadeIn y={36} delay={0.14} className="lg:col-span-1">
          <div>
          <div className="sticky top-24 space-y-6">

            {/* PRICE CARD */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">

              <div className="flex items-end justify-between">
                <h3 className="text-sm text-zinc-400 uppercase">
                  Price
                </h3>

                <div className="text-3xl font-bold text-purple-400">
                  {formatCurrency(price)}
                </div>
              </div>

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
        </FadeIn>

      </div>

      {/* TOAST */}
      <Toast
        show={showToast}
        message={beat.title}
        subMessage={`${license.toUpperCase()} License • ${formatCurrency(price)}`}
      />

    </main>
  );
}
