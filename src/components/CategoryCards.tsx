"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardsProps {
  onSelectCategory: (category: string) => void;
}

export default function CategoryCards({ onSelectCategory }: CategoryCardsProps) {
  const categories = [
    {
      id: "手作烘焙",
      title: "庇護工場月餅與烘焙",
      image: "/images/mid-autumn-bakery.png",
      filterKey: "手作烘焙",
      subtitle: "蛋黃酥・月餅・手工餅乾・鳳梨酥",
      description: "從身心障礙者庇護工場挑選 2026 中秋月餅與台灣烘焙，讓每一次送禮都成為支持職人工作的實際行動。",
    },
    {
      id: "在地風味",
      title: "台灣在地風味與茶點",
      image: "/images/mid-autumn-flavors.png",
      filterKey: "在地風味",
      subtitle: "小農好米・果乾茶飲・團圓手作食品",
      description: "認識全台愛心機構的在地好味道，從日常食品到中秋茶點，選一份真材實料，也陪伴機構持續提供工作與培力。",
    },
    {
      id: "日常器物",
      title: "手作禮盒與生活器物",
      image: "/images/mid-autumn-crafts.png",
      filterKey: "日常器物",
      subtitle: "手工皂・生活陶藝・原木文創",
      description: "不只月餅，也能用實用的台灣手作傳遞心意。選購身心障礙機構的生活好物，讓中秋祝福延續到每天的日常。",
    },
  ];

  return (
    <section id="categories" className="py-10 sm:py-18 bg-[#f5ede0] border-b border-[#e2d2be]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: 2026 中秋公益選物 */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#28221c] font-serif flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-2xl">🌕</span>
            <span>2026 中秋，選禮也做愛心</span>
            <span className="text-base sm:text-2xl">🌕</span>
          </h2>
          <p className="text-xs sm:text-base text-[#695d52] font-serif">
            從月餅、蛋黃酥到手作禮盒，認識全台庇護工場與愛心機構，用一份台灣心意支持身心障礙職人走向自立。
          </p>
        </div>

        {/* 3 Large Aesthetic Cards matching mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.filterKey);
                const el = document.getElementById("directory");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#dfcfbd] bg-white flex flex-col justify-between"
            >
              {/* Illustration Image Section */}
              <div className="relative aspect-[16/10] sm:aspect-[4/5] w-full overflow-hidden bg-[#ebe2d4]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Bottom Label Bar matching mockup */}
              <div className="p-4 sm:p-5 bg-[#fbf6ee] border-t border-[#ebdcc8] flex flex-col justify-between space-y-2.5 sm:space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-[#28221c] font-serif group-hover:text-[#a83d2a] transition-colors">
                      {cat.title}
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-[#1b392b] text-white flex items-center justify-center group-hover:bg-[#a83d2a] transition-colors shadow-2xs">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-[#854d0e] font-serif mt-1">
                    {cat.subtitle}
                  </p>
                  <p className="text-xs text-[#6e5f52] leading-relaxed mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#ebdcc8]/60 text-[11px] font-bold text-[#a83d2a] flex items-center justify-between">
                  <span>查看推薦庇護工場與愛心機構</span>
                  <span>➔</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
