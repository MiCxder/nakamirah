import { supabase } from "@/lib/supabase";
import BeatClient from "@/components/beat/BeatClient";
import { Beat } from "@/types/beat";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = Number(slug);

  if (!id || isNaN(id)) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Invalid beat link</h1>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("beats")
    .select("*")
    .eq("id", id)
    .single();


  if (error || !data) {
    return (
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-2xl font-bold">Beat not found</h1>
        <p className="text-zinc-500 mt-2">ID: {slug}</p>
      </div>
    );
  }

 const beat: Beat | null = data ?? null;

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