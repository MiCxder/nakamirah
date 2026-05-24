"use client";

import React, { useRef } from "react";
import type { Beat } from "@/types/beat";
import BeatCard from "@/components/beat/BeatCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MotionContainer, MotionItem } from "@/components/ui/Motion";

export default function SectionCarousel({ items }: { items: Beat[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (distance: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <div>
      {/* Mobile / tablet: horizontal scroll carousel */}
      <MotionContainer className="relative block lg:hidden">
        <button
          aria-label="scroll left"
          onClick={() => scrollBy(-320)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-8 scroll-snap-x snap-mandatory"
        >
          {items.map((b) => (
            <MotionItem
              key={`${b.id}-${b.title}`}
              className="snap-start flex-shrink-0 w-72"
            >
              <BeatCard beat={b} />
            </MotionItem>
          ))}
        </div>

        <button
          aria-label="scroll right"
          onClick={() => scrollBy(320)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70"
        >
          <ChevronRight size={18} />
        </button>
      </MotionContainer>

      {/* Desktop: grid layout */}
      <MotionContainer className="hidden lg:grid lg:grid-cols-5 gap-6">
        {items.map((b) => (
          <MotionItem key={`${b.id}-${b.title}`}>
            <BeatCard beat={b} />
          </MotionItem>
        ))}
      </MotionContainer>
    </div>
  );
}
