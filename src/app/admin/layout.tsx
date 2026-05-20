"use client";


import { useState } from "react";
import Link from "next/link";
import { Music, Plus, BarChart3, LayoutDashboard, Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } transition-all duration-300 border-r border-zinc-800 bg-zinc-950 p-4`}
      >

        {/* TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white"
        >
          <Menu size={18} />
          {open && "Collapse"}
        </button>

        {/* NAV ITEMS */}
        <nav className="space-y-3">

          <Link
            href="/admin"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900"
          >
            <LayoutDashboard size={18} />
            {open && "Dashboard"}
          </Link>

          <Link
            href="/admin/beats"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900"
          >
            <Plus size={18} />
            {open && "Add Beat"}
          </Link>

          <Link
            href="/admin/beats/manage"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900"
          >
            <Music size={18} />
            {open && "Manage Beats"}
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900"
          >
            <BarChart3 size={18} />
            {open && "Analytics"}
          </Link>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}