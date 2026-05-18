import { supabase } from "@/lib/supabase";

export default async function AdminBeats() {
  const { data: beats, error } = await supabase
    .from("beats")
    .select("*");

  if (error) {
    return (
      <main className="p-8 text-white bg-zinc-950 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Error loading beats</h1>
        <p className="text-zinc-400">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="p-8 text-white bg-zinc-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Manage Beats</h1>

      <div className="space-y-4">
        {beats?.length ? (
          beats.map((beat) => (
            <div
              key={beat.id}
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{beat.title}</h2>
                <p className="text-sm text-zinc-400">
                  {beat.genre} • {beat.bpm} BPM
                </p>
              </div>

              <div className="flex gap-3">
                <button className="text-blue-400 text-sm">
                  Edit
                </button>
                <button className="text-red-400 text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-400">No beats found</p>
        )}
      </div>
    </main>
  );
}