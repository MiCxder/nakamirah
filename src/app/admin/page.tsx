"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">

      {/* HEADER */}
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to site
        </Link>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* CARD */}
        <Link href="/admin/beats">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500 transition cursor-pointer">
            <h2 className="text-xl font-semibold">Manage Beats</h2>
            <p className="text-zinc-400 mt-2 text-sm">
              Add, edit, and delete beats
            </p>
          </div>
        </Link>

        <Link href="/admin/orders">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500 transition cursor-pointer">
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-zinc-400 mt-2 text-sm">
              View customer purchases
            </p>
          </div>
        </Link>

      </div>

    </main>
  );
}