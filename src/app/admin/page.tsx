import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminDashboard() {
  const { data: beats } = await supabase
    .from("beats")
    .select("*")
    .order("id", { ascending: false });

  const totalBeats = beats?.length || 0;

  const totalRevenue =
    beats?.reduce((acc, beat) => {
      return acc + (beat.price_basic || 0);
    }, 0) || 0;

  const recentBeats = beats?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-500 mt-2">
          SaaS analytics overview of your beat marketplace
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">


        <div className="
  relative rounded-2xl border border-zinc-800/60
  bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-black/60
  backdrop-blur-xl
  shadow-[0_8px_30px_rgba(0,0,0,0.4)]
  hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)]
  transition-all duration-300
  hover:-translate-y-1
  overflow-hidden p-5
">
          <p className="text-zinc-400 text-sm">Total Beats</p>
          <h2 className="text-2xl font-bold mt-2">{totalBeats}</h2>
        </div>

        <div className="
  relative rounded-2xl border border-zinc-800/60
  bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-black/60
  backdrop-blur-xl
  shadow-[0_8px_30px_rgba(0,0,0,0.4)]
  hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)]
  transition-all duration-300
  hover:-translate-y-1
  overflow-hidden p-5
">
          <p className="text-zinc-400 text-sm">Estimated Revenue</p>
          <h2 className="text-2xl font-bold mt-2">
            ${totalRevenue}
          </h2>
        </div>

        <div className="
  relative rounded-2xl border border-zinc-800/60
  bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-black/60
  backdrop-blur-xl
  shadow-[0_8px_30px_rgba(0,0,0,0.4)]
  hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)]
  transition-all duration-300
  hover:-translate-y-1
  overflow-hidden p-5
">
          <p className="text-zinc-400 text-sm">Avg Price</p>
          <h2 className="text-2xl font-bold mt-2">
            ${totalBeats ? (totalRevenue / totalBeats).toFixed(2) : 0}
          </h2>
        </div>

      </div>

      {/* RECENT UPLOADS */}
      <div className="
  relative rounded-2xl border border-zinc-800/60
  bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-black/60
  backdrop-blur-xl
  shadow-[0_8px_30px_rgba(0,0,0,0.4)]
  hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)]
  transition-all duration-300
  hover:-translate-y-1
  overflow-hidden p-5
">
        <h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>

        <div className="space-y-3">
          {recentBeats.map((beat: any) => (
            <div
              key={beat.id}
              className="flex items-center justify-between border-b border-zinc-800 pb-3"
            >
              <div>
                <p className="font-medium">{beat.title}</p>
                <p className="text-xs text-zinc-500">
                  {beat.genre} • {beat.bpm} BPM
                </p>
              </div>

              <div className="text-sm text-purple-400 font-semibold">
                ${beat.price_basic}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}