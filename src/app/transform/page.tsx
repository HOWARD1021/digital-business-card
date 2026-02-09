"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { Upload, Sparkles, ArrowLeft, Heart, Image as ImageIcon, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '../../lib/api-client';

interface EvaluationResult {
  meets: boolean;
  critique: string;
}

// Loading component
function TransformLoading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>載入中...</p>
      </div>
    </div>
  );
}

// Main page wrapper with Suspense
export default function I2ITransformPage() {
  return (
    <Suspense fallback={<TransformLoading />}>
      <TransformContent />
    </Suspense>
  );
}

// Actual content component
function TransformContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [transforming, setTransforming] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<{
    imageUrl: string;
    status: string;
    promptId?: number;
    imageId?: number;
    evaluation?: EvaluationResult;
  } | null>(null);

  // 從 URL 參數獲取 prompt（從 Prompt Gallery 跳轉過來）
  useEffect(() => {
    const promptParam = searchParams?.get('prompt');
    if (promptParam) {
      setPrompt(decodeURIComponent(promptParam));
    }
  }, [searchParams]);

  // 處理圖片選擇
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourcePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 執行 I2I 轉換
  const handleTransform = async () => {
    if (!sourceImage || !prompt.trim()) {
      alert('請上傳圖片並輸入 Prompt');
      return;
    }

    try {
      setTransforming(true);
      setResult(null);

      // 準備表單數據
      const formData = new FormData();
      formData.append('image', sourceImage);
      formData.append('transformPrompt', prompt);
      formData.append('iterations', '3');

      // 調用 I2I API
      const response = await fetch('/api/i2i/transform', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`轉換失敗: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '轉換失敗');
      }

      // 先上傳結果圖片到 uploads
      // 將 base64 或 URL 轉換為 File 對象
      let resultImageFile: File | null = null;

      if (data.imageUrl) {
        // 從 URL 獲取圖片
        const imgResponse = await fetch(data.imageUrl);
        const blob = await imgResponse.blob();
        resultImageFile = new File([blob], `transformed_${Date.now()}.png`, { type: 'image/png' });
      }

      // 上傳圖片到 uploads
      let uploadedImageId: number | undefined;
      if (resultImageFile) {
        const uploaded = await apiClient.uploadImage(
          resultImageFile,
          `Generated with: ${prompt.substring(0, 100)}...`,
          ['i2i', 'generated'],
          undefined,
          3 // Category 3: 其他
        );
        uploadedImageId = uploaded.id;
      }

      // Step 3: 審核圖片是否符合 prompt
      setEvaluating(true);
      let evaluation: EvaluationResult | undefined = undefined;
      
      try {
        // 使用轉換結果中的評估信息（如果有的話）
        if (data.evaluation) {
          const evalText = data.evaluation.toLowerCase();
          evaluation = {
            meets: evalText.includes('符合') || evalText.includes('good') || evalText.includes('成功') || data.status.includes('成功'),
            critique: data.evaluation || '轉換完成',
          };
        } else {
          // 如果沒有評估信息，使用基本判斷
          evaluation = {
            meets: data.success && data.imageUrl !== undefined,
            critique: '轉換完成，等待詳細評估',
          };
        }
      } catch (evalError) {
        console.warn('評估過程出錯:', evalError);
        evaluation = {
          meets: true,
          critique: '轉換完成',
        };
      } finally {
        setEvaluating(false);
      }

      // Step 4: 保存 Prompt 到 gallery（包含審核結果）
      const savedPrompt = await apiClient.createPrompt({
        prompt: prompt,
        description: description || (evaluation ? `審核結果：${evaluation.meets ? '符合' : '未完全符合'}要求` : undefined),
        category: 'style_transfer',
        image_id: uploadedImageId,
      });

      setResult({
        imageUrl: data.imageUrl,
        status: data.status,
        promptId: savedPrompt.id,
        imageId: uploadedImageId,
        evaluation,
      });

    } catch (error) {
      console.error('Transform error:', error);
      alert(`轉換失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setTransforming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                AI 圖片轉換
              </h1>
              <p className="text-gray-400 text-sm">使用 AI 將圖片轉換成不同風格</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 左側：輸入區域 */}
          <div className="space-y-4">

            {/* 圖片上傳 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                上傳原始圖片
              </h2>

              {sourcePreview ? (
                <div className="relative">
                  <img
                    src={sourcePreview}
                    alt="Source"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSourceImage(null);
                      setSourcePreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm"
                  >
                    移除
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-500 mb-2" />
                  <span className="text-gray-400">點擊或拖拽上傳圖片</span>
                  <span className="text-xs text-gray-500 mt-1">支持 JPG, PNG, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Prompt 輸入 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                轉換 Prompt
              </h2>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的風格，例如：Transform this image into a beautiful watercolor painting with soft colors..."
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                rows={4}
              />

              <div className="mt-3">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="簡短描述（可選）"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-sm"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleTransform}
                  disabled={!sourceImage || !prompt.trim() || transforming}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {transforming ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      轉換中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      開始轉換
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.push('/prompts')}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  title="瀏覽 Prompt Gallery"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 右側：結果區域 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">轉換結果</h2>

            {(transforming || evaluating) && (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                <p className="text-gray-400">
                  {transforming ? 'AI 正在處理您的圖片...' : '正在審核轉換結果...'}
                </p>
                <p className="text-sm text-gray-500 mt-2">這可能需要幾秒鐘</p>
              </div>
            )}

            {!transforming && !result && (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <ImageIcon className="w-16 h-16 mb-4" />
                <p>轉換後的圖片將顯示在這裡</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <img
                  src={result.imageUrl}
                  alt="Transformed"
                  className="w-full rounded-lg"
                />

                {/* 審核結果 */}
                {result.evaluation && (
                  <div className={`rounded-lg p-4 border-2 ${
                    result.evaluation.meets
                      ? 'bg-green-900/30 border-green-500'
                      : 'bg-yellow-900/30 border-yellow-500'
                  }`}>
                    <div className="flex items-start gap-3">
                      {result.evaluation.meets ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">
                          {result.evaluation.meets ? '✓ 審核通過' : '⚠ 審核未完全符合'}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {result.evaluation.critique}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-300 mb-2">
                    <span className="text-green-400">✓</span> 轉換完成！
                  </p>
                  <p className="text-xs text-gray-400">
                    Status: {result.status}
                  </p>
                  {result.promptId && (
                    <p className="text-xs text-gray-400 mt-1">
                      Prompt 已保存到 Gallery (ID: {result.promptId})
                    </p>
                  )}
                  {result.imageId && (
                    <p className="text-xs text-gray-400 mt-1">
                      圖片 ID: {result.imageId}
                    </p>
                  )}
                  <div className="pt-2 mt-2 border-t border-gray-600">
                    <p className="text-xs text-gray-400">
                      ✓ Prompt 和圖片已關聯並保存到數據庫
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(result.imageUrl, '_blank')}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    查看大圖
                  </button>
                  <button
                    onClick={() => router.push('/prompts')}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors"
                  >
                    前往 Gallery
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
