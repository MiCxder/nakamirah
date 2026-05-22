
import BeatCard from "@/components/beat/BeatCard";
import { supabase } from "@/lib/supabase";
import { Beat } from "@/types/beat";
import {
  MotionContainer,
  MotionItem,
  MotionHover,
} from "@/components/ui/Motion";

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const searchQuery = searchParams?.search?.trim() ?? "";
  const query = supabase.from("beats").select("*");

  const { data, error } = searchQuery
    ? await query.or(
        `title.ilike.%${searchQuery}%,genre.ilike.%${searchQuery}%`
      )
    : await query;

  if (error) {
    console.error("Supabase error:", JSON.stringify(error, null, 2));
  }

  const beats: Beat[] = data ?? [];

  console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("DATA:", data);
console.log("ERROR:", error);

  const heading = searchQuery
    ? `Search results for "${searchQuery}"`
    : "Browse Beats";

  return (
    <main className="container mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10">{heading}</h1>

     <MotionContainer>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {beats?.length ? (
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
    </main>
  );
}