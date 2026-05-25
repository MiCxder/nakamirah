"use client";

import GlassButton from "@/components/ui/GlassButton";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/currency";
import { X, Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function CartDrawer({ open, setOpen }: Props) {
  const { cart, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  const [paystackReady, setPaystackReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  // =========================
  // LOAD PAYSTACK SCRIPT
  // =========================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => setPaystackReady(true);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // =========================
  // PAYSTACK CHECKOUT
  // =========================
  const payWithPaystack = () => {
    if (!paystackReady) return;

    setPaying(true);

    console.log("PAYSTACK KEY:", process.env.NEXT_PUBLIC_PAYSTACK_KEY);
    
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: "customer@email.com",
      amount: Math.round(total * 100),
      currency: "NGN",
      ref: `${Date.now()}`,

     callback: function (response: any) {
  console.log("Payment success:", response);

  // ✅ SAVE ORDER
  localStorage.setItem(
    "nakamirah_last_order",
    JSON.stringify(cart)
  );

  // ✅ SEND EMAIL (wrapped async)
  (async () => {
    try {
      await fetch("/api/end-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "customer@email.com",
          items: cart,
          total: total,
        }),
      });
        setPaid(true);
    } catch (err) {
      console.warn("Email failed:", err);
    }

    // ✅ CLEAR CART
    localStorage.removeItem("nakamirah_cart");
      clearCart();

    // ✅ REDIRECT
    window.location.href = "/checkout/success";
  })();
},

      onClose: function () {
        setPaying(false);
        console.log("Payment closed");
      },
    });

    handler.openIframe();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-[380px] bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold">Cart</h2>

              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded"
              >
                <X size={18} />
              </button>
            </div>

            {/* ITEMS */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {cart.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Your cart is empty
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.id}-${item.license}`}
                    className="flex justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-zinc-500 capitalize">
                        {item.license} license
                      </p>
                      <p className="text-purple-400 font-semibold">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.id, item.license)
                      }
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* SUMMARY */}
            <div className="border-t border-zinc-800 p-4 space-y-2 bg-zinc-950">
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm text-zinc-400">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              {/* 💎 LIQUID GLASS CHECKOUT BUTTON */}
              <GlassButton
                onClick={payWithPaystack}
                loading={paying}
                success={paid}
                disabled={!paystackReady || cart.length === 0}
                className="w-full mt-3"
              >
                Checkout
              </GlassButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
