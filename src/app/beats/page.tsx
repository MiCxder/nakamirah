
import BeatCard from "@/components/beat/BeatCard";
import FadeIn from "@/components/ui/FadeIn";
import { supabase } from "@/lib/supabase";
import {
  MotionContainer,
  MotionItem,
  MotionHover,
} from "@/components/ui/Motion";

export default async function Page() {
  const { data, error } = await supabase
    .from("beats")
    .select("*");

     if (error) {
    console.error("Error fetching beats:", error);
  }
    const beats = data ?? [];

  return (
    <main className="container mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10">Browse Beats</h1>

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