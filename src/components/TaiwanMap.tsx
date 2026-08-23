"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Sparkles, Building2, ChevronRight } from "lucide-react";

interface TaiwanMapProps {
  onSelectRegion: (region: string) => void;
  onSelectCity: (city: string) => void;
  selectedRegion: string;
  selectedCity: string;
}

export default function TaiwanMap({
  onSelectRegion,
  onSelectCity,
  selectedRegion,
  selectedCity,
}: TaiwanMapProps) {
  const regions = [
    {
      id: "北部",
      name: "北部地區",
      count: 18,
      cities: ["基隆市", "臺北市", "新北市", "桃園市", "新竹縣"],
      highlightColor: "from-amber-600 to-orange-500",
      desc: "包含愛不囉嗦、喜憨兒庇護工場、愛肯樂活、觀音愛心家園等 18 家機構。",
      topSpecialties: "手工餅乾、老麵饅頭、重乳酪蛋糕、放牧雞蛋蛋捲",
    },
    {
      id: "中部",
      name: "中部地區",
      count: 13,
      cities: ["苗栗縣", "臺中市", "彰化縣", "雲林縣"],
      highlightColor: "from-emerald-700 to-teal-600",
      desc: "包含瑪利亞快樂襪、喜樂手工水餃、微笑天使、客庄擂茶等 13 家機構。",
      topSpecialties: "喜樂爆汁水餃、MerryYoung快樂襪、大甲芋頭酥、黑豆茶",
    },
    {
      id: "南部",
      name: "南部地區",
      count: 24,
      cities: ["嘉義縣", "嘉義市", "臺南市", "高雄市", "屏東縣"],
      highlightColor: "from-rose-600 to-red-500",
      desc: "機構密度最高！包含中外百年棋餅、瑞復漁光島核桃糕、一家工場、伯大尼大武山鮮乳等 24 家機構。",
      topSpecialties: "百年棋餅、漁光島南棗核桃糕、後壁越光米、大武山鮮乳、萬丹紅豆糕",
    },
    {
      id: "東部",
      name: "東部地區",
      count: 5,
      cities: ["宜蘭縣", "花蓮縣", "臺東縣"],
      highlightColor: "from-blue-600 to-cyan-500",
      desc: "包含花蓮黎明七星潭薄餅、台東牧心紅藜洛神花酥、宜蘭蘭智等 5 家機構。",
      topSpecialties: "七星潭檸檬薄餅、台東紅藜曲奇、三星蔥金棗酥、純棉布藝",
    },
    {
      id: "離島",
      name: "離島地區",
      count: 2,
      cities: ["澎湖縣", "金門縣"],
      highlightColor: "from-purple-600 to-indigo-500",
      desc: "跨海傳愛！包含澎湖仙人掌風茹茶集愛工坊、金門高粱風獅爺妙妙屋等 2 家機構。",
      topSpecialties: "澎湖仙人掌餅乾、金門高粱一口酥、風獅爺文創餅乾",
    },
  ];

  return (
    <section id="map" className="py-20 bg-gradient-to-b from-[#f7efe1] to-[#f4e8d6] border-b border-[#ebdcc8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebd6bf] text-[#854d0e] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            全台 62 家機構・地理足跡探索
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#29221d] font-serif">
            走進台灣 22 縣市的愛心工坊
          </h2>
          <p className="text-base text-[#6b5b4e]">
            從繁華都會到山海偏鄉、從本島到金門澎湖，點擊探索各地區的身障機構與特色名產。
          </p>
        </div>

        {/* Map Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Top: Interactive Map Visual Card */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#e4d3bd] shadow-lg">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#ebdcc8]">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#a8422b]" />
                <span className="font-bold text-[#2b2520] font-serif text-lg">全台分區快速導覽</span>
              </div>
              <button
                onClick={() => {
                  onSelectRegion("");
                  onSelectCity("");
                }}
                className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#f0e3ce] hover:bg-[#e2ceb4] text-[#78471c] transition-colors"
              >
                重設全台 (62家)
              </button>
            </div>

            {/* Region Selector Pills */}
            <div className="space-y-3">
              {regions.map((reg) => {
                const isSelected = selectedRegion === reg.id;
                return (
                  <div
                    key={reg.id}
                    onClick={() => {
                      onSelectRegion(isSelected ? "" : reg.id);
                      onSelectCity("");
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#22483d] text-white border-[#22483d] shadow-md -translate-y-0.5"
                        : "bg-[#fdfbf7] hover:bg-[#f6eee2] text-[#332b25] border-[#e8dac8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isSelected ? "bg-amber-400" : "bg-[#a8422b]"
                          }`}
                        />
                        <span className="font-bold font-serif text-base">{reg.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#ebdcc8] text-[#6b4725]"
                        }`}
                      >
                        {reg.count} 家機構
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed line-clamp-2 ${
                        isSelected ? "text-emerald-100" : "text-[#706053]"
                      }`}
                    >
                      {reg.desc}
                    </p>

                    {/* City tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-current/10">
                      {reg.cities.map((city) => {
                        const isCityActive = selectedCity === city;
                        return (
                          <button
                            key={city}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRegion(reg.id);
                              onSelectCity(isCityActive ? "" : city);
                            }}
                            className={`text-[11px] px-2 py-0.5 rounded-md transition-all font-medium ${
                              isCityActive
                                ? "bg-amber-400 text-slate-900 font-bold shadow-xs"
                                : isSelected
                                ? "bg-white/15 hover:bg-white/30 text-white"
                                : "bg-white hover:bg-[#ede0d0] text-[#5c4e42] border border-[#decbb8]"
                            }`}
                          >
                            {city}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Area Highlight & Top Specialties */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Spotlight Banner based on selection */}
            <div className="bg-[#fcf8f0] rounded-3xl p-8 border border-[#e4d3bc] shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebdcc8]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#a8422b]">
                    {selectedRegion ? `正在瀏覽：${selectedRegion}地區` : "全台巡禮・62家機構總覽"}
                  </span>
                  <h3 className="text-2xl font-bold text-[#2a231e] font-serif mt-1">
                    {selectedCity
                      ? `${selectedCity} 身障機構與庇護工坊`
                      : selectedRegion
                      ? `${selectedRegion}地區 精選在地良品`
                      : "跨越台灣 22 縣市的職人堅持"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="#directory"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>查看機構列表</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Quick Regional Showcase Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-white/80 border border-[#ebdcc8]">
                  <div className="text-xs font-bold text-[#854d0e] mb-1">🍰 明星烘焙與甜點</div>
                  <p className="text-xs text-[#5f5145] leading-relaxed">
                    新北唐氏症愛不囉嗦餅乾、喜憨兒法式西點、台北糕菲頂級蛋捲、桃園觀音重乳酪蛋糕、台南鴻佳夏威夷豆塔、高雄百年中外棋餅。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-[#ebdcc8]">
                  <div className="text-xs font-bold text-[#22483d] mb-1">🥟 在地食材與美味料理</div>
                  <p className="text-xs text-[#5f5145] leading-relaxed">
                    彰化二林喜樂手工水餃（團購冠軍）、台南後壁蓮心園越光米、花蓮黎明七星潭檸檬薄餅、台東牧心紅藜洛神酥、屏東大武山伯大尼鮮乳。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-[#ebdcc8]">
                  <div className="text-xs font-bold text-[#1e40af] mb-1">🧼 洗沐保養與天然手作</div>
                  <p className="text-xs text-[#5f5145] leading-relaxed">
                    育成天然草本手工皂、高雄一家工場日光皂、屏東伊甸羊奶左手香皂（45天熟成）、台中信望愛冷壓橄欖皂、高雄三山脊損手工真皮件。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 border border-[#ebdcc8]">
                  <div className="text-xs font-bold text-[#9d174d] mb-1">☕ 精品咖啡與原創文創</div>
                  <p className="text-xs text-[#5f5145] leading-relaxed">
                    台中瑪利亞 MerryYoung 快樂襪（身障青年畫作時尚化）、更生少年未來咖啡 SCA 國際認證手沖、失親兒原創手繪文創。
                  </p>
                </div>
              </div>

              {/* Callout box */}
              <div className="mt-6 p-4 rounded-2xl bg-[#e8f1ec] border border-[#cbe0d5] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#22483d] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ESG
                </div>
                <div className="text-xs text-[#204237]">
                  <span className="font-bold">企業 ESG 採購指南：</span>
                  全台 62 家機構皆具備正式開立收據或發票之資格，支持身心障礙者就業自立，可列入企業綠色公益與永續採購指標。
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
