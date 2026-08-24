"use client";

import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#f5ede1] text-[#3d3228] border-t border-[#dfceba] py-8 sm:py-10 font-serif">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Sun Logo + Text matching mockup */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <Image
                src="/images/sun-logo.png"
                alt="台灣好物 Sun Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm sm:text-base font-bold tracking-wider text-[#25211e]">
                台灣好物・中秋送暖
              </span>
              <span className="text-[10px] text-[#7d7064] tracking-widest uppercase font-mono">
                2026 全台中秋愛心機構導覽
              </span>
            </div>
          </div>

          {/* Center: Clean Links separated by pipes matching mockup */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#4a3f37]">
            <a href="#about" className="hover:text-[#a83d2a] transition-colors">
              關於理念
            </a>
            <span className="text-[#d0bfab]">|</span>
            <a href="#categories" className="hover:text-[#a83d2a] transition-colors">
              中秋選品
            </a>
            <span className="text-[#d0bfab]">|</span>
            <a href="#directory" className="hover:text-[#a83d2a] transition-colors">
              62家中秋機構
            </a>
            <span className="text-[#d0bfab]">|</span>
            <a href="#traceability" className="hover:text-[#a83d2a] transition-colors">
              安心溯源
            </a>
          </nav>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-4 border-t border-[#ebdcc8] text-center text-xs text-[#8c7b6d] font-sans">
          <span>© {new Date().getFullYear()} 台灣好物・全台 62 家身心障礙福利機構中秋公益送禮導覽專區. All rights reserved.</span>
          <p className="mt-2 text-[10px] leading-relaxed text-[#a09284]">
            Hero 圖片素材目前僅供本網站非商業展示與專題介紹使用；如有權利疑義，請與我們聯繫，我們將立即處理下架。
          </p>
        </div>

      </div>
    </footer>
  );
}
