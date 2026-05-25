"use client";

import { useCart } from "@/lib/CartContext";
import { formatCurrency } from "@/lib/currency";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="container mx-auto px-6 py-20">

      <h1 className="text-3xl font-bold mb-10">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-zinc-400">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">

          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border border-zinc-700 p-4 rounded-xl"
            >
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-zinc-400">
                  {item.license}
                </p>
              </div>

              <div className="text-right">
                <p className="text-purple-400 font-bold">
                  {formatCurrency(item.price)}
                </p>

                <button
                  onClick={() => removeFromCart(item.id, item.license)}
                  className="text-red-400 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex justify-between items-center mt-10 border-t border-zinc-700 pt-6">
            <h2 className="text-xl font-semibold">Total</h2>
            <p className="text-2xl font-bold text-purple-400">
              {formatCurrency(total)}
            </p>
          </div>

          {/* CHECKOUT BUTTON */}
          <button className="w-full mt-6 bg-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-700">
            Proceed to Checkout
          </button>

        </div>
      )}

    </main>
  );
}
