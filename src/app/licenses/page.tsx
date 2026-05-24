"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

/* =========================
   ANIMATION CONFIG
========================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

/* =========================
   DATA
========================= */
const licenses = [
  {
    name: "Basic",
    price: "$29",
    glow: "from-zinc-500/20 to-transparent",
    features: [
      "MP3 file",
      "Non-exclusive",
      "50K streams",
      "Music video allowed",
      "No radio",
    ],
  },
  {
    name: "Premium",
    price: "$79",
    glow: "from-purple-500/30 via-purple-600/20 to-transparent",
    popular: true,
    features: [
      "WAV + MP3",
      "Non-exclusive",
      "500K streams",
      "Music video + radio",
      "Monetization allowed",
    ],
  },
  {
    name: "Exclusive",
    price: "$299",
    glow: "from-yellow-500/30 via-yellow-600/20 to-transparent",
    features: [
      "Full ownership",
      "Unlimited streams",
      "All formats",
      "TV + ads + radio",
      "Removed from store",
    ],
  },
];

/* =========================
   PAGE
========================= */
export default function LicensesPage() {
  return (
    <main className="relative container mx-auto px-6 py-24">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[160px]" />
        <div className="absolute bottom-[-120px] right-[-100px] w-[500px] h-[500px] bg-yellow-500/10 blur-[140px]" />
      </div>

      {/* HERO */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Licensing & Usage
        </h1>

        <p className="mt-5 text-zinc-400 text-lg leading-relaxed">
          Clear, transparent licensing designed for artists at every stage.
          Choose the license that matches your release strategy.
        </p>
      </motion.div>

      {/* LICENSE CARDS */}
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        {licenses.map((lic, i) => (
          <motion.div
            key={lic.name}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 overflow-hidden transition"
          >
            {/* GLOW */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br ${lic.glow}`}
            />

            {/* BORDER GLOW */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-purple-500/40 transition" />

            {/* POPULAR BADGE */}
            {lic.popular && (
              <div className="absolute top-4 right-4 text-xs bg-purple-600 px-3 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            {/* CONTENT */}
            <div className="relative z-10">
              <h2 className="text-xl font-semibold">{lic.name}</h2>

              <p className="text-4xl font-bold mt-3">{lic.price}</p>

              <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                {lic.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 group-hover:text-white transition"
                  >
                    <span className="text-purple-400">•</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/beats"
                className="block mt-8 text-center bg-purple-600/90 backdrop-blur-md py-3 rounded-xl font-medium hover:bg-purple-700 transition shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                Browse Beats
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* COMPARISON TABLE */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mt-28"
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          Compare Licenses
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-white/10 backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left">Feature</th>
                <th>Basic</th>
                <th>Premium</th>
                <th>Exclusive</th>
              </tr>
            </thead>

            <tbody className="text-zinc-300">
              {[
                ["Streams", "50K", "500K", "Unlimited"],
                ["Files", "MP3", "WAV + MP3", "All"],
                ["Music Video", "✔", "✔", "✔"],
                ["Radio", "✖", "✔", "✔"],
                ["Ownership", "Non-exclusive", "Non-exclusive", "Full"],
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  {row.map((cell, j) => (
                    <td key={j} className="p-4 text-center">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mt-28 text-center"
      >
        <h2 className="text-3xl font-bold">
          Start your next release today
        </h2>

        <p className="text-zinc-400 mt-3">
          Find the perfect sound and bring your vision to life.
        </p>

        <Link
          href="/beats"
          className="inline-block mt-6 bg-purple-600 px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition shadow-[0_0_40px_rgba(168,85,247,0.35)]"
        >
          Browse Beats
        </Link>
      </motion.div>

    </main>
  );
}
