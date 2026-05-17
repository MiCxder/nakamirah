import { beats } from "@/data/beats";
import BeatClient from "@/components/beat/BeatClient";

export default function Page({ params }: { params: { slug: string } }) {
  const id = Number(params.slug);

  console.log("SLUG RECEIVED:", params.slug);

  if (!params.slug || isNaN(id)) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Invalid beat link</h1>
      </div>
    );
  }

  const beat = beats.find((b) => b.id === id);

  if (!beat) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Beat not found</h1>
        <p className="text-zinc-500 mt-2">ID: {params.slug}</p>
      </div>
    );
  }

  return <BeatClient beat={beat} />;
}