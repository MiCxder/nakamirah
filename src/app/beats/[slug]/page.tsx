import { beats } from "@/data/beats";
import BeatClient from "./BeatClient";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ MUST AWAIT PARAMS FIRST (Next.js requirement)
  const { slug } = await params;

  // clean + safe conversion
  const beatId = Number(slug);

  if (isNaN(beatId)) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Invalid beat ID</h1>
        <p className="text-zinc-500 mt-2">
          Received slug: {String(slug)}
        </p>
      </div>
    );
  }

  const beat = beats.find((b) => b.id === beatId);

  if (!beat) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Beat not found</h1>
        <p className="text-zinc-500 mt-2">
          No beat exists for ID: {beatId}
        </p>
      </div>
    );
  }

  return <BeatClient beat={beat} />;
}