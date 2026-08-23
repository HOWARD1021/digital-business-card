"use client";

import React from "react";
import { Truck, Sparkles, Gift } from "lucide-react";

export default function StatsBar() {
  const items = [
    {
      icon: (
        <div className="w-12 h-12 rounded-full bg-[#dcb880] text-[#4d3214] flex items-center justify-center font-bold text-sm shadow-2xs">
          <span className="text-xl">🥮</span>
        </div>
      ),
      title: "100% 台灣在地手作",
      desc: "少糖低油・真材實料無負擔",
    },
    {
      icon: (
        <div className="w-12 h-12 rounded-full bg-[#bcd3c1] text-[#1c402d] flex items-center justify-center font-bold text-sm shadow-2xs">
          <span className="text-xl">🌕</span>
        </div>
      ),
      title: "62 家中秋愛心機構",
      desc: "月餅・蛋黃酥・手作茶點",
    },
    {
      icon: (
        <div className="w-12 h-12 rounded-full bg-[#b8cfd8] text-[#1b4353] flex items-center justify-center font-bold text-sm shadow-2xs">
          <Truck className="w-6 h-6" />
        </div>
      ),
      title: "節慶全台安心配送",
      desc: "產地直送・企業與個人送禮",
    },
  ];

  return (
    <section className="bg-[#ede5d6] py-6 border-b border-[#ddcdb8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center md:justify-start gap-4 py-2"
            >
              {item.icon}
              <div className="text-left font-serif">
                <h3 className="text-base sm:text-lg font-extrabold text-[#28221c] leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#695d52] mt-0.5 font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
