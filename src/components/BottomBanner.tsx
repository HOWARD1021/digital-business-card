"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface BottomBannerProps {
  onExplore: () => void;
}

export default function BottomBanner({ onExplore }: BottomBannerProps) {
  return (
    <section className="relative overflow-hidden bg-[#163325] text-white py-10 sm:py-18 border-b border-[#0d2218]">
      
      {/* Background Illustrated Texture matching mockup */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <Image
          src="/images/bottom-banner.png"
          alt="把台灣的好，帶進生活裡"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4 sm:space-y-6">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <span>🌕 2026 中秋做愛心・溫暖送禮專題</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-wide text-white drop-shadow-md">
          把台灣的中秋溫暖，帶進家家戶戶
        </h2>

        <p className="text-xs sm:text-base text-emerald-100/90 font-serif max-w-xl mx-auto leading-relaxed">
          一盒手作月餅，一份真摯善念。今年中秋送禮，讓我們一起點亮全台 62 家身心障礙福利機構的自立希望！
        </p>

        <div className="pt-1 sm:pt-2">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#9e3524] hover:bg-[#862c1d] text-white text-xs sm:text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all group cursor-pointer font-serif"
          >
            <span>🌕 探索 62 家中秋愛心禮盒</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
