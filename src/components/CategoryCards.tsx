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
      title: "台灣烘焙與禮盒",
      image: "/images/cat-textiles.png",
      filterKey: "手作烘焙",
      subtitle: "金賞蛋黃酥・手工餅乾・鳳梨酥",
      description: "星兒與唐寶寶 21 道嚴格工法！嚴選天然奶油與低糖紅豆餡，外皮酥香、無人工防腐劑，中秋送禮首選。",
    },
    {
      id: "在地風味",
      title: "在地風味與茶點",
      image: "/images/cat-flavors.png",
      filterKey: "在地風味",
      subtitle: "團圓喜樂水餃・小農好米・解膩果乾茶飲",
      description: "中秋闔家團圓必備！團購冠軍喜樂爆汁水餃、台南日曬越光米、屏東愛文芒果乾與澎湖解膩好茶。",
    },
    {
      id: "日常器物",
      title: "日常洗沐與器物",
      image: "/images/cat-objects.png",
      filterKey: "日常器物",
      subtitle: "45天冷製手工皂・生活陶藝・原木文創",
      description: "不吃甜食的暖心選擇！天然植萃手工皂、溫潤手捏茶杯與原木工藝，實用無負擔，傳遞長久相伴的祝福。",
    },
  ];

  return (
    <section id="categories" className="py-16 sm:py-20 bg-[#f5ede0] border-b border-[#e2d2be]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: 標題改為 來自台灣的中秋心意風景 */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#28221c] font-serif flex items-center justify-center gap-2">
            <span>🌕</span>
            <span>來自台灣的中秋心意風景</span>
            <span>🌕</span>
          </h2>
          <p className="text-sm sm:text-base text-[#695d52] font-serif">
            每一份中秋禮盒，都是一段慢飛天使靠雙手自立的感動故事。
          </p>
        </div>

        {/* 3 Large Aesthetic Cards matching mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.filterKey);
                const el = document.getElementById("directory");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group cursor-pointer rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-[#dfcfbd] bg-white flex flex-col justify-between"
            >
              {/* Illustration Image Section */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ebe2d4]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Bottom Label Bar matching mockup */}
              <div className="p-5 bg-[#fbf6ee] border-t border-[#ebdcc8] flex flex-col justify-between space-y-3">
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
                  <span>點擊查看中秋推薦機構</span>
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
