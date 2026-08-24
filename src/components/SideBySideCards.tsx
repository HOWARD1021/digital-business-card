"use client";

import React from "react";
import { ChevronRight, Sprout, Cog, Package, Heart } from "lucide-react";

interface SideBySideCardsProps {
  onExplorePartners: () => void;
}

export default function SideBySideCards({
  onExplorePartners,
}: SideBySideCardsProps) {
  return (
    <section id="about" className="py-10 sm:py-18 bg-[#f7efe3] border-b border-[#e2d2be]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 items-stretch">
          
          {/* Left Card: 與在地職人同行・圓滿中秋 */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#faefe0] border border-[#e2d2bd] shadow-sm p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group">
            
            <div className="relative z-10 space-y-3 sm:space-y-4 max-w-md">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#a83d2a] bg-[#f2dfce] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full inline-block">
                🌕 中秋做愛心・職人同行
              </span>

              <h3 className="text-xl sm:text-3xl font-extrabold text-[#28221c] font-serif">
                與在地職人同行・圓滿中秋
              </h3>
              
              <p className="text-xs sm:text-base text-[#5c5044] font-serif leading-relaxed">
                每一顆金黃蛋黃酥、每一盒手工餅乾，都是孩子們經過 21 道嚴謹工序、反覆練習數百次的成果。今年中秋，邀您一同走進身障職人的世界，讓您的送禮心意化為最踏實的自立力量。
              </p>
              
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={onExplorePartners}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#1b392b] hover:bg-[#12281e] text-white text-xs sm:text-sm font-bold shadow transition-all group-hover:scale-105 cursor-pointer font-serif"
                >
                  <span>認識 62 家中秋愛心機構</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Card: 安心溯源・看得見的中秋堅持 */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#e3ecf0] border border-[#c9d8df] shadow-sm p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
            
            <div className="space-y-3 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#1d313c] bg-[#cde0e8] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full inline-block">
                🌿 健康少負擔・無人工添加
              </span>

              <h3 className="text-xl sm:text-3xl font-extrabold text-[#1d313c] font-serif">
                安心溯源・看得見的中秋堅持
              </h3>
              
              <p className="text-xs sm:text-base text-[#465b66] font-serif leading-relaxed">
                堅持少糖、低油、零人工防腐劑。從在地友善農產到嚴格衛生烘焙，透明公開每個環節，為家人與企業客戶獻上最健康安心的佳節祝福。
              </p>

              {/* 4 Steps Circle Flow matching mockup */}
              <div className="py-4 sm:py-6 grid grid-cols-4 gap-1 sm:gap-2 relative">
                {/* Connecting dashed line */}
                <div className="absolute top-[26px] sm:top-[38px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#8ba5b3] z-0 pointer-events-none" />

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-1 sm:space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-[#22483d]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#2a4350] font-serif">
                    在地原料
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-1 sm:space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Cog className="w-4 h-4 sm:w-5 sm:h-5 text-[#466070]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#2a4350] font-serif">
                    庇護手作
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-1 sm:space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#855325]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#2a4350] font-serif">
                    嚴格品檢
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center relative z-10 space-y-1 sm:space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#1d313c] border-2 border-[#adc4d0] flex items-center justify-center shadow-xs">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#9e3524]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#2a4350] font-serif">
                    暖心送達
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
