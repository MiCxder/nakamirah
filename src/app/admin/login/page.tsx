"use client";

import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("expired")) {
      setNotice("Your admin session expired after inactivity. Please sign in again.");
      supabase.auth.signOut();
    } else if (params.get("unauthorized")) {
      setNotice("This account is not allowed to access the admin area.");
      supabase.auth.signOut();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setNotice("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      await supabase.auth.getSession();

      const adminCheck = await fetch("/api/admin/activity", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (
        adminCheck.redirected ||
        adminCheck.status === 401 ||
        adminCheck.url.includes("/admin/login")
      ) {
        await supabase.auth.signOut();
        setNotice("This account is not allowed to access the admin area.");
        toast.error("This account is not allowed to access the admin area");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const nextPath = params.get("next");
      const redirectPath =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/admin";

      toast.success("Logged in successfully");
      router.replace(redirectPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black px-4">
      <div className="w-full max-w-md">
        {/* Glow effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-violet-900/20 rounded-[2rem] blur-3xl -z-10" />
        
        <div className="rounded-[2rem] border border-zinc-800/50 bg-gradient-to-b from-zinc-950/80 to-zinc-950/40 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 via-violet-500 to-purple-700 text-white shadow-xl shadow-purple-500/30">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">Admin Login</h1>
            <p className="mt-3 text-sm text-zinc-400">
              Sign in to manage beats, analytics, and content.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {notice && (
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {notice}
              </p>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-900/50 pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 transition focus:border-purple-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-900/50 pl-10 pr-11 py-3 text-sm text-white placeholder:text-zinc-500 transition focus:border-purple-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-purple-700 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:shadow-lg hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-zinc-800/30 pt-6">
            <p className="text-center text-xs text-zinc-500">
              🔒 Secure access only. Keep your admin credentials private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
