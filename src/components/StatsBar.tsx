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
    <section className="bg-[#ede5d6] py-3.5 sm:py-6 border-b border-[#ddcdb8]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-6 md:gap-8 divide-x divide-[#dec8ae]">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1.5 sm:gap-4 py-1 text-center sm:text-left ${
                idx > 0 ? "pl-2 sm:pl-6" : ""
              }`}
            >
              <div className="shrink-0 scale-85 sm:scale-100 origin-center">
                {item.icon}
              </div>
              <div className="font-serif">
                <h3 className="text-[11px] sm:text-base lg:text-lg font-extrabold text-[#28221c] leading-tight">
                  {item.title}
                </h3>
                <p className="text-[9px] sm:text-xs text-[#695d52] mt-0.5 font-sans leading-tight hidden xs:block sm:block">
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
