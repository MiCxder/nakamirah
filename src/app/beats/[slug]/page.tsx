import { supabase } from "@/lib/supabase";
import BeatClient from "@/components/beat/BeatClient";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const id = Number(slug); // convert to number

  if (isNaN(id)) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Invalid beat link</h1>
      </div>
    );
  }

  const { data: beat, error } = await supabase
    .from("beats")
    .select("*")
    .eq("id", id) // correct type
    .maybeSingle(); // safer than .single()

  console.log("QUERY RESULT:", beat);
  console.log("ERROR:", error);

  if (!beat) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Beat not found</h1>
        <p className="text-zinc-500 mt-2">ID: {slug}</p>
      </div>
    );
  }

  return <BeatClient beat={beat} />;
}