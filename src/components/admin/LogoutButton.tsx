"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface LogoutButtonProps {
  open?: boolean;
}

export function LogoutButton({ open = true }: LogoutButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowConfirm(false);

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    router.replace("/admin/login");
    router.refresh();
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-2">Confirm Logout</h2>
          <p className="text-sm text-zinc-400 mb-6">Are you sure you want to logout? You'll need to login again to access the admin panel.</p>
          
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogoutClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-red-400 transition hover:border-red-400 hover:bg-zinc-800 hover:text-red-300"
      title="Logout"
    >
      <LogOut size={16} />
      {open && "Logout"}
    </button>
  );
}
