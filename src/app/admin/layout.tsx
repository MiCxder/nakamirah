"use client";

import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Music, Plus, BarChart3, LayoutDashboard, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // hide sidebar on login route — middleware handles auth/redirect server-side
  const hideSidebar = pathname?.startsWith("/admin/login");

  // Only redirect on non-login admin pages when not authenticated
  // Login page redirects handled by login form after successful sign-in
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin/login")) return; // Let login page stay as-is
    if (!pathname.startsWith("/admin")) return;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        // Protected admin pages: require session
        if (!session) {
          router.replace("/admin/login");
        }
      } catch (err) {
        router.replace("/admin/login");
      }
    })();
  }, [pathname, router]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

<Toaster position="top-right" richColors />

      {/* SIDEBAR (hidden on login) */}
      {!hideSidebar && (
        <aside
          className={`${
            open ? "w-64" : "w-20"
          } flex min-h-screen flex-col transition-all duration-300 border-r border-zinc-800 bg-zinc-950 p-4`}
        >

          {/* TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white"
            title={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu size={18} />
          </button>

          {/* NAV ITEMS */}
          <nav className="mb-6 space-y-3">

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

          <div className="mt-auto pt-6 border-t border-zinc-800">
            <LogoutButton open={open} />
          </div>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}