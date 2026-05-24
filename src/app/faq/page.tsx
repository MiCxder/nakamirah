"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

/* =========================
   ANIMATION
========================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

/* =========================
   FAQ DATA
========================= */
const faqs = [
  {
    category: "Licensing",
    items: [
      {
        q: "Do I own the beat after purchase?",
        a: "No. Basic and Premium licenses are non-exclusive. Exclusive license grants full ownership and removes the beat from the store.",
      },
      {
        q: "Can I upload my song to Spotify/Apple Music?",
        a: "Yes. All licenses allow distribution. Limits depend on the license tier.",
      },
      {
        q: "What happens if I exceed stream limits?",
        a: "You’ll need to upgrade your license to continue monetizing legally.",
      },
    ],
  },
  {
    category: "Usage",
    items: [
      {
        q: "Can I use the beat for music videos?",
        a: "Yes. All licenses allow music video usage.",
      },
      {
        q: "Can I use the beat for commercial projects?",
        a: "Premium and Exclusive licenses allow monetization and commercial usage.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept secure online payments via Paystack.",
      },
      {
        q: "Can I get a refund?",
        a: "Due to the digital nature of products, all sales are final.",
      },
    ],
  },
];

/* =========================
   COMPONENT
========================= */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <span className="text-purple-400">{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-4 text-sm text-zinc-400"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================
   PAGE
========================= */
export default function FAQPage() {
  return (
    <main className="relative container mx-auto px-6 py-24">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[160px]" />
      </div>

      {/* HERO */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
        <p className="mt-4 text-zinc-400">
          Everything you need to know about licensing, usage, and purchases.
        </p>
      </motion.div>

      {/* FAQ SECTIONS */}
      <div className="mt-20 space-y-12 max-w-3xl mx-auto">
        {faqs.map((section, i) => (
          <motion.div
            key={section.category}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-xl font-semibold mb-4">
              {section.category}
            </h2>

            <div className="space-y-4">
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mt-24 text-center"
      >
        <h2 className="text-2xl font-bold">
          Still have questions?
        </h2>

        <p className="text-zinc-400 mt-2">
          Reach out and we’ll get back to you quickly.
        </p>

        <a
          href="/contact"
          className="inline-block mt-6 bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition"
        >
          Contact Us
        </a>
      </motion.div>

    </main>
  );
}
