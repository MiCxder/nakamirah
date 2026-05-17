import { beats } from "@/data/beats";
import BeatCard from "@/components/beat/BeatCard";

export default function Page() {
  return (
    <main className="container mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-10">Browse Beats</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {beats.map((beat) => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </div>
    </main>
  );
}