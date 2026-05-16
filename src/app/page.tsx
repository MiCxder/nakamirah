import { beats } from "@/data/beats";
import BeatClient from "./BeatClient";

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  // Convert slug to number safely
  const id = Number(params.slug);

  // Find beat from data
  const beat = beats.find((b) => b.id === id);

  // Safe fallback if beat doesn't exist
  if (!beat) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Beat not found</h1>
        <p className="text-zinc-500 mt-2">
          The beat you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  // Pass beat into client component (where all interactivity happens)
  return <BeatClient beat={beat} />;
}