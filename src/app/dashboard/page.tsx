"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Image as ImageIcon, X, FolderPlus, Folder, GripVertical } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { ImageRecord } from '../../types';

// Grug 說：簡化狀態，只保留核心功能
export default function Dashboard() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<1 | 2 | 3>(1);
  const [showUpload, setShowUpload] = useState(false);

  // 新增：資料夾和拖拽狀態
  const [folders, setFolders] = useState<{id: number, name: string, description?: string, image_count: number}[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('default');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [draggedImage, setDraggedImage] = useState<ImageRecord | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  // 加載圖片數據
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiClient.getImages({
        category: selectedCategory as 1 | 2 | 3,
        folder_name: selectedFolder === 'all' ? undefined : selectedFolder,
        sort_by: 'sort_order',
        sort_order: 'asc'
      });
      setImages(result.images);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedFolder]);

  // 加載資料夾數據
  const loadFolders = useCallback(async () => {
    try {
      const result = await apiClient.getFolders();
      setFolders(result);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  // 文件上傳 - Grug 說：簡化流程
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    // Category 1 只能有一張圖片
    if (selectedCategory === 1 && images.length > 0) {
      alert('首頁圖只能有一張');
      return;
    }

    try {
      for (const file of Array.from(files)) {
        await apiClient.uploadImage(file, undefined, undefined, undefined, selectedCategory);
      }
      await loadData(); // 重新加載
      setShowUpload(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上傳失敗');
    }
  };

  // 刪除圖片
  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除這張圖片嗎？')) return;

    try {
      await apiClient.deleteImage(id);
      await loadData();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('刪除失敗');
    }
  };

  // 創建新資料夾
  const handleCreateFolder = async (folderName: string, description?: string) => {
    try {
      await apiClient.createFolder(folderName, description);
      setShowCreateFolder(false);
      await loadFolders();
    } catch (error) {
      console.error('Create folder failed:', error);
      alert('創建資料夾失敗');
    }
  };

  // 移動圖片到資料夾
  const handleMoveToFolder = async (imageId: number, folderName: string) => {
    try {
      await apiClient.updateImageFolder(imageId, folderName);
      await loadData();
      await loadFolders();
    } catch (error) {
      console.error('Move to folder failed:', error);
      alert('移動失敗');
    }
  };

  // 拖拽開始
  const handleDragStart = (e: React.DragEvent, image: ImageRecord) => {
    setDraggedImage(image);
    e.dataTransfer.setData('text/plain', image.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  // 拖拽結束
  const handleDragEnd = () => {
    setDraggedImage(null);
    setDragOverFolder(null);
  };

  // 資料夾拖拽進入
  const handleFolderDragOver = (folderName: string) => {
    setDragOverFolder(folderName);
  };

  // 資料夾拖拽離開
  const handleFolderDragLeave = () => {
    setDragOverFolder(null);
  };

  // 放到資料夾
  const handleFolderDrop = async (folderName: string) => {
    if (draggedImage) {
      await handleMoveToFolder(draggedImage.id, folderName);
    }
    setDraggedImage(null);
    setDragOverFolder(null);
  };

  // 圖片排序
  const handleReorderImages = async (draggedId: number, targetIndex: number) => {
    const draggedImage = images.find(img => img.id === draggedId);
    if (!draggedImage) return;

    const newImages = [...images];
    const draggedIndex = newImages.findIndex(img => img.id === draggedId);

    // 移除拖拽的圖片
    newImages.splice(draggedIndex, 1);

    // 插入到目標位置
    newImages.splice(targetIndex, 0, draggedImage);

    // 更新排序
    const updates = newImages.map((img, index) => ({
      id: img.id,
      sort_order: index + 1
    }));

    try {
      await apiClient.updateSortOrders(updates);
      setImages(newImages);
    } catch (error) {
      console.error('Reorder failed:', error);
      alert('排序失敗');
      await loadData(); // 重新載入
    }
  };

  // 使用圖片 - Grug 說：一個好按鈕解決所有問題
  const handleUse = (imageId: number) => {
    if (selectedCategory === 1) {
      // 首頁圖 -> 去 Shorts
      window.open(`/shorts?imageId=${imageId}`, '_blank');
    } else {
      // 風格圖 -> 去 slideswipe
      window.open(`/slideswipe?imageId=${imageId}`, '_blank');
    }
  };

  // Grug 說：簡單的統計信息，不要花哨卡片
  const [allImages, setAllImages] = useState<ImageRecord[]>([]);
  
  // 加載所有圖片用於統計
  useEffect(() => {
    const loadAllImages = async () => {
      try {
        const result = await apiClient.getImages({});
        setAllImages(result.images);
      } catch (error) {
        console.error('Failed to load all images:', error);
      }
    };
    loadAllImages();
  }, []);

  const categoryStats = {
    1: allImages.filter(img => img.category === 1).length,
    2: allImages.filter(img => img.category === 2).length,
    3: allImages.filter(img => img.category === 3).length
  };

  const totalImages = categoryStats[1] + categoryStats[2] + categoryStats[3];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        
        {/* Grug 標題：簡單直接 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">圖片管理</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>總計: {totalImages} 張</span>
            <span>首頁: {categoryStats[1]} 張</span>
            <span>風格: {categoryStats[2]} 張</span>
            <span>其他: {categoryStats[3]} 張</span>
          </div>
        </div>

        {/* Grug 工具欄：只保留必要功能 */}
        <div className="flex items-center gap-4 mb-6">

          {/* 分類選擇 - Grug 說：灰色就很好 */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory(1)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 1
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🖤 首頁圖
            </button>
            <button
              onClick={() => setSelectedCategory(2)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 2
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🎨 風格圖
            </button>
            <button
              onClick={() => setSelectedCategory(3)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 3
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📁 其他
            </button>
          </div>

          {/* 資料夾選擇 */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">資料夾:</span>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-gray-500"
            >
              <option value="all">📂 所有資料夾</option>
              <option value="default">📁 默認</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.name}>
                  📁 {folder.name} ({folder.image_count})
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowCreateFolder(true)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-1 transition-colors"
              title="創建新資料夾"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {/* 上傳按鈕 - Grug 說：一個好按鈕 */}
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            上傳
          </button>

        </div>

        {/* 資料夾拖拽區域 */}
        {draggedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-300">拖拽到資料夾：</h3>
            <div className="flex flex-wrap gap-3">
              {folders.map(folder => (
                <div
                  key={folder.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleFolderDragOver(folder.name);
                  }}
                  onDragLeave={handleFolderDragLeave}
                  onDrop={() => handleFolderDrop(folder.name)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                    dragOverFolder === folder.name
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                  }`}
                >
                  <Folder className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-white">{folder.name}</div>
                    <div className="text-xs text-gray-400">{folder.image_count} 張圖片</div>
                  </div>
                </div>
              ))}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  handleFolderDragOver('default');
                }}
                onDragLeave={handleFolderDragLeave}
                onDrop={() => handleFolderDrop('default')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                  dragOverFolder === 'default'
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                }`}
              >
                <Folder className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-white">默認</div>
                  <div className="text-xs text-gray-400">默認資料夾</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grug 網格：統一整齊 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400">載入中...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
                  if (draggedId && draggedId !== image.id) {
                    handleReorderImages(draggedId, index);
                  }
                }}
                className="bg-gray-800 rounded-lg overflow-hidden cursor-move hover:bg-gray-750 transition-colors group"
              >

                {/* 拖拽手柄 */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </div>

                {/* 圖片 - Grug 說：統一比例 */}
                <div className="aspect-square bg-gray-700">
                  <img
                    src={apiClient.getImageDownloadUrl(image.id)}
                    alt={image.original_filename}
                    className="w-full h-full object-contain bg-gray-900"
                  />
                </div>

                {/* 信息 - Grug 說：緊湊布局 */}
                <div className="p-3">
                  <div className="text-sm text-gray-300 mb-2 truncate">
                    {image.original_filename}
                  </div>

                  {/* 排序信息 */}
                  <div className="text-xs text-gray-500 mb-2">
                    排序: {image.sort_order || 0}
                  </div>

                  {/* Grug 按鈕：只有兩個，清楚明白 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUse(image.id)}
                      className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
                    >
                      使用
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* 空狀態 - Grug 說：直接說明 */}
        {!loading && images.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg text-gray-400 mb-2">沒有圖片</h3>
            <p className="text-gray-500 mb-4">點擊上傳按鈕添加圖片</p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              立即上傳
            </button>
          </div>
        )}

      </div>

      {/* Grug 上傳彈窗：簡單直接 */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">上傳圖片</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">
                上傳到: {selectedCategory === 1 ? '🖤 首頁圖' : selectedCategory === 2 ? '🎨 風格圖' : '📁 其他'}
              </div>
              {selectedCategory === 1 && (
                <div className="text-xs text-yellow-400 mb-2">
                  首頁圖只能有一張
                </div>
              )}
            </div>

            {/* Grug 拖拽區域：大而明顯 */}
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFileUpload(files);
                };
                input.click();
              }}
            >
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <div className="text-gray-400">點擊或拖拽上傳圖片</div>
              <div className="text-xs text-gray-500 mt-1">支持 JPG, PNG, WebP</div>
            </div>

          </div>
        </div>
      )}

      {/* 創建資料夾彈窗 */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">創建新資料夾</h2>
              <button
                onClick={() => setShowCreateFolder(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CreateFolderForm
              onSubmit={handleCreateFolder}
              onCancel={() => setShowCreateFolder(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}

// 創建資料夾表單組件
function CreateFolderForm({ onSubmit, onCancel }: {
  onSubmit: (name: string, description?: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          資料夾名稱 *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none"
          placeholder="輸入資料夾名稱"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          描述（可選）
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none resize-none"
          placeholder="輸入資料夾描述"
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          創建
        </button>
      </div>
    </form>
  );
}