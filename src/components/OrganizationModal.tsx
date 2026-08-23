"use client";

import React from "react";
import { X, Globe, Phone, MapPin, Heart, Sparkles, ExternalLink, Gift } from "lucide-react";

export interface Organization {
  id: number;
  name: string;
  shortName: string;
  region: string;
  city: string;
  district?: string;
  address: string;
  phone: string;
  website: string;
  category: string;
  targetGroup: string;
  featuredProducts: Array<{ name: string; desc: string }>;
  story: string;
  badges: string[];
  heroCategory: string;
}

interface OrganizationModalProps {
  org: Organization | null;
  onClose: () => void;
}

export default function OrganizationModal({ org, onClose }: OrganizationModalProps) {
  if (!org) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#fdf9f2] rounded-3xl shadow-2xl border-2 border-[#decbb8] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-[#1c3c2f] via-[#22483d] to-[#3a7564] text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/95 text-[#2b2622] text-xs font-black shadow-xs font-mono">
              機構編號 #{org.id}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              {org.region}・{org.city}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              {org.category}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-wide leading-tight">
            {org.name}
          </h2>
          <p className="text-emerald-100 text-sm font-medium mt-1 font-serif">
            品牌別名 / 庇護工坊：{org.shortName}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto font-serif">
          
          {/* Target Group & Badges */}
          <div className="bg-white/80 p-4 rounded-2xl border border-[#ebdcc8] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#854d0e] uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              服務對象族群：
            </div>
            <p className="text-sm font-bold text-[#3a3028]">
              {org.targetGroup}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {org.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-[#f4e8d8] text-[#73431a] text-xs font-bold"
                >
                  #{b}
                </span>
              ))}
            </div>
          </div>

          {/* Warm Storytelling */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#2a221c] font-serif flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              機構故事與職人精神
            </h3>
            <p className="text-sm text-[#57493e] leading-relaxed bg-[#f8f1e5] p-4 rounded-2xl border border-[#ebdcc8]">
              {org.story}
            </p>
          </div>

          {/* Featured Mid-Autumn Products */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2a221c] font-serif flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#9e3524]" />
              中秋主力推薦商品與代表作
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {org.featuredProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-[#e8dbc9] shadow-2xs space-y-1"
                >
                  <div className="font-bold text-xs sm:text-sm text-[#9e3524]">
                    {prod.name}
                  </div>
                  <div className="text-xs text-[#635549] leading-relaxed">
                    {prod.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Location Info */}
          <div className="space-y-2 pt-2 border-t border-[#ebdcc8]">
            <div className="flex items-start gap-2.5 text-xs text-[#524438]">
              <MapPin className="w-4 h-4 text-[#9e3524] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#2b2520]">機構地址：</strong>
                {org.address}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#524438]">
              <Phone className="w-4 h-4 text-[#22483d] shrink-0" />
              <span>
                <strong className="text-[#2b2520]">中秋訂購與諮詢專線：</strong>
                {org.phone}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#f5ecde] px-6 py-4 border-t border-[#e5d4c0] flex flex-col sm:flex-row items-center justify-between gap-3 font-serif">
          <div className="text-xs text-[#705e50]">
            🌕 支持身心障礙職人，讓今年中秋更圓滿溫暖。
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${org.phone.replace(/[^0-9]/g, "")}`}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#22483d] hover:bg-[#1a3830] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              撥打訂購電話
            </a>

            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#9e3524] hover:bg-[#862c1d] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                造訪官網 / 中秋專頁
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
