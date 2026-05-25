
import BeatCard from "@/components/beat/BeatCard";
import { supabase } from "@/lib/supabase";
import { Beat } from "@/types/beat";
import Image from "next/image";
import Link from "next/link";
import {
  MotionContainer,
  MotionItem,
  MotionHover,
} from "@/components/ui/Motion";
import FadeIn from "@/components/ui/FadeIn";
import { formatCurrency } from "@/lib/currency";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const searchQuery = searchParams?.search?.trim() ?? "";
  const query = supabase.from("beats").select("*").order("id", { ascending: false });

  const { data, error } = searchQuery
    ? await query.or(`title.ilike.%${searchQuery}%,genre.ilike.%${searchQuery}%`)
    : await query;

  if (error) {
    console.error("Supabase error:", JSON.stringify(error, null, 2));
  }

  const beats: Beat[] = data ?? [];
  const featuredBeat = beats[0];

  const heading = searchQuery ? `Search results for "${searchQuery}"` : "Browse Beats";

  // If there's no search, group beats by genre for clearer browsing
  const grouped: Record<string, Beat[]> = {};
  if (!searchQuery) {
    for (const b of beats) {
      const genre = b.genre?.trim().toLowerCase() || "uncategorized";
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push(b);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      {searchQuery ? (
        <FadeIn y={28}>
          <div className="mb-10 flex flex-col gap-3 border-b border-zinc-800 pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-300">
              Search
            </p>
            <h1 className="text-4xl font-bold md:text-5xl">{heading}</h1>
          </div>
        </FadeIn>
      ) : featuredBeat ? (
        <FadeIn y={28}>
          <section className="mb-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300">
                  Premium beats
                </p>
                <h1 className="mt-3 max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
                  Browse the catalog
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                  High-detail instrumentals with clear license options, artwork, and fast Paystack checkout in naira.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-xl">
                <div className="border border-zinc-800 bg-zinc-900/40 p-4">
                  <p className="text-2xl font-bold">{beats.length}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">Beats</p>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/40 p-4">
                  <p className="text-2xl font-bold">{Object.keys(grouped).length}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">Genres</p>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/40 p-4">
                  <p className="text-2xl font-bold">{formatCurrency(featuredBeat.price_basic)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">From</p>
                </div>
              </div>
            </div>

            <Link
              href={`/beats/${featuredBeat.id}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
            >
              <Image
                src={featuredBeat.cover || "/hero-bg.jpeg"}
                alt={`${featuredBeat.title} artwork`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-xs uppercase tracking-[0.24em] text-purple-200">
                  Featured
                </p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{featuredBeat.title}</h2>
                    <p className="mt-1 text-sm uppercase tracking-[0.18em] text-zinc-300">
                      {featuredBeat.genre} • {featuredBeat.bpm} BPM
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-purple-400/30 bg-purple-500/15 px-3 py-1 text-sm font-semibold text-purple-100 backdrop-blur-md">
                    {formatCurrency(featuredBeat.price_basic)}
                  </span>
                </div>
              </div>
            </Link>
          </section>
        </FadeIn>
      ) : (
        <FadeIn y={28}>
          <h1 className="mb-10 text-4xl font-bold">{heading}</h1>
        </FadeIn>
      )}

      {searchQuery ? (
        <MotionContainer>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beats.length ? (
              beats.map((beat) => (
                <MotionItem key={beat.id}>
                  <MotionHover>
                    <BeatCard beat={beat} />
                  </MotionHover>
                </MotionItem>
              ))
            ) : (
              <p className="text-zinc-400">No beats available</p>
            )}
          </div>
        </MotionContainer>
      ) : (
        <div className="space-y-14">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-zinc-400">No beats available</p>
          ) : (
            Object.entries(grouped).map(([genre, items]) => (
              <section key={genre}>
                <FadeIn y={28}>
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                        Genre
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold capitalize">{genre}</h2>
                    </div>
                    <Link href={`/beats?search=${encodeURIComponent(genre)}`} className="text-sm text-zinc-400 hover:text-white">
                      View all
                    </Link>
                  </div>
                </FadeIn>

                <MotionContainer>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((beat) => (
                      <MotionItem key={beat.id}>
                        <MotionHover>
                          <BeatCard beat={beat} />
                        </MotionHover>
                      </MotionItem>
                    ))}
                  </div>
                </MotionContainer>
              </section>
            ))
          )}
        </div>
      )}
    </main>
  );
}
