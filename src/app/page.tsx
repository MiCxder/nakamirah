import { supabase } from "@/lib/supabase";
import { Beat } from "@/types/beat";
import BeatCard from "@/components/beat/BeatCard";
import HeroSection from "@/components/home/HeroSection";

export default async function HomePage() {
  const { data, error } = await supabase
    .from("beats")
    .select("*")
    .limit(6);

  if (error) {
    console.error("Error fetching beats:", error);
  }

  const beats: Beat[] = data ?? [];

  return (
    <main>

      <HeroSection />

      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-6">Featured Beats</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      </section>

    </main>
  );
}