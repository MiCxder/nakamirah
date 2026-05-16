import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/lib/AudioContext";
import { CartProvider } from "@/lib/CartContext";
import StickyPlayer from "@/components/audio/StickyPlayer";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata = {
  title: "Nakamirah Beats",
  description: "Premium beats, loops and instrumentals",
};

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

              {/* 🔥 NAVBAR OFFSET */}
              <div className="h-[80px]" />

              <main className="min-h-screen">
                {children}
              </main>

            </ClientLayout>

            {/* GLOBAL STICKY PLAYER */}
            <StickyPlayer />

          </AudioProvider>
        </CartProvider>

      </body>
    </html>
  );
}