"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import CategoryCards from "../components/CategoryCards";
import OrganizationExplorer from "../components/OrganizationExplorer";
import SideBySideCards from "../components/SideBySideCards";
import BottomBanner from "../components/BottomBanner";
import Footer from "../components/Footer";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const scrollToDirectory = () => {
    const el = document.getElementById("directory");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region);
    setSelectedCity("");
    scrollToDirectory();
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    scrollToDirectory();
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    scrollToDirectory();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f0e4]">
      {/* 1. Top Header matching design */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section with Calligraphy, Slogan & Artistic Taiwan Map */}
        <HeroSection onExplore={scrollToDirectory} />

        {/* 3. Stats / Trust Bar (100% 台灣製造 | 62個在地機構 | 全台安心配送) */}
        <StatsBar />

        {/* 4. Section 1: 來自台灣的日常風景 (日常器物 | 在地風味 | 島嶼織品) */}
        <CategoryCards onSelectCategory={handleSelectCategory} />

        {/* 5. 品牌夥伴・62 家機構手作良品檢索與圖文全覽 (已移至上方) */}
        <OrganizationExplorer
          selectedRegion={selectedRegion}
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          onSelectRegion={handleSelectRegion}
          onSelectCity={handleSelectCity}
          onSelectCategory={handleSelectCategory}
        />

        {/* 6. Section 2: Side-by-Side Cards (與在地職人同行 | 安心溯源・看得見的堅持) */}
        <SideBySideCards
          onExplorePartners={scrollToDirectory}
          onExploreTraceability={scrollToAbout}
        />

        {/* 7. Section 3: Bottom Dark Green Banner (把台灣的好，帶進生活裡) */}
        <BottomBanner onExplore={scrollToDirectory} />
      </main>

      {/* 8. Footer matching design */}
      <Footer />
    </div>
  );
}
