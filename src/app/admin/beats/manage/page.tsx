import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ManageBeatsPage() {
  const { data: beats, error } = await supabase
    .from("beats")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return <p className="text-red-500">Failed to load beats</p>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Manage Beats</h1>

      <div className="grid gap-4">
        {beats?.map((beat: any) => (
          <div
            key={beat.id}
            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl"
          >

            {/* INFO */}
            <div>
              <p className="font-semibold">{beat.title}</p>
              <p className="text-sm text-zinc-500">
                {beat.genre} • {beat.bpm} BPM
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              {beat?.id ? (
                <Link
                  href={`/admin/beats/edit/${String(beat.id)}`}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Edit
                </Link>
              ) : (
                <span className="text-zinc-500 text-sm">No edit ID</span>
              )}
              <Link
                href={`/beats/${String(beat.id)}`}
                className="text-zinc-400 hover:text-white text-sm"
              >
                View
              </Link>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}