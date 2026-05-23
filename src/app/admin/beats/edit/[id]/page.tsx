import { supabase } from "@/lib/supabase";
import EditBeatClient from "./EditBeatClient";

type Params = {
  params: {
    id: string;
  };
};

export default async function EditBeatPage({ params }: Params) {
  if (!params?.id) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8">
        <h1 className="text-3xl font-bold">Edit Beat</h1>
        <p className="mt-4 text-red-400">Missing beat ID in the route.</p>
      </div>
    );
  }

  const beatId = params.id;
  const { data: beat, error } = await supabase
    .from("beats")
    .select("*")
    .eq("id", beatId)
    .maybeSingle();

  const errorMessage = error?.message || (!beat ? `Beat ${beatId} not found` : null);

  if (error || !beat) {
    console.error("EditBeatPage error:", error);
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8">
        <h1 className="text-3xl font-bold">Edit Beat</h1>
        <p className="mt-4 text-red-400">Unable to find this beat.</p>
        {errorMessage && (
          <p className="mt-2 text-sm text-red-300">{errorMessage}</p>
        )}
      </div>
    );
  }

  return <EditBeatClient beat={beat} />;
}
