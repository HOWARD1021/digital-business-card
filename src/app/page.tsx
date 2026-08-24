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
        {/* 1. Hero Section with Calligraphy, Slogan & Artistic Taiwan Map */}
        <HeroSection onExplore={scrollToDirectory} />

        {/* 2. Stats / Trust Bar (100% 台灣在地手作 | 62家愛心機構 | 全台安心配送) */}
        <StatsBar />

        {/* 3. Section 1: 全台 62 家愛心機構導覽名錄 */}
        <OrganizationExplorer
          selectedRegion={selectedRegion}
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          onSelectRegion={handleSelectRegion}
          onSelectCity={handleSelectCity}
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. Section 2: 來自台灣的中秋心意風景 (台灣烘焙與禮盒 | 在地風味與茶點 | 日常洗沐與器物) */}
        <CategoryCards onSelectCategory={handleSelectCategory} />

        {/* 5. Section 3: Side-by-Side Cards (與在地職人同行 | 安心溯源・看得見的堅持) */}
        <SideBySideCards
          onExplorePartners={scrollToDirectory}
        />

        {/* 6. Section 4: Bottom Dark Green Banner (把台灣的中秋溫暖，帶進家家戶戶) */}
        <BottomBanner onExplore={scrollToDirectory} />
      </main>

      {/* 8. Footer matching design */}
      <Footer />
    </div>
  );
}
