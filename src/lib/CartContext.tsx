"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

/* =======================
   TYPES
======================= */
type LicenseType = "basic" | "premium" | "exclusive";

type CartItem = {
  id: number;
  title: string;
  price: number;
  license: LicenseType;
  cover?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, license: LicenseType) => void;
  clearCart: () => void;
  subtotal: number;
};

/* =======================
   CONTEXT
======================= */
const CartContext = createContext<CartContextType | undefined>(undefined);

/* =======================
   STORAGE KEY
======================= */
const CART_STORAGE_KEY = "nakamirah_cart";

/* =======================
   PROVIDER
======================= */
export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /* =======================
     HYDRATE CART FROM LOCALSTORAGE
  ======================= */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);

      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Cart hydration error:", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  /* =======================
     PERSIST CART TO LOCALSTORAGE
  ======================= */
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart, hydrated]);

  /* =======================
     ADD TO CART
  ======================= */
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // prevent duplicates (BeatStars behavior)
      const exists = prev.some(
        (i) =>
          i.id === item.id && i.license === item.license
      );

      if (exists) return prev;

      return [...prev, item];
    });
  };

  /* =======================
     REMOVE FROM CART
  ======================= */
  const removeFromCart = (
    id: number,
    license: LicenseType
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.license === license)
      )
    );
  };

  /* =======================
     CLEAR CART
  ======================= */
  const clearCart = () => {
    setCart([]);
  };

  /* =======================
     PROVIDER VALUE
  ======================= */
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, subtotal }}
>
      {children}
    </CartContext.Provider>
  );
}

/* =======================
   HOOK
======================= */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}