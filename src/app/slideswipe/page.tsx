"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Item {
  id: number;
  original: string;
  styled: string;
}

// Single original image + eight styled variants (PNG)
// Place original at: public/slides/original.png
// Place styled variants at: public/slides/styled/1.png … 8.png
const ORIGINAL_SRC = "/slides/original.png";

const items: Item[] = Array.from({ length: 8 }).map((_, idx) => {
  const id = idx + 1;
  return {
    id,
    original: ORIGINAL_SRC,
    styled: `/slides/styled/${id}.png`,
  } as Item;
});

const STEP_DELAY = 800; // slower stagger for button-driven start
const REVEAL_DURATION = 1200; // slower swipe animation

const SwipeCell: React.FC<{ item: Item; reveal: boolean }> = ({ item, reveal }) => {
  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden bg-black/80 rounded-lg">
      {/* original */}
      <Image src={item.original} alt="orig" fill className="object-cover" unoptimized />

      {/* styled overlay with swipe reveal */}
      <Image
        src={item.styled}
        alt="styled"
        fill
        className="object-cover absolute top-0 left-0"
        style={{
          clipPath: reveal ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          transition: `clip-path ${REVEAL_DURATION}ms linear`,
        }}
        unoptimized
      />

      {/* moving line */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white/80"
        style={{
          transform: reveal ? "translateX(100%)" : "translateX(0)",
          transition: `transform ${REVEAL_DURATION}ms linear`,
        }}
      />
    </div>
  );
};

export default function SlideSwipePage() {
  const [revealed, setRevealed] = useState<boolean[]>(Array(items.length).fill(false));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    // reset
    setRevealed(Array(items.length).fill(false));

    items.forEach((_, i) => {
      setTimeout(() => {
        setRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * STEP_DELAY);
    });
  }, [started]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 space-y-8">
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {items.map((item, idx) => (
          <SwipeCell key={item.id} item={item} reveal={revealed[idx]} />
        ))}
      </div>

      <button
        onClick={() => setStarted((s) => !s)}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium"
      >
        {started ? "重新開始" : "開始掃描"}
      </button>
    </div>
  );
} 