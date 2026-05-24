"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

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

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || "Failed to send message");
      }

      form.reset();
      toast.success("Message sent", {
        description: "Thanks for reaching out. We will get back to you within 24 hours.",
      });
    } catch (error) {
      toast.error("Message failed", {
        description: error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative container mx-auto px-6 py-24">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[160px]" />
      </div>

      {/* HERO */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-5xl font-bold">Get in Touch</h1>
        <p className="mt-4 text-zinc-400">
          Have questions, custom requests, or business inquiries? Let’s talk.
        </p>
      </motion.div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-10 mt-20 max-w-5xl mx-auto">

        {/* CONTACT INFO */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="space-y-6"
        >
          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <div className="mt-4 space-y-3 text-zinc-400 text-sm">
              <p>Email: support@nakamirah.com</p>
              <p>Response time: within 24 hours</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Business & Licensing</h2>

            <p className="mt-3 text-sm text-zinc-400">
              For exclusive beats, custom production, or commercial licensing,
              reach out directly and we’ll tailor a solution for you.
            </p>
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4"
        >
          <h2 className="text-xl font-semibold">Send a Message</h2>

          <input
            name="name"
            type="text"
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 outline-none"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            required
            rows={5}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-purple-600 py-3 font-medium transition shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-600/70 disabled:text-white/80"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition group-disabled:animate-pulse group-disabled:opacity-100" />
            {loading ? (
              <span className="relative flex items-center gap-3">
                <span className="h-5 w-5 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="relative">Send Message</span>
            )}
          </button>
        </motion.form>
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
          Looking for beats?
        </h2>

        <p className="text-zinc-400 mt-2">
          Explore our catalog and find your next sound.
        </p>

        <a
          href="/beats"
          className="inline-block mt-6 bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition"
        >
          Browse Beats
        </a>
      </motion.div>

    </main>
  );
}
