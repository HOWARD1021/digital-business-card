"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import organizationsData from "../data/organizations.json";
import OrganizationModal, { Organization } from "./OrganizationModal";
import { Search, MapPin, ShieldCheck, ChevronDown, RefreshCw, Gift } from "lucide-react";

const featureFilters = [
  { label: "食品與飲品", keywords: ["烘焙", "糕點", "餅", "食品", "飲品", "咖啡", "茶", "水餃", "饅頭", "包子", "米", "果乾", "餐飲", "伴手禮"] },
  { label: "農產與園藝", keywords: ["農產", "農場", "農耕", "園藝", "植栽", "生鮮", "小農", "農業"] },
  { label: "生活用品", keywords: ["手工皂", "清潔", "洗沐", "香氛", "生活用品", "生活良品"] },
  { label: "工藝與文創", keywords: ["工藝", "文創", "陶藝", "織品", "木藝", "木作", "手作", "藝術"] },
  { label: "代工與企業合作", keywords: ["代工", "包裝", "企業", "ESG", "採購"] },
] as const;

const featureText = (org: Organization & { brandTag?: string; productTag?: string }) =>
  [org.category, org.heroCategory, org.brandTag, org.productTag, org.story, ...org.badges].filter(Boolean).join(" ");

interface OrganizationExplorerProps {
  selectedRegion: string;
  selectedCity: string;
  selectedCategory: string;
  onSelectRegion: (region: string) => void;
  onSelectCity: (city: string) => void;
  onSelectCategory: (category: string) => void;
}

