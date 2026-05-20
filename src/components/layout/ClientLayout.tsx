"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const [cartOpen, setCartOpen] = useState(false);

  // ADMIN: no storefront UI
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <Navbar onCartClick={() => setCartOpen(true)} />

      {/* MAIN CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER (ONLY ONCE, ALWAYS AT BOTTOM) */}
      <Footer />

      {/* CART */}
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </div>
  );
}