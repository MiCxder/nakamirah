import { supabase } from "@/lib/supabase";
import { Beat } from "@/types/beat";
import BeatCard from "@/components/beat/BeatCard";
import HeroSection from "@/components/home/HeroSection";
import SectionCarousel from "@/components/home/SectionCarousel";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  // Fetch multiple curated lists concurrently
  const [featuredRes, trendingRes, drillRes, afroRes, trapRes, cinematicRes, amapianoRes] =
    await Promise.all([
      supabase.from("beats").select("*").order("id", { ascending: false }).limit(5),
      supabase.from("beats").select("*").order("id", { ascending: false }).limit(5),
      supabase.from("beats").select("*").ilike("genre", "%drill%").limit(5),
      supabase.from("beats").select("*").ilike("genre", "%afro%").limit(5),
      supabase.from("beats").select("*").ilike("genre", "%trap%").limit(5),
      supabase.from("beats").select("*").ilike("genre", "%cinematic%").limit(5),
      supabase.from("beats").select("*").ilike("genre", "%amapiano%").limit(5),
    ]);

  // Collect errors and data
  const errors = [
    featuredRes.error,
    trendingRes.error,
    drillRes.error,
    afroRes.error,
    trapRes.error,
    cinematicRes.error,
    amapianoRes.error,
  ].filter(Boolean);
  if (errors.length) {
    console.error("Error fetching beats:", errors);
  }

  const featured: Beat[] = featuredRes.data ?? [];
  const trending: Beat[] = trendingRes.data ?? [];
  const drill: Beat[] = drillRes.data ?? [];
  const afro: Beat[] = afroRes.data ?? [];
  const trap: Beat[] = trapRes.data ?? [];
  const cinematic: Beat[] = cinematicRes.data ?? [];
  const amapiano: Beat[] = amapianoRes.data ?? [];

  const sections: { key: string; title: string; items: Beat[] }[] = [
    { key: "featured", title: "Featured Beats", items: featured },
    { key: "trending", title: "Trending Now", items: trending },
    { key: "drill", title: "Drill", items: drill },
    { key: "afro", title: "Afro & Afrobeats", items: afro },
    { key: "trap", title: "Trap", items: trap },
    { key: "cinematic", title: "Cinematic & Score", items: cinematic },
    { key: "amapiano", title: "Amapiano", items: amapiano },
  ];

  return (
    <main>

      <HeroSection />

      <div className="container mx-auto px-6 space-y-16 py-12">
        {sections.map((sec) => (
          <section key={sec.key} className="relative">
            <FadeIn>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {sec.items[0]?.cover && (
                    <div className="hidden sm:block w-14 h-14 rounded-md overflow-hidden">
                      <Image src={sec.items[0].cover} alt={sec.title} width={56} height={56} className="object-cover" />
                    </div>
                  )}

                  <div>
                    <h2 className="text-2xl font-bold">{sec.title}</h2>
                    <div className="mt-1 h-1 w-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-300" />
                  </div>
                </div>

                <a href="/beats" className="text-sm text-zinc-400 hover:text-white">
                  View all
                </a>
              </div>
            </FadeIn>

            <div>
              <SectionCarousel items={sec.items} />
            </div>
          </section>
        ))}
      </div>

    </main>
  );
}
