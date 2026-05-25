"use client";

import { useEffect, useState } from "react";
import GlassButton from "@/components/ui/GlassButton";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";

type CartItem = {
  id: number;
  title: string;
  price: number;
  license: "basic" | "premium" | "exclusive";
};

export default function SuccessPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("nakamirah_last_order");

    if (stored) {
      const parsed = JSON.parse(stored);
      setItems(parsed);

      const sum = parsed.reduce(
        (acc: number, item: CartItem) => acc + item.price,
        0
      );

      setTotal(sum);
    }
  }, []);

  const tax = total * 0.075;
  const grandTotal = total + tax;

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">No order found</h1>
        <p className="text-zinc-400 mt-2">
          Please complete a purchase first.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-16 max-w-3xl">

      {/* SUCCESS HEADER */}
      <div className="text-center mb-10">
        <div className="text-green-400 text-5xl mb-4">✔</div>

        <h1 className="text-3xl font-bold">
          Payment Successful
        </h1>

        <p className="text-zinc-400 mt-2">
          Your beats are ready for download
        </p>
      </div>

      {/* RECEIPT */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">

        <h2 className="text-lg font-semibold mb-4">
          Order Summary
        </h2>

        {items.map((item) => (
          <div
            key={`${item.id}-${item.license}`}
            className="flex justify-between text-sm"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-zinc-500 capitalize text-xs">
                {item.license} license
              </p>
            </div>

            <p className="text-purple-400 font-semibold">
              {formatCurrency(item.price)}
            </p>
          </div>
        ))}

        <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="flex justify-between text-zinc-400">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 space-y-4">

        <Link href="/downloads">
          <GlassButton className="w-full">
            Go to Downloads
          </GlassButton>
        </Link>

        <Link href="/beats">
          <button className="w-full text-sm text-zinc-400 hover:text-white transition">
            Continue Browsing
          </button>
        </Link>

      </div>
    </main>
  );
}
