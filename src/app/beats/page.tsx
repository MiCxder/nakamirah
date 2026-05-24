
import BeatCard from "@/components/beat/BeatCard";
import { supabase } from "@/lib/supabase";
import { Beat } from "@/types/beat";
import {
  MotionContainer,
  MotionItem,
  MotionHover,
} from "@/components/ui/Motion";
import FadeIn from "@/components/ui/FadeIn";

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
    <main className="container mx-auto px-6 py-20">
      <FadeIn y={28}>
        <h1 className="text-4xl font-bold mb-10">{heading}</h1>
      </FadeIn>

      {searchQuery ? (
        <MotionContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        <div className="space-y-12">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-zinc-400">No beats available</p>
          ) : (
            Object.entries(grouped).map(([genre, items]) => (
              <section key={genre} className="">
                <FadeIn y={28}>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold capitalize">{genre}</h2>
                    <a href={`/beats?search=${encodeURIComponent(genre)}`} className="text-sm text-zinc-400 hover:text-white">
                      View all
                    </a>
                  </div>
                </FadeIn>

                <MotionContainer>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
