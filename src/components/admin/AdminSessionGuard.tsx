"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DEFAULT_TIMEOUT_MINUTES = 30;
const ACTIVITY_EVENTS = [
  "click",
  "keydown",
  "mousemove",
  "scroll",
  "touchstart",
  "visibilitychange",
] as const;
const ACTIVITY_SYNC_INTERVAL_MS = 60 * 1000;

function getTimeoutMs() {
  const minutes = Number(process.env.NEXT_PUBLIC_ADMIN_SESSION_TIMEOUT_MINUTES);
  const safeMinutes =
    Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_TIMEOUT_MINUTES;

  return safeMinutes * 60 * 1000;
}

export function AdminSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin/login")) {
      return;
    }

    let lastActivity = Date.now();
    let lastActivitySync = 0;
    let timeoutId: number | undefined;

    const expireSession = async () => {
      await supabase.auth.signOut();
      router.replace("/admin/login?expired=1");
    };

    const scheduleTimeout = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      const remaining = Math.max(getTimeoutMs() - (Date.now() - lastActivity), 0);
      timeoutId = window.setTimeout(expireSession, remaining);
    };

    const recordActivity = () => {
      if (document.visibilityState === "hidden") {
        return;
      }

      lastActivity = Date.now();
      scheduleTimeout();

      if (Date.now() - lastActivitySync > ACTIVITY_SYNC_INTERVAL_MS) {
        lastActivitySync = Date.now();
        fetch("/api/admin/activity", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        })
          .then((response) => {
            if (response.redirected || response.status === 401) {
              expireSession();
            }
          })
          .catch(() => {});
      }
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, recordActivity, { passive: true });
    });

    scheduleTimeout();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, recordActivity);
      });
    };
  }, [pathname, router]);

  return null;
}
