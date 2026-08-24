"use client";

import React, { useEffect } from "react";
import { X, Globe, Phone, MapPin, Heart, Sparkles, ExternalLink, Gift, ShieldCheck } from "lucide-react";

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
  brandTitle?: string;
  logoText?: string;
  logoTheme?: string;
  brandTag?: string;
  productTag?: string;
  image?: string;
  imageSource?: string;
}

interface OrganizationModalProps {
  org: Organization | null;
  onClose: () => void;
}

export default function OrganizationModal({ org, onClose }: OrganizationModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (org) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [org]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!org) return null;

  const displayBrand = org.brandTitle || org.shortName || org.name;
  const brandTag = org.brandTag || org.heroCategory || org.category;
  const productTag = org.productTag || org.badges?.[0] || "中秋愛心推薦";

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-[#1a1613]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container: Bottom sheet on mobile, rounded card on desktop */}
      <div
        className="relative w-full max-w-2xl bg-[#fdfaf3] rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border-2 border-[#decbb8] overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================================= */}
        {/* === 1. TOP HEADER: Artisanal Deep Forest Green ========================= */}
        {/* ========================================================================= */}
        <div className="bg-[#1e3d30] bg-gradient-to-r from-[#173327] via-[#1e3d30] to-[#254b3c] text-[#fbf7ee] p-5 sm:p-7 relative shrink-0 border-b border-[#305948]">
          
          {/* Subtle Paper Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: '12px 12px'
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/25 hover:bg-black/45 active:scale-95 text-white/90 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label="關閉介紹"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Mobile Handle Indicator for Bottom Sheet */}
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/30 mx-auto -mt-1 mb-3" />

          {/* Badges & Meta Row */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pr-8 sm:pr-10 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f3b953] text-[#221e1a] text-[11px] sm:text-xs font-black shadow-xs font-mono">
              #{org.id}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[#fbf7ee] text-[11px] sm:text-xs font-bold border border-white/10">
              <MapPin className="w-3 h-3 text-[#f3b953]" />
              {org.region}・{org.city}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f2e9]/20 text-[#c8eed0] text-[11px] sm:text-xs font-bold border border-emerald-400/20">
              <ShieldCheck className="w-3 h-3 text-[#c8eed0]" />
              已驗證機構
            </span>
          </div>

          {/* Main Titles */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif tracking-tight text-white leading-tight">
              {displayBrand}
            </h2>
            {org.name !== displayBrand && (
              <p className="text-emerald-200/90 text-xs sm:text-sm font-medium font-serif leading-snug">
                法人全稱：{org.name}
              </p>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* === 2. SCROLLABLE CONTENT BODY ========================================== */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 font-serif text-[#29231e]">
          
          {/* Target Group & Category Tags */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#ebdcc8] shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8c461e]">
              <Heart className="w-3.5 h-3.5 text-[#a83d2a] fill-[#a83d2a]" />
              <span>服務對象族群</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#2d251f] leading-relaxed">
              {org.targetGroup}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 font-sans">
              <span className="px-2 py-0.5 rounded-md bg-[#f7efe3] text-[#73431a] text-[11px] font-bold">
                🏷️ {brandTag}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#f7efe3] text-[#73431a] text-[11px] font-bold">
                🎁 {productTag}
              </span>
              {org.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-[#f2e6d6] text-[#6b4724] text-[11px] font-semibold"
                >
                  #{b}
                </span>
              ))}
            </div>
          </div>

          {/* Story & Craftsmanship Background */}
          <div className="space-y-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#26201a] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              <span>機構故事與職人精神</span>
            </h3>
            <div className="text-xs sm:text-sm text-[#4e4136] leading-relaxed bg-[#f8f1e5] p-3.5 sm:p-4 rounded-2xl border border-[#ebdcc8]">
              {org.story}
            </div>
          </div>

          {/* Featured Products */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#26201a] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#a83d2a]" />
              <span>中秋主力推薦商品與手作代表作</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {org.featuredProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#e8dac8] shadow-2xs space-y-1 hover:border-[#caa47e] transition-colors"
                >
                  <div className="font-bold text-xs sm:text-sm text-[#a83d2a] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a83d2a] shrink-0" />
                    <span>{prod.name}</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#635549] leading-relaxed pl-2.5">
                    {prod.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Location Info */}
          <div className="p-3.5 rounded-2xl bg-white/70 border border-[#eddccb] space-y-2 text-xs">
            <div className="flex items-start gap-2 text-[#4e4136]">
              <MapPin className="w-3.5 h-3.5 text-[#a83d2a] shrink-0 mt-0.5" />
              <span className="break-words">
                <strong className="text-[#2b241e]">機構地址：</strong>
                {org.address}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#4e4136]">
              <Phone className="w-3.5 h-3.5 text-[#254b3c] shrink-0" />
              <span>
                <strong className="text-[#2b241e]">訂購諮詢專線：</strong>
                <a 
                  href={`tel:${org.phone.replace(/[^0-9]/g, "")}`}
                  className="text-[#1e3d30] font-bold hover:underline"
                >
                  {org.phone}
                </a>
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* === 3. STICKY FOOTER ACTIONS ============================================ */}
        {/* ========================================================================= */}
        <div className="bg-[#f5ebdd] px-4 sm:px-6 py-3 sm:py-4 border-t border-[#e2d0bc] shrink-0 font-serif">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
            <div className="hidden sm:block text-xs text-[#705e50]">
              🌕 支持身心障礙職人，讓今年中秋更圓滿溫暖。
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Call Phone Button */}
              <a
                href={`tel:${org.phone.replace(/[^0-9]/g, "")}`}
                className="flex-1 sm:flex-initial sm:min-w-[130px] px-3.5 py-2.5 rounded-xl bg-[#23463a] hover:bg-[#1a382e] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>撥打專線</span>
              </a>

              {/* Official Website Button */}
              {org.website ? (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial sm:min-w-[150px] px-3.5 py-2.5 rounded-xl bg-[#a83d2a] hover:bg-[#8f3423] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>造訪官網</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                </a>
              ) : (
                <div className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#e5d4c0] text-[#705e50] text-xs font-bold text-center">
                  官方電話訂購
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