export default function OrganizationExplorer({
  selectedRegion,
  selectedCity,
  selectedCategory,
  onSelectRegion,
  onSelectCity,
  onSelectCategory,
}: OrganizationExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "hot" | "city">("default");
  const [activeModalOrg, setActiveModalOrg] = useState<Organization | null>(null);

  const orgs = organizationsData as (Organization & {
    brandTitle?: string;
    logoText?: string;
    logoTheme?: string;
    brandTag?: string;
    productTag?: string;
    image?: string;
    verified?: boolean;
  })[];

  const regions = ["全部", "北部", "中部", "南部", "東部", "離島"];

  const filteredOrgs = useMemo(() => {
    let result = orgs.filter((org) => {
      // Region filter
      if (selectedRegion && selectedRegion !== "全部" && org.region !== selectedRegion) {
        return false;
      }
      // City filter
      if (selectedCity && !org.city.includes(selectedCity)) {
        return false;
      }
      // Category filter
      if (selectedCategory && selectedCategory !== "全部") {
        const featureFilter = featureFilters.find(({ label }) => label === selectedCategory);
        const matchesCategory = featureFilter
          ? featureFilter.keywords.some((keyword) => featureText(org).includes(keyword))
          : org.category.includes(selectedCategory) ||
            org.heroCategory.includes(selectedCategory) ||
            (org.brandTag && org.brandTag.includes(selectedCategory));
        if (!matchesCategory) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = org.name.toLowerCase().includes(q);
        const inShort = org.shortName.toLowerCase().includes(q);
        const inBrand = org.brandTitle?.toLowerCase().includes(q);
        const inCity = org.city.toLowerCase().includes(q);
        const inDistrict = org.district?.toLowerCase().includes(q);
        const inStory = org.story.toLowerCase().includes(q);
        const inTarget = org.targetGroup.toLowerCase().includes(q);
        const inCategory = org.category.toLowerCase().includes(q);
        const inProducts = org.featuredProducts.some(
          (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
        );
        const inProductTag = org.productTag?.toLowerCase().includes(q);

        if (
          !inName &&
          !inShort &&
          !inBrand &&
          !inCity &&
          !inDistrict &&
          !inStory &&
          !inTarget &&
          !inCategory &&
          !inProducts &&
          !inProductTag
        ) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === "city") {
      result = [...result].sort((a, b) => a.city.localeCompare(b.city, "zh-Hant"));
    } else if (sortBy === "hot") {
      result = [...result].sort((a, b) => b.badges.length - a.badges.length);
    }

    return result;
  }, [orgs, selectedRegion, selectedCity, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    onSelectRegion("");
    onSelectCity("");
    onSelectCategory("");
    setSortBy("default");
  };

  // Helper for Circular Brand Seal Logo Background & Styling
  const renderBrandLogo = (org: typeof orgs[0]) => {
    const theme = org.logoTheme || "green";
    const text = org.logoText || org.brandTitle?.slice(0, 2) || "台灣";
    const lines = text.split("\n");

    let bgClass = "bg-[#1b392b] text-white border-[#2e5443]";
    if (theme === "beige") {
      bgClass = "bg-[#f7efe3] text-[#3d2e20] border-[#e4d4be]";
    } else if (theme === "terra") {
      bgClass = "bg-[#9e3524] text-white border-[#b54532]";
    } else if (theme === "navy" || theme === "slate") {
      bgClass = "bg-[#1f3f4e] text-white border-[#345c6e]";
    } else if (theme === "ochre") {
      bgClass = "bg-[#d49132] text-white border-[#e0a653]";
    }

    return (
      <div
        className={`w-18 h-18 sm:w-22 sm:h-22 rounded-full ${bgClass} border-2 flex flex-col items-center justify-center p-2 text-center shadow-xs shrink-0 font-serif select-none`}
      >
        {/* Subtle house/craft roof icon for first theme */}
        {theme === "green" && (
          <div className="w-4 h-1 border-t-2 border-white/60 mb-0.5 -mt-1" />
        )}
        <div className="font-bold text-xs sm:text-sm tracking-widest leading-tight whitespace-pre-line">
          {lines[0]}
        </div>
        {lines[1] && (
          <div className="text-[10px] sm:text-[11px] tracking-wider opacity-90 mt-0.5 font-sans">
            {lines[1]}
          </div>
        )}
        {theme === "beige" && (
          <div className="w-2 h-2 rounded-full bg-[#9e3524] mt-1 opacity-90" />
        )}
      </div>
    );
  };

  return (
    <section id="directory" className="py-14 sm:py-18 bg-[#f6f0e4] border-b border-[#e2d2be]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Title matching design image */}
        <div className="text-left mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fae5c3] text-[#804719] text-xs font-bold font-serif mb-1">
            <Gift className="w-3.5 h-3.5 text-[#9e3524]" />
            <span>2026 全台中秋愛心機構・手作禮盒推薦</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#22201e] font-serif tracking-tight">
            找到真正的台灣製造
          </h2>
        </div>

        {/* 2. Search Input Bar matching design image */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-[#7d6f62]">
            <Search className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋品牌、產品或地區（如：蛋黃酥、鳳梨酥、水餃、手工皂）"
            className="w-full pl-12 sm:pl-13 pr-12 py-3.5 sm:py-4 rounded-full bg-white border border-[#dfceba] focus:border-[#1b392b] focus:outline-none text-[#28221c] placeholder-[#948474] text-sm sm:text-base font-serif shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-xs font-bold text-[#8c7b6d] hover:text-[#22201e] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* 3. Region Filter Pill Buttons matching design image */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          {regions.map((reg) => {
            const isActive = (selectedRegion === "" && reg === "全部") || selectedRegion === reg;
            return (
              <button
                key={reg}
                onClick={() => {
                  onSelectRegion(reg === "全部" ? "" : reg);
                  onSelectCity("");
                }}
                className={`px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold font-serif transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1b392b] text-white shadow-xs"
                    : "bg-[#eee4d6] hover:bg-[#e4d8c7] text-[#3d3228]"
                }`}
              >
                {reg}
              </button>
            );
          })}

          <div className="w-full flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-[#695d52] font-serif mr-1">特色商品／服務</span>
            {featureFilters.map(({ label }) => {
              const isActive = selectedCategory === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onSelectCategory(isActive ? "" : label)}
                  aria-pressed={isActive}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-serif transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#9e3524] border-[#9e3524] text-white shadow-xs"
                      : "bg-white/70 border-[#dfceba] hover:bg-[#eee4d6] text-[#3d3228]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {(selectedRegion || selectedCity || selectedCategory || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-[#9e3524] hover:underline font-bold font-serif flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>重設</span>
            </button>
          )}
        </div>

        {/* 4. Results Count & Sort Dropdown Row matching design image */}
        <div className="flex items-center justify-between mb-4 px-1 font-serif text-sm">
          <div className="text-[#332b24] font-bold">
            共 <span className="text-[#1b392b] text-base font-black">{filteredOrgs.length}</span> 個愛心品牌
          </div>

          {/* Sort Selector */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "default" | "hot" | "city")}
              className="appearance-none bg-transparent pr-6 py-1 text-xs sm:text-sm font-bold text-[#332b24] cursor-pointer focus:outline-none font-serif"
            >
              <option value="default">最新上架</option>
              <option value="hot">推薦排序</option>
              <option value="city">依縣市排序</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#5c5044] absolute right-0 pointer-events-none" />
          </div>
        </div>

        {/* 5. Brand Cards List matching exact 3-column layout */}
        {filteredOrgs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#e6dbc9] p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f6eee2] text-[#9e3524] mx-auto flex items-center justify-center text-2xl font-bold">
              🔍
            </div>
            <h3 className="text-lg font-bold text-[#28221c] font-serif">
              找不到與「{searchQuery}」相關的中秋愛心品牌
            </h3>
            <p className="text-xs sm:text-sm text-[#736558] font-serif">
              建議嘗試更換地區或縮短搜尋關鍵字（如：蛋黃酥、餅乾、水餃）。
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#1b392b] text-white text-xs font-bold hover:bg-[#12281e] cursor-pointer font-serif"
            >
              查看全部 62 個愛心品牌
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrgs.map((org) => {
              const displayBrand = org.brandTitle || org.shortName;
              const brandTag = org.brandTag || org.heroCategory || "在地風味";
              const productTag = org.productTag || org.featuredProducts[0]?.name || "中秋禮盒";
              const imageSrc = org.image || "/images/cat-flavors.png";

              return (
                <div
                  key={org.id}
                  onClick={() => setActiveModalOrg(org)}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ede4d5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 cursor-pointer group"
                >
                  
                  {/* Left Column: Brand Logo Seal */}
                  <div className="shrink-0 flex items-center justify-center">
                    {renderBrandLogo(org)}
                  </div>

                  {/* Middle Column: Brand Details & Story & Location */}
                  <div className="flex-1 min-w-0 space-y-2 text-left font-serif">
                    {/* Title + Verified Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#22201e] group-hover:text-[#9e3524] transition-colors">
                        {displayBrand}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e8f2e9] text-[#22483d] text-[11px] font-bold border border-[#cfe1d2]">
                        <ShieldCheck className="w-3 h-3 text-[#22483d]" />
                        <span>已驗證</span>
                      </span>
                    </div>

                    {/* Category & Product Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 font-sans">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#f7efe3] text-[#6e543c] text-xs font-semibold">
                        {brandTag}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#f7efe3] text-[#6e543c] text-xs font-semibold">
                        {productTag}
                      </span>
                    </div>

                    {/* 2-line Story description */}
                    <p className="text-xs sm:text-sm text-[#5f5247] leading-relaxed line-clamp-2">
                      {org.story}
                    </p>

                    {/* Location Pin */}
                    <div className="flex items-center gap-1 text-xs text-[#786a5e] pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#9e3524] shrink-0" />
                      <span>{org.city} {org.district || ""}</span>
                    </div>
                  </div>

                  {/* Right Column: Product Photo & '查看品牌' Button */}
                  <div className="w-full sm:w-auto shrink-0 flex flex-col items-center sm:items-end justify-between self-stretch sm:self-auto gap-3">
                    {/* Product Photo Thumbnail */}
                    <div className="relative w-full sm:w-44 h-28 sm:h-24 rounded-2xl overflow-hidden border border-[#eadfd2] bg-[#f8f2e8]">
                      <Image
                        src={imageSrc}
                        alt={displayBrand}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Dark Green Pill Button matching design image */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalOrg(org);
                      }}
                      className="w-full sm:w-44 py-2 px-4 rounded-full bg-[#1b392b] group-hover:bg-[#12281e] text-white text-xs sm:text-sm font-bold font-serif shadow-2xs transition-colors flex items-center justify-center cursor-pointer"
                    >
                      查看品牌
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal Detail View */}
      <OrganizationModal
        org={activeModalOrg}
        onClose={() => setActiveModalOrg(null)}
      />
    </section>
  );
}
