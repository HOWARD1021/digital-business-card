"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  onExplore: () => void;
}

export default function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#eeb34b] bg-gradient-to-b from-[#f3b953] via-[#ebb049] to-[#e4a43b] text-[#221f1d] pt-6 sm:pt-10 lg:pt-14 pb-0 border-b border-[#ddcbaf]">
      
      {/* 1. Subtle Paper Grain / Noise Texture */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 6px 6px'
        }}
      />

      {/* 2. Illustrated Soft Clouds matching design with Entrance & Ambient Floating Drift */}
      {/* Top Center Cloud */}
      <div className="absolute top-3 sm:top-6 left-[40%] sm:left-[42%] -translate-x-1/2 w-36 sm:w-60 h-10 sm:h-14 pointer-events-none z-0 animate-cloud-entrance-1">
        <div className="w-full h-full animate-cloud-drift-1">
          <svg viewBox="0 0 200 60" fill="none" className="w-full h-full text-[#fef5e2]/95 drop-shadow-xs">
            <path
              d="M30 45 C15 45 5 35 5 25 C5 15 18 8 30 12 C38 4 55 2 68 10 C78 2 105 2 118 12 C128 6 145 7 152 16 C162 14 175 22 175 32 C175 42 165 45 155 45 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Middle Right Cloud */}
      <div className="absolute top-[40%] sm:top-[45%] right-2 sm:right-8 lg:right-16 w-28 sm:w-52 h-8 sm:h-12 pointer-events-none z-0 animate-cloud-entrance-2">
        <div className="w-full h-full animate-cloud-drift-2">
          <svg viewBox="0 0 180 55" fill="none" className="w-full h-full text-[#fef5e2]/95 drop-shadow-xs">
            <path
              d="M25 40 C12 40 4 32 4 22 C4 13 15 7 26 10 C33 3 48 2 60 8 C68 2 92 2 104 10 C112 5 128 6 134 14 C144 12 155 19 155 28 C155 37 146 40 136 40 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* 3. Main Hero Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* ========================================================================= */}
        {/* === MOBILE & TABLET LAYOUT (< md: 768px) ================================ */}
        {/* ========================================================================= */}
        <div className="md:hidden">
          
          {/* Top Text & Action Block (Full Width, Bold Typography, Raised Layer) */}
          <div className="space-y-3.5 text-left pt-1 relative z-30 animate-hero-fade-in">
            
            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl xs:text-[44px] font-black text-[#211e1c] font-serif tracking-tight leading-[1.12] drop-shadow-xs">
                島嶼好物，
                <br />
                台灣製造
              </h1>
              
              <p className="text-sm xs:text-base font-bold text-[#382e25] font-serif tracking-wider pt-0.5">
                從土地、職人到你的日常
              </p>
            </div>

            {/* Action Row: CTA Button + MADE IN TAIWAN Stamp */}
            <div className="flex items-center gap-3.5 flex-wrap pt-0.5">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 xs:px-6 xs:py-3 rounded-full bg-[#a33924] hover:bg-[#8b2e1b] active:scale-[0.98] text-white text-sm font-bold shadow-md hover:shadow-xl transition-all group cursor-pointer font-serif"
              >
                <span>探索台灣好物</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Hand-drawn MADE IN TAIWAN Stamp in ocean blue */}
              <div className="select-none inline-block transform -rotate-4">
                <div className="text-[#1e4878] font-sans font-black tracking-[0.2em] uppercase flex flex-col leading-tight">
                  <span className="text-[10px] font-extrabold opacity-95 tracking-[0.22em]">MADE IN</span>
                  <span className="text-base font-black tracking-widest mt-0.5">TAIWAN</span>
                  <svg className="w-full h-1.5 mt-0.5 text-[#1e4878]" viewBox="0 0 160 12" fill="none">
                    <path d="M2 4 C 40 1, 120 7, 158 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M12 9 C 60 7, 110 11, 148 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Dedicated Taiwan & Ocean Hero Stage on Mobile: Shifted up to gracefully tuck behind/near text */}
          <div className="relative w-full max-w-[360px] xs:max-w-[400px] mx-auto h-[480px] xs:h-[540px] -mt-10 xs:-mt-12 flex items-center justify-center z-20">
            
            {/* Taiwan Illustrated Map with Entrance Fade-In */}
            <div className="relative w-full h-full animate-map-fade-in translate-x-2 xs:translate-x-4">
              <Image
                src="/images/hero/taiwan.png"
                alt="島嶼好物 台灣製造 地圖插畫"
                fill
                priority
                className="object-contain object-center hover:scale-[1.01] transition-transform duration-500 drop-shadow-sm"
              />
            </div>

            {/* Mobile Ocean Wave: Flushed to the bottom-left */}
            <div className="absolute bottom-0 -left-4 w-[108%] max-w-[440px] aspect-[2172/463] pointer-events-none z-10 animate-ocean-fade-in">
              <Image
                src="/images/hero/ocean.png"
                alt="海洋波浪插畫"
                fill
                priority
                unoptimized
                className="object-contain object-bottom-left"
              />
            </div>

            {/* Prominent Fishing Boat placed in the open southwest sea with Entrance + Gentle Float */}
            <div className="absolute bottom-2 xs:bottom-3 left-1 xs:left-2 w-32 xs:w-40 pointer-events-none z-20 animate-boat-entrance">
              <div className="relative w-full aspect-[1049/638] animate-boat-float">
                <Image
                  src="/images/hero/boat.png"
                  alt="漁船插畫"
                  fill
                  priority
                  unoptimized
                  className="object-contain object-bottom-left drop-shadow-md"
                />
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* === DESKTOP LAYOUT (>= md: 768px) ======================================= */}
        {/* ========================================================================= */}
        <div className="hidden md:block relative min-h-[600px] lg:min-h-[700px] pt-4 lg:pt-8 pb-8 lg:pb-12">
          
          <div className="flex items-center justify-between">
            {/* Left Content Area (Text, CTA, Stamp) with Entrance Fade-In */}
            <div className="w-[50%] lg:w-[45%] space-y-6 lg:space-y-7 text-left z-10 pb-28 lg:pb-36 animate-hero-fade-in">
              
              {/* Main Headline matching mockup */}
              <div className="space-y-3 lg:space-y-4">
                <h1 className="text-5xl lg:text-[68px] xl:text-[76px] font-black text-[#211e1c] font-serif tracking-tight leading-[1.14]">
                  島嶼好物，
                  <br />
                  台灣製造
                </h1>
                
                <p className="text-lg lg:text-[23px] font-bold text-[#382e25] font-serif tracking-wider pt-1">
                  從土地、職人到你的日常
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-1">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center gap-3 px-8 lg:px-9 py-3.5 lg:py-4 rounded-full bg-[#a33924] hover:bg-[#8b2e1b] active:scale-[0.98] text-white text-base lg:text-lg font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all group cursor-pointer font-serif"
                >
                  <span>探索台灣好物</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hand-drawn MADE IN TAIWAN Stamp */}
              <div className="pt-1 select-none">
                <div className="inline-block transform -rotate-6 transition-transform hover:rotate-0 duration-300 origin-left">
                  <div className="text-[#1e4878] font-sans font-black tracking-[0.25em] uppercase flex flex-col leading-tight">
                    <span className="text-sm lg:text-base font-extrabold opacity-95 tracking-[0.25em]">MADE IN</span>
                    <span className="text-2xl lg:text-3xl font-black tracking-widest mt-0.5">TAIWAN</span>
                    <svg className="w-full h-2.5 mt-0.5 text-[#1e4878]" viewBox="0 0 160 12" fill="none">
                      <path d="M2 4 C 40 1, 120 7, 158 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M12 9 C 60 7, 110 11, 148 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Area (Artistic Taiwan Map) with Entrance Fade-In */}
            <div className="w-[50%] lg:w-[55%] flex justify-end items-center h-[560px] lg:h-[680px] relative animate-map-fade-in">
              <div className="relative w-full h-full max-w-[380px] lg:max-w-[500px]">
                <Image
                  src="/images/hero/taiwan.png"
                  alt="島嶼好物 台灣製造 地圖插畫"
                  fill
                  priority
                  className="object-contain object-center hover:scale-[1.01] transition-transform duration-500 drop-shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Desktop Fishing Boat: Anchored within the max-w-6xl container under left column */}
          <div className="absolute bottom-6 lg:bottom-10 left-8 lg:left-20 w-52 lg:w-64 pointer-events-none z-20 animate-boat-entrance">
            <div className="relative w-full aspect-[1049/638] animate-boat-float">
              <Image
                src="/images/hero/boat.png"
                alt="漁船插畫"
                fill
                priority
                unoptimized
                className="object-contain object-bottom-left drop-shadow-md"
              />
            </div>
          </div>

        </div>

      </div>

      {/* 4. Desktop Ocean Waves: Flush with the absolute bottom-left corner of the viewport/section */}
      <div className="hidden md:block absolute bottom-0 left-0 w-[58vw] lg:w-[54vw] xl:w-[50vw] 2xl:w-[48vw] max-w-[920px] min-w-[520px] pointer-events-none z-10 animate-ocean-fade-in">
        <div className="relative w-full aspect-[2172/463]">
          <Image
            src="/images/hero/ocean.png"
            alt="海洋波浪插畫"
            fill
            priority
            unoptimized
            className="object-contain object-bottom-left"
          />
        </div>
      </div>

    </section>
  );
}
