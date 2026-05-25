import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_ACTIVITY_COOKIE = "admin-last-active";
const DEFAULT_TIMEOUT_MINUTES = 30;

function getTimeoutMs() {
  const minutes = Number(process.env.ADMIN_SESSION_TIMEOUT_MINUTES);
  const safeMinutes =
    Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_TIMEOUT_MINUTES;

  return safeMinutes * 60 * 1000;
}

function getAllowedEmails() {
  return (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedAdmin(user: any) {
  const allowedEmails = getAllowedEmails();
  const email = String(user?.email || "").toLowerCase();
  const role = user?.app_metadata?.role || user?.user_metadata?.role;

  if (allowedEmails.length > 0) {
    return allowedEmails.includes(email);
  }

  return role === "admin" || user?.app_metadata?.admin === true;
}

function redirectToLogin(req: NextRequest, reason?: "expired" | "unauthorized") {
  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set(
    "next",
    `${req.nextUrl.pathname}${req.nextUrl.search}`
  );

  if (reason) {
    loginUrl.searchParams.set(reason, "1");
  }

  const redirect = NextResponse.redirect(loginUrl);
  redirect.cookies.delete(ADMIN_ACTIVITY_COOKIE);
  return redirect;
}

async function signActivity(timestamp: number) {
  const secret =
    process.env.ADMIN_ACTIVITY_SECRET ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "admin-activity";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(String(timestamp))
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function readActivity(value?: string) {
  if (!value) return null;

  const [timestampValue, signature] = value.split(".");
  const timestamp = Number(timestampValue);

  if (!Number.isFinite(timestamp) || !signature) {
    return null;
  }

  const expectedSignature = await signActivity(timestamp);
  return signature === expectedSignature ? timestamp : null;
}

async function writeActivity(res: NextResponse, timestamp: number) {
  res.cookies.set(ADMIN_ACTIVITY_COOKIE, `${timestamp}.${await signActivity(timestamp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.ceil(getTimeoutMs() / 1000),
  });
}

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedPath =
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/api/admin");

  if (!isProtectedPath) {
    return res;
  }

  const isLoginPage = req.nextUrl.pathname.startsWith("/admin/login");
  const isAdmin = user ? isAllowedAdmin(user) : false;

  if (isLoginPage) {
    if (
      req.nextUrl.searchParams.has("expired") ||
      req.nextUrl.searchParams.has("unauthorized")
    ) {
      return res;
    }

    if (user && isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return res;
  }

  if (!user) {
    return redirectToLogin(req);
  }

  if (!isAdmin) {
    return redirectToLogin(req, "unauthorized");
  }

  const now = Date.now();
  const lastActivity = await readActivity(
    req.cookies.get(ADMIN_ACTIVITY_COOKIE)?.value
  );

  if (lastActivity && now - lastActivity > getTimeoutMs()) {
    return redirectToLogin(req, "expired");
  }

  await writeActivity(res, now);
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
