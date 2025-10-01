"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { ArrowLeft, Play, Pause } from 'lucide-react';

interface ShortsItem {
  id: number;
  url: string;
  styleName: string;
  isOriginal?: boolean;
  animeStyle?: string; // 動漫風格名稱
  animeIcon?: string;  // 動漫風格圖標
}

// 動漫風格對應的圖標/標識
const ANIME_STYLE_MAP: Record<string, { icon: string; name: string }> = {
  "風格 1": { icon: "🧙‍♀️", name: "吉卜力" },
  "風格 2": { icon: "🏴‍☠️", name: "海賊王" },
  "風格 3": { icon: "⚔️", name: "鬼滅之刃" },
  "風格 4": { icon: "🌙", name: "美少女戰士" },
  "風格 5": { icon: "🐉", name: "七龍珠" },
  "風格 6": { icon: "🤖", name: "福音戰士" },
  "風格 7": { icon: "👸", name: "Disney" },
  "風格 8": { icon: "🧪", name: "Rick&Morty" },
};

export default function ShortsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const imageId = searchParams?.get('imageId');

  const [items, setItems] = useState<ShortsItem[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');

  // 動畫參數
  const STEP_DELAY = 800;
  const REVEAL_DURATION = 1200;

  // 加載 Shorts 數據
  useEffect(() => {
    const loadShortsData = async () => {
      try {
        let originalUrl = "/slides/original.png";
        const shortsItems: ShortsItem[] = [];

        if (imageId) {
          // 使用指定圖片作為原圖
          originalUrl = apiClient.getImageDownloadUrl(parseInt(imageId));
        } else {
          // 使用首頁圖
          const homeImages = await apiClient.getImages({ category: 1, limit: 1 });
          if (homeImages.images.length > 0) {
            originalUrl = apiClient.getImageDownloadUrl(homeImages.images[0].id);
          }
        }

        setOriginalImageUrl(originalUrl);

        // 添加原圖到第一個位置
        shortsItems.push({
          id: 0,
          url: originalUrl,
          styleName: "原圖",
          isOriginal: true,
          animeStyle: "原圖",
          animeIcon: "🖤"
        });

        // 獲取風格圖
        const styleImages = await apiClient.getImages({ category: 2, limit: 7 });
        styleImages.images.forEach((img, idx) => {
          const styleName = `風格 ${idx + 1}`;
          const animeInfo = ANIME_STYLE_MAP[styleName] || { icon: "🎨", name: `風格${idx + 1}` };
          
          shortsItems.push({
            id: img.id,
            url: apiClient.getImageDownloadUrl(img.id),
            styleName: styleName,
            isOriginal: false,
            animeStyle: animeInfo.name,
            animeIcon: animeInfo.icon
          });
        });

        setItems(shortsItems);
        // 初始狀態：所有格子都顯示原圖（未轉換）
        setRevealed(new Array(shortsItems.length).fill(false));
      } catch (error) {
        console.error('Failed to load shorts data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShortsData();
  }, [imageId]);

  // 開始動畫 - 邏輯修正：初始全原圖，轉換後顯示動漫風格
  const startAnimation = () => {
    setIsPlaying(true);
    // 重置：所有格子都顯示原圖
    setRevealed(new Array(items.length).fill(false));
    
    // 逐個轉換：每張圖片從原圖轉換為動漫風格
    items.forEach((_, index) => {
      setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev];
          next[index] = true; // true = 顯示動漫風格，false = 顯示原圖
          return next;
        });
      }, index * STEP_DELAY);
    });

    // 動畫結束後停止
    setTimeout(() => {
      setIsPlaying(false);
    }, items.length * STEP_DELAY + 1000);
  };

  // 重置動畫 - 回到初始狀態：所有格子都顯示原圖
  const resetAnimation = () => {
    setIsPlaying(false);
    setRevealed(new Array(items.length).fill(false)); // 全部顯示原圖
  };

  // 鍵盤控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          resetAnimation();
        } else {
          startAnimation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, items.length]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">載入中...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-xl mb-4">沒有圖片</div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const gridSize = items.length;
  
  // 根據圖片數量決定網格布局 - 優化版，讓圖片更大更清晰
  const getGridLayout = () => {
    if (gridSize <= 4) {
      return { rows: 2, cols: 2 }; // 2x2 每張圖佔 1/4
    } else if (gridSize <= 6) {
      return { rows: 2, cols: 3 }; // 2x3 每張圖佔 1/6，讓圖片更大
    } else {
      return { rows: 3, cols: 3 }; // 3x3 每張圖佔 1/9，最大化圖片尺寸
    }
  };

  const { rows, cols } = getGridLayout();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* 背景粒子效果 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
      </div>

      {/* 左上角返回按鈕 */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-md hover:bg-black/90 rounded-xl transition-all duration-300 text-white border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
      </div>

      {/* 右側控制區域 */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        
        {/* 開始/重置按鈕 */}
        <button
          onClick={isPlaying ? resetAnimation : startAnimation}
          className={`flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-xl transition-all duration-300 text-white border hover:shadow-lg ${
            isPlaying
              ? 'bg-red-500/80 hover:bg-red-500/90 border-red-400/50 hover:shadow-red-500/20'
              : 'bg-green-500/80 hover:bg-green-500/90 border-green-400/50 hover:shadow-green-500/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              重置
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              開始動畫
            </>
          )}
        </button>

        {/* 功能提示 */}
        <div className="bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl text-white text-xs border border-white/10">
          <div className="text-center mb-2 font-semibold">快捷鍵</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">空白鍵</span>
              <span className="text-blue-400">開始/重置</span>
            </div>
          </div>
        </div>

        {/* 當前狀態指示器 */}
        <div className="bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl text-white text-xs border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-500'}`}></div>
            <div>
              <div className="font-semibold">{isPlaying ? '🎬 動畫播放中' : '⏸️ 待機中'}</div>
              <div className="text-gray-400 text-xs">{isPlaying ? '風格轉換進行中...' : '準備開始動畫'}</div>
            </div>
          </div>
        </div>

        {/* 畫面比例提示 */}
        <div className="bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl text-white text-xs text-center border border-white/10">
          <div className="mb-1">
            <span className="text-lg font-bold text-blue-400">
              {gridSize <= 4 ? '1/4' : gridSize <= 6 ? '1/6' : '1/9'}
            </span>
          </div>
          <div className="text-gray-300">畫面比例</div>
          <div className="text-xs text-gray-400 mt-1">{rows}×{cols} 網格</div>
        </div>

      </div>

      {/* 主要內容區域 - 1080x1920 比例 */}
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          style={{
            width: '100%',
            maxWidth: '1080px',
            aspectRatio: '9/16', // 1080x1920
            height: 'auto',
            maxHeight: '100vh'
          }}
        >
          
          {/* 網格布局 */}
          <div
            className="absolute inset-0 grid gap-2 p-3"
            style={{
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`
            }}
          >
            {items.map((item, index) => (
              <ShortsCell
                key={item.id}
                item={item}
                originalImageUrl={originalImageUrl}
                revealed={revealed[index]}
                index={index}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

// Shorts 單元格組件 - 邏輯修正：初始顯示原圖，轉換後顯示動漫風格
interface ShortsCellProps {
  item: ShortsItem;
  originalImageUrl: string;
  revealed: boolean;
  index: number;
}

function ShortsCell({ item, originalImageUrl, revealed, index }: ShortsCellProps) {
  return (
    <div className="relative w-full h-full bg-black/20 rounded-xl overflow-hidden group backdrop-blur-sm border border-white/5">
      {/* 內部容器 - 確保圖片適應顯示 */}
      <div className="relative w-full h-full min-h-0">

      {/* 底圖 - 永遠是原圖 */}
      <Image
        src={originalImageUrl}
        alt="原圖背景"
        fill
        className="object-contain bg-black transition-transform duration-700 group-hover:scale-105" // 使用 object-contain 確保完整顯示圖片
        unoptimized
      />

      {/* 動漫風格圖遮罩 - 邏輯修正：
          revealed = false: 顯示原圖（動漫風格圖被完全隱藏）
          revealed = true:  顯示動漫風格（動漫風格圖從左到右滑動顯現） */}
      <div
        className="absolute inset-0 transition-all ease-out overflow-hidden"
        style={{
          clipPath: revealed
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" // 動畫結束 - 動漫風格圖完全顯示
            : "polygon(0 0, 0 0, 0 100%, 0 100%)", // 初始狀態 - 動漫風格圖完全隱藏，只顯示原圖
          transitionDuration: "1200ms"
        }}
      >
        <Image
          src={item.url}
          alt={item.styleName}
          fill
          className="object-contain bg-black transition-transform duration-700 group-hover:scale-105" // 使用 object-contain 確保完整顯示圖片
          unoptimized
        />
      </div>



      {/* 動漫風格標識 - 右下角小標識，帶懸停效果 */}
      <div className="absolute bottom-3 right-3">
        <div className={`backdrop-blur-md rounded-xl px-3 py-2 flex items-center gap-2 border transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${
          item.isOriginal
            ? 'bg-yellow-500/95 text-black border-yellow-400/50 shadow-yellow-500/20'
            : 'bg-black/80 text-white border-white/20 shadow-black/30'
        }`}>
          <span className="text-lg">{item.animeIcon}</span>
          <span className="text-sm font-semibold">{item.animeStyle}</span>
        </div>
      </div>

      {/* 邊框效果 - 當圖片轉換時顯示 */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-700 pointer-events-none ${
        revealed
          ? 'ring-4 ring-blue-400/80 shadow-2xl shadow-blue-400/30 animate-pulse'
          : 'ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300'
      }`} />
      </div> {/* 關閉內部容器 */}
    </div>
  );
}