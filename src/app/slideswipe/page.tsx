"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "../../lib/api-client";
import { ArrowLeft } from "lucide-react";

interface Item {
  id: number;
  original: string;
  styled: string;
  styleName: string;
}

// Grug 說：24種風格太多了，簡化到 8 種核心風格
const CORE_STYLES = [
  "吉卜力工作室風格",
  "海賊王 One Piece",
  "鬼滅之刃 Demon Slayer", 
  "美少女戰士 Sailor Moon",
  "七龍珠 Dragon Ball",
  "新世紀福音戰士",
  "Disney 經典風格",
  "Rick and Morty"
];

export default function SlideswipePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageId = searchParams?.get("imageId");

  const [items, setItems] = useState<Item[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  // Grug 說：簡化圖片加載邏輯
  useEffect(() => {
    const loadImages = async () => {
      try {
        let originalUrl = "/slides/original.png";
        let styledImages: Item[] = [];

        if (imageId) {
          // 使用指定圖片
          const imageData = await apiClient.getImage(parseInt(imageId));
          originalUrl = apiClient.getImageDownloadUrl(parseInt(imageId));
        } else {
          // 使用首頁圖 (Category 1)
          const homeImages = await apiClient.getImages({ category: 1, limit: 1 });
          if (homeImages.images.length > 0) {
            originalUrl = apiClient.getImageDownloadUrl(homeImages.images[0].id);
          }
        }

        // 獲取風格圖 (Category 2)
        const styleImages = await apiClient.getImages({ category: 2, limit: 8 });
        
        if (styleImages.images.length > 0) {
          styledImages = styleImages.images.map((img, idx) => ({
            id: img.id,
            original: originalUrl,
            styled: apiClient.getImageDownloadUrl(img.id),
            styleName: CORE_STYLES[idx] || `風格 ${idx + 1}`
          }));
        } else {
          // Fallback 到預設圖片
          styledImages = Array.from({ length: 8 }).map((_, idx) => ({
            id: idx + 1,
            original: originalUrl,
            styled: `/slides/styled/${idx + 1}.png`,
            styleName: CORE_STYLES[idx]
          }));
        }

        setItems(styledImages);
        setRevealed(new Array(styledImages.length).fill(false));
      } catch (error) {
        console.error('Failed to load images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [imageId]);

  // Grug 說：簡化動畫邏輯
  const startAnimation = () => {
    setRevealed(new Array(items.length).fill(false));
    
    items.forEach((_, index) => {
      setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, index * 800);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Grug 頂部工具欄：簡單直接 */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
        
        <h1 className="text-lg font-bold">風格轉換</h1>
        
        <button
          onClick={startAnimation}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          開始
        </button>
      </div>

      {/* Grug 網格：統一整齊的 2x4 布局 */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <SwipeCell
              key={item.id}
              item={item}
              revealed={revealed[index]}
              index={index}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

// Grug 說：簡化組件，只保留核心功能
interface SwipeCellProps {
  item: Item;
  revealed: boolean;
  index: number;
}

function SwipeCell({ item, revealed, index }: SwipeCellProps) {
  return (
    <div className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
      
      {/* 背景圖（風格化後） */}
      <Image
        src={item.styled}
        alt="Styled"
        fill
        className="object-contain"
        unoptimized
      />

      {/* 滑動遮罩（原圖） */}
      <div
        className="absolute inset-0 transition-all duration-1200 ease-out"
        style={{
          clipPath: revealed
            ? "polygon(0 0, 0 0, 0 100%, 0 100%)"
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
        }}
      >
        <Image
          src={item.original}
          alt="Original"
          fill
          className="object-contain bg-black/20"
          unoptimized
        />
      </div>

      {/* Grug 標籤：簡單清楚 */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-sm font-medium text-white">
            {item.styleName}
          </div>
        </div>
      </div>

    </div>
  );
}