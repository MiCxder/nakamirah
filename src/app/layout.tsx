import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/lib/AudioContext";
import { CartProvider } from "@/lib/CartContext";
import StickyPlayer from "@/components/audio/StickyPlayer";
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from "sonner";

export const metadata = {
  title: "Nakamirah Beats",
  description: "Premium beats, loops and instrumentals",
};

/**
 * Root layout must remain a Server Component.
 * Do not use client-side hooks here.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">

        {/* Background glow */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#1a1a1a,black)]" />

        {/* Global providers */}
        <CartProvider>
          <AudioProvider>

            <ClientLayout>
              {/* Navbar + layout logic handled inside ClientLayout */}

              {/* NAVBAR OFFSET */}
              <div className="h-[80px]" />

              <main className="min-h-screen">
                {children}
              </main>

              
            </ClientLayout>

            {/* GLOBAL STICKY PLAYER */}
            <StickyPlayer />
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  toast:
                    "border border-white/10 bg-zinc-950/95 text-white shadow-[0_0_40px_rgba(168,85,247,0.25)] backdrop-blur-xl",
                  title: "text-white",
                  description: "text-zinc-400",
                  success: "border-purple-500/40",
                  error: "border-red-500/40",
                },
              }}
            />

          </AudioProvider>
        </CartProvider>

      </body>
    </html>
  );
}
