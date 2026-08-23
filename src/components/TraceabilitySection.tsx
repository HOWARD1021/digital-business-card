"use client";

import React from "react";
import { Sprout, Cog, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from "lucide-react";

export default function TraceabilitySection() {
  const steps = [
    {
      num: "01",
      icon: <Sprout className="w-6 h-6 text-[#22483d]" />,
      title: "在地原料",
      desc: "嚴選台灣在地無毒農作、新鮮放牧雞蛋、天然植物油與純淨穀物，拒絕人工香精與有害添加物。",
    },
    {
      num: "02",
      icon: <Cog className="w-6 h-6 text-[#854d0e]" />,
      title: "庇護職培",
      desc: "專業職能治療師與烘焙師一對一輔導，以21道嚴謹標準工序，讓身障職人發揮極致專注與手作才華。",
    },
    {
      num: "03",
      icon: <ShieldCheck className="w-6 h-6 text-[#1e40af]" />,
      title: "品質檢驗",
      desc: "嚴格落實食品安全衛生自主管理，少糖、低油、少鹽健康配方，經得起最嚴苛的品質檢驗。",
    },
    {
      num: "04",
      icon: <HeartHandshake className="w-6 h-6 text-[#a8422b]" />,
      title: "安心送達",
      desc: "產地新鮮製作出貨，全台妥善防撞包裝直達府上，每一份好物都附帶身障機構的暖心感謝故事。",
    },
  ];

  return (
    <section id="traceability" className="py-20 bg-[#f8f2e6] border-b border-[#ebdcc8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-[#e5d5c0] shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#22483d] bg-[#e4ede6] px-3.5 py-1 rounded-full">
              從原料到包裝・透明公開
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#29221c] font-serif">
              安心溯源・看得見的堅持
            </h2>
            <p className="text-base text-[#6b5a4d]">
              從原料、製程到包裝，透明公開每個環節，讓你買得安心，用得放心，吃得開心。
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#fcf9f2] rounded-2xl p-6 border border-[#ebdcc8] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <span className="text-2xl font-black text-[#decab3] font-mono">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#2a221b] font-serif mb-2 flex items-center gap-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#615244] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ebdcc8]/60 flex items-center gap-1 text-[11px] font-semibold text-[#22483d]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>品質保證環節</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
