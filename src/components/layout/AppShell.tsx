"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}