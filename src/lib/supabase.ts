import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseHost = new URL(supabaseUrl).hostname.split(".")[0];
const cookieName = `sb-${supabaseHost}-auth-token`;

const browserSupabase =
  typeof window !== "undefined"
    ? createBrowserClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          detectSessionInUrl: false,
        },
        cookieOptions: {
          name: cookieName,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        },
      })
    : undefined;

export const supabase =
  typeof window === "undefined"
    ? createClient(supabaseUrl, supabaseKey)
    : browserSupabase!;