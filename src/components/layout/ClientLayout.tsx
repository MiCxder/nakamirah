"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />

      {children}

      <Footer />

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  );
}