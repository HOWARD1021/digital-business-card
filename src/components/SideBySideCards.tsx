"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, Sprout, Cog, Package, Heart } from "lucide-react";

interface SideBySideCardsProps {
  onExplorePartners: () => void;
  onExploreTraceability: () => void;
}

export default function SideBySideCards({
  onExplorePartners,
  onExploreTraceability,
}: SideBySideCardsProps) {
  return (
    <section id="about" className="py-16 sm:py-20 bg-[#f7efe3] border-b border-[#e2d2be]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Card: 與在地職人同行・圓滿中秋 */}
          <div className="rounded-3xl bg-[#faefe0] border border-[#e2d2bd] shadow-md p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
            
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="text-xs font-bold uppercase tracking-widest text-[#a83d2a] bg-[#f2dfce] px-3 py-1 rounded-full">
                🌕 中秋做愛心・職人同行
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#28221c] font-serif">
                與在地職人同行・圓滿中秋
              </h3>
              
              <p className="text-sm sm:text-base text-[#5c5044] font-serif leading-relaxed">
                每一顆金黃蛋黃酥、每一盒手工餅乾，都是孩子們經過 21 道嚴謹工序、反覆練習數百次的成果。今年中秋，邀您一同走進身障職人的世界，讓您的送禮心意化為最踏實的自立力量。
              </p>
              
              <div className="pt-2">
                <button
                  onClick={onExplorePartners}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b392b] hover:bg-[#12281e] text-white text-xs sm:text-sm font-bold shadow transition-all group-hover:scale-105 cursor-pointer"
                >
                  <span>認識 62 家中秋愛心機構</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Farmhouse & Bicycle Illustration at bottom right */}
            <div className="mt-8 pt-4 relative aspect-[16/7] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/artisan-card.png"
                alt="與在地職人同行 插畫"
                fill
                className="object-cover object-bottom"
              />
            </div>

          </div>

          {/* Right Card: 安心溯源・看得見的中秋堅持 */}
          <div className="rounded-3xl bg-[#e3ecf0] border border-[#c9d8df] shadow-md p-8 sm:p-10 flex flex-col justify-between">
            
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1d313c] bg-[#cde0e8] px-3 py-1 rounded-full">
                🌿 健康少負擔・無人工添加
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1d313c] font-serif">
                安心溯源・看得見的中秋堅持
              </h3>
              
              <p className="text-sm sm:text-base text-[#465b66] font-serif leading-relaxed">
                堅持少糖、低油、零人工防腐劑。從在地友善農產到嚴格衛生烘焙，透明公開每個環節，為家人與企業客戶獻上最健康安心的佳節祝福。
              </p>

              {/* 4 Steps Circle Flow matching mockup */}
              <div className="py-6 grid grid-cols-4 gap-2 relative">
                {/* Connecting dashed line */}
                <div className="absolute top-[38px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#8ba5b3] z-0 pointer-events-none" />

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Sprout className="w-5 h-5 text-[#22483d]" />
                  </div>
                  <span className="text-xs font-bold text-[#2a4350] font-serif">
                    在地原料
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Cog className="w-5 h-5 text-[#466070]" />
                  </div>
                  <span className="text-xs font-bold text-[#2a4350] font-serif">
                    庇護手作
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Package className="w-5 h-5 text-[#855325]" />
                  </div>
                  <span className="text-xs font-bold text-[#2a4350] font-serif">
                    嚴格品檢
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Heart className="w-5 h-5 text-[#9e3524]" />
                  </div>
                  <span className="text-xs font-bold text-[#2a4350] font-serif">
                    暖心送達
                  </span>
                </div>
              </div>

            </div>

            {/* Deep Blue Button matching mockup */}
            <div className="pt-4">
              <button
                onClick={onExploreTraceability}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b3e4d] hover:bg-[#122b36] text-white text-xs sm:text-sm font-bold shadow transition-all hover:scale-105 cursor-pointer"
              >
                <span>了解中秋安心製程</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
