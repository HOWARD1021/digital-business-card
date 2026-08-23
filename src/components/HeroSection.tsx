"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, Sparkles, MapPin, Heart } from "lucide-react";

interface HeroSectionProps {
  onExplore: () => void;
}

export default function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2b347] via-[#ebb049] to-[#2e527d] text-[#22201e] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#ebdcc8]">
      
      {/* Background soft cloud & canvas grain texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Slogan, Subtitle, CTA, Stamp */}
          <div className="lg:col-span-5 space-y-6 text-left pl-2 lg:pl-0">
            
            {/* Mid-Autumn Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fae5c3] border border-[#d9bf9e] text-[#804719] text-xs sm:text-sm font-bold tracking-wide shadow-2xs font-serif">
              <span>🌕 2026 中秋做愛心・身障機構良品手冊</span>
            </div>

            {/* Main Headline: 標題改為 台灣好物，中秋送暖 */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#221f1d] font-serif tracking-tight leading-[1.12]">
                台灣好物，
                <br />
                <span className="text-[#9e3524]">中秋送暖</span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-[#382f27] font-serif tracking-wide pt-1">
                月圓人團圓，用手作心意溫暖全台灣
              </p>
            </div>

            {/* Introductory copy tailored for Mid-Autumn Festival gifting */}
            <p className="text-sm sm:text-base text-[#4a3e35] leading-relaxed max-w-md font-serif">
              今年中秋送禮，讓每一份祝福都化為實質支持！本站完整收錄全台 62 家身心障礙福利機構與庇護工場的中秋月餅、金賞蛋黃酥、手工餅乾與在地良品，陪伴慢飛天使靠雙手自立圓夢。
            </p>

            {/* CTA Button matching mockup: Terracotta red rounded pill */}
            <div className="pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#9e3524] hover:bg-[#862c1d] text-white text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group cursor-pointer"
              >
                <span>🌕 尋找中秋愛心禮盒</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Hand-drawn script stamp in ocean blue matching mockup: MADE IN TAIWAN */}
            <div className="pt-2">
              <div className="inline-block transform -rotate-6">
                <span className="font-sans font-black tracking-widest text-[#1e4878] text-xl sm:text-2xl uppercase border-b-2 border-[#1e4878] pb-0.5">
                  MADE IN TAIWAN
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Full Artistic Illustrated Taiwan Map matching mockup */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            <div className="relative w-full max-w-[500px] lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-[#fff9f0]/60 ring-1 ring-[#dec8ae] bg-[#ebdcc7]/20 group">
              <div className="relative aspect-[4/5] sm:aspect-[6/7] w-full">
                <Image
                  src="/images/hero-map.png"
                  alt="台灣好物 中秋台灣地圖插畫"
                  fill
                  priority
                  className="object-contain object-center hover:scale-[1.02] transition-transform duration-700"
                />
              </div>

              {/* Floating Quick Jump Tag */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#e8dbc8] shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif text-[#332a23]">
                  <Heart className="w-3.5 h-3.5 text-[#9e3524] fill-[#9e3524]" />
                  <span>全台 22 縣市・62 家機構中秋良品推薦</span>
                </div>
                <button
                  onClick={onExplore}
                  className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#1b392b] text-white hover:bg-[#12281e] transition-colors"
                >
                  挑選禮盒
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
