"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fbf7ee]/95 backdrop-blur-md border-b border-[#e8ddcf] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Golden Sun Geometric Rays Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <Image
                src="/images/sun-logo.png"
                alt="台灣好物 Sun Logo"
                width={36}
                height={36}
                className="object-contain group-hover:rotate-45 transition-transform duration-700"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-bold tracking-wider text-[#25211e] font-serif">
                  台灣好物・中秋送暖
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#9e3524] text-white font-bold">
                  中秋做愛心
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#7d7064] tracking-widest uppercase font-mono">
                62家身心障礙福利機構禮盒導覽
              </span>
            </div>
          </Link>

          {/* Center: Clean Nav Links separated by pipes matching design */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#423932] font-serif">
            <a href="#directory" className="hover:text-[#a83d2a] transition-colors flex items-center gap-1">
              <span>62家愛心機構</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#e8dac8] text-[#75441b] font-mono font-bold">
                全台名錄
              </span>
            </a>
            <span className="text-[#d5c7b5]">|</span>
            <a href="#categories" className="hover:text-[#a83d2a] transition-colors">
              中秋選品
            </a>
            <span className="text-[#d5c7b5]">|</span>
            <a href="#about" className="hover:text-[#a83d2a] transition-colors">
              關於理念
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#directory"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9e3524] hover:bg-[#862c1d] text-white text-xs font-bold tracking-wider shadow-sm transition-all"
            >
              <span>🌕 探索中秋愛心機構</span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#423932] hover:bg-[#ebdcc8] transition-colors"
              aria-label="開啟選單"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fbf7ee] border-b border-[#e8ddcf] px-6 py-4 space-y-3 font-serif">
          <a
            href="#directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#25211e] hover:text-[#a83d2a]"
          >
            62 家愛心機構・全台名錄
          </a>
          <a
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#25211e] hover:text-[#a83d2a]"
          >
            中秋心意選品（蛋黃酥/月餅/餅乾/手工皂）
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#25211e] hover:text-[#a83d2a]"
          >
            關於理念（中秋做愛心）
          </a>
          <div className="pt-2">
            <a
              href="#directory"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#a83d2a] text-white text-xs font-bold shadow"
            >
              <span>🌕 立即查看 62 家中秋機構</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
