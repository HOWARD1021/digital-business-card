"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Sparkles, TrendingUp, Clock, Copy, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';

interface PromptItem {
  id: number;
  prompt: string;
  description: string | null;
  image_id: number | null;
  image_url: string | null;
  category: string;
  favorite_count: number;
  use_count: number;
  is_favorited: boolean;
  created_at: string;
}

export default function PromptGalleryPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'most_used'>('popular');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // 加載 prompts
  const loadPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiClient.getPrompts({
        sort: sortBy,
        limit: 50,
      });
      setPrompts(result.prompts);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  // 收藏/取消收藏
  const handleToggleFavorite = async (id: number) => {
    try {
      const result = await apiClient.togglePromptFavorite(id);

      // 更新本地狀態
      setPrompts(prevPrompts =>
        prevPrompts.map(p =>
          p.id === id
            ? {
                ...p,
                is_favorited: result.is_favorited,
                favorite_count: result.is_favorited
                  ? p.favorite_count + 1
                  : p.favorite_count - 1,
              }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert('收藏失敗');
    }
  };

  // 使用 Prompt
  const handleUsePrompt = async (prompt: PromptItem) => {
    try {
      // 記錄使用次數
      await apiClient.recordPromptUse(prompt.id);

      // 跳轉到 I2I 轉換頁面，將 prompt 作為 URL 參數傳遞
      router.push(`/transform?prompt=${encodeURIComponent(prompt.prompt)}`);
    } catch (error) {
      console.error('Failed to use prompt:', error);
    }
  };

  // 複製 Prompt
  const handleCopyPrompt = async (prompt: PromptItem) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Prompt Gallery
                </h1>
                <p className="text-gray-400 text-sm">瀏覽並使用優秀的 AI Prompts</p>
              </div>
            </div>

            {/* 統計信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>總計: {prompts.length} 個 Prompts</span>
            </div>
          </div>

          {/* 排序選項 */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                sortBy === 'popular'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              最受歡迎
            </button>
            <button
              onClick={() => setSortBy('most_used')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                sortBy === 'most_used'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              最常使用
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                sortBy === 'recent'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              最新添加
            </button>
          </div>
        </div>

        {/* Prompts 網格 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400">載入中...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors group"
              >
                {/* 圖片預覽 */}
                {prompt.image_url ? (
                  <div className="aspect-square bg-gray-700 relative">
                    <img
                      src={prompt.image_url}
                      alt="Generated"
                      className="w-full h-full object-cover"
                    />
                    {/* 收藏按鈕覆蓋層 */}
                    <button
                      onClick={() => handleToggleFavorite(prompt.id)}
                      className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          prompt.is_favorited
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center relative">
                    <Sparkles className="w-12 h-12 text-gray-600" />
                    {/* 收藏按鈕 */}
                    <button
                      onClick={() => handleToggleFavorite(prompt.id)}
                      className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          prompt.is_favorited
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Prompt 內容 */}
                <div className="p-4">
                  {/* Prompt 文字 */}
                  <div className="text-sm text-gray-300 mb-3 line-clamp-3 h-[60px]">
                    {prompt.prompt}
                  </div>

                  {/* 描述 */}
                  {prompt.description && (
                    <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {prompt.description}
                    </div>
                  )}

                  {/* 統計信息 */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {prompt.favorite_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {prompt.use_count} 次使用
                    </span>
                  </div>

                  {/* 操作按鈕 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUsePrompt(prompt)}
                      className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm transition-colors font-medium"
                    >
                      {copiedId === prompt.id ? '已複製！' : '使用此 Prompt'}
                    </button>
                    <button
                      onClick={() => handleCopyPrompt(prompt)}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                      title="複製 Prompt"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 空狀態 */}
        {!loading && prompts.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg text-gray-400 mb-2">還沒有 Prompts</h3>
            <p className="text-gray-500 mb-4">開始創建您的第一個 Prompt！</p>
          </div>
        )}
      </div>
    </div>
  );
}
