# 📱 Shorts 功能規格文檔 v3.0

## 🎯 **核心需求**

**Shorts 功能是一個 1080x1920 的垂直畫面，展示網格布局的圖片，使用類似 slideswipe 的自動切換動畫效果。**

### **主要特點**
- 📱 **1080x1920 垂直畫面** (9:16 比例)
- 🔢 **動態網格布局**: 4張圖片 = 2x2 (每張佔 1/4)，8張圖片 = 4x2 (每張佔 1/8)
- 🎬 **slideswipe 風格動畫**: 白色遮罩從右到左滑動切換
- ⌨️ **空白鍵控制**: 開始/重置動畫
- 🎥 **錄影友好**: 控制元素不擋住主畫面

---

## 🎨 **UI 設計規格**

### **畫面結構**
```
┌─────────────────────────────────┐ ← 1080px 寬
│ [返回]                [開始]    │ ← 左上返回，右上控制
│                       [空白鍵]  │
│                       [1/8]     │
│  ┌────────┬────────┐            │
│  │ 圖片1  │ 圖片2  │            │ ← 網格布局
│  │        │        │            │   (當前示例: 4x2)
│  ├────────┼────────┤            │
│  │ 圖片3  │ 圖片4  │            │   slideswipe 動畫
│  │        │        │            │   逐個切換
│  ├────────┼────────┤            │
│  │ 圖片5  │ 圖片6  │            │
│  │        │        │            │
│  ├────────┼────────┤            │
│  │ 圖片7  │ 圖片8  │            │
│  │        │        │            │
│  └────────┴────────┘            │
│                                 │
│                                 │ ← 中央區域完全無遮擋
└─────────────────────────────────┘
                                   ← 1920px 高
```

### **控制區域佈局**
- **左上角**: 返回按鈕
- **右上角**: 開始/重置按鈕 + 操作提示 + 畫面比例
- **中央區域**: 完全無遮擋，適合錄影

### **動畫效果**
- **初始狀態**: 所有格子都顯示原圖
- **轉換過程**: 動漫風格圖從左到右滑動覆蓋原圖
- **最終狀態**: 每個格子顯示對應的動漫風格
- 每張圖片間隔 800ms 切換
- 切換動畫時長 1200ms
- 從左到右的 clip-path 動畫

---

## 🎮 **交互功能**

### **控制方式**
1. **⌨️ 空白鍵** (主要控制)
   - 未播放時：開始動畫
   - 播放中：重置動畫

2. **🖱️ 按鈕點擊**
   - 右上角開始/重置按鈕
   - 左上角返回按鈕

### **狀態管理**
```typescript
const [items, setItems] = useState<ShortsItem[]>([]); // 圖片數據
const [revealed, setRevealed] = useState<boolean[]>([]); // 動畫狀態
const [isPlaying, setIsPlaying] = useState(false);    // 播放狀態
const [loading, setLoading] = useState(true);         // 載入狀態
```

---

## 🎬 **動畫實現**

### **slideswipe 風格動畫**
```typescript
// 動畫參數
const STEP_DELAY = 800;     // 每張圖片切換間隔
const REVEAL_DURATION = 1200; // 切換動畫時長

// 開始動畫邏輯
const startAnimation = () => {
  setIsPlaying(true);
  setRevealed(new Array(items.length).fill(false));
  
  items.forEach((_, index) => {
    setTimeout(() => {
      setRevealed(prev => {
        const next = [...prev];
        next[index] = true;
        return next;
      });
    }, index * STEP_DELAY);
  });
};
```

### **遮罩動畫效果**
```css
.slide-mask {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);       /* 初始狀態 - 完全覆蓋，顯示原圖 */
  clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%); /* 動畫結束 - 完全右移，顯示動漫風格 */
  transition: clip-path 1200ms ease-out;
}
```

---

## 📊 **數據結構**

### **ShortsItem 介面**
```typescript
interface ShortsItem {
  id: number;           // 圖片 ID
  url: string;          // 圖片 URL  
  styleName: string;    // 顯示名稱
  isOriginal?: boolean; // 是否為原圖
  animeStyle?: string;  // 動漫風格名稱
  animeIcon?: string;   // 動漫風格圖標
}
```

### **數據載入順序**
1. **原圖** (Category 1) - 顯示為 "原圖"，黃色標籤
2. **風格圖** (Category 2) - 顯示為 "風格 1", "風格 2" 等

---

## 🎯 **核心功能實現**

### **1. 響應式畫面比例**
```css
.shorts-container {
  width: 100%;
  max-width: 1080px;
  aspect-ratio: 9/16;  /* 1080x1920 比例 */
  height: auto;
  max-height: 100vh;
}
```

### **2. 動態網格布局**
```typescript
const getGridLayout = () => {
  if (gridSize <= 4) {
    return { rows: 2, cols: 2 }; // 2x2 每張圖佔 1/4
  } else {
    return { rows: 4, cols: 2 }; // 4x2 每張圖佔 1/8
  }
};
```

### **3. ShortsCell 組件**
```typescript
function ShortsCell({ item, originalImageUrl, revealed, index }: ShortsCellProps) {
  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* 底圖 - 永遠是原圖 */}
      <Image src={originalImageUrl} fill className="object-contain bg-gray-900" />
      
      {/* 風格化圖片遮罩 - 從左到右滑動 */}
      <div
        className="absolute inset-0 transition-all ease-out overflow-hidden"
        style={{
          clipPath: revealed
            ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" // 完全右移
            : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",       // 完全覆蓋
          transitionDuration: "1200ms"
        }}
      >
        <Image src={item.url} fill className="object-contain bg-gray-900" />
      </div>
      
      {/* 動漫風格標識 - 右下角 */}
      <div className="absolute bottom-2 right-2">
        <div className="bg-black/70 rounded-lg px-2 py-1 flex items-center gap-1">
          <span className="text-sm">{item.animeIcon}</span>
          <span className="text-xs">{item.animeStyle}</span>
        </div>
      </div>
    </div>
  );
}
```

### **4. 空白鍵控制**
```typescript
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
```

---

## 🎨 **色彩與樣式**

### **主要色彩**
- **背景**: `bg-black` (純黑)
- **圖片背景**: `bg-gray-900` (深灰)
- **遮罩**: `bg-white` (白色滑動遮罩)
- **原圖標籤**: `bg-yellow-500/90 text-black` (黃色背景黑字)
- **風格標籤**: `bg-black/70 text-white` (黑色半透明白字)

### **控制元素樣式**
- **按鈕背景**: `bg-black/60 backdrop-blur-sm` (半透明黑色毛玻璃)
- **懸停效果**: `hover:bg-black/80` (更深的半透明)
- **圓角**: `rounded-lg` (統一圓角)

---

## 📱 **響應式設計**

### **桌面端** (寬螢幕)
- 居中顯示 1080x1920 容器
- 空白鍵控制為主
- 右側控制區域清晰可見

### **移動端** (手機)
- 全螢幕顯示
- 觸摸按鈕控制
- 控制區域適當縮小

### **平板端** (中等螢幕)
- 適中的容器大小
- 同時支援觸摸和鍵盤

---

## 🔧 **技術實現細節**

### **關鍵組件結構**
```typescript
export default function ShortsContent() {
  // 狀態管理
  const [items, setItems] = useState<ShortsItem[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 動畫控制
  const startAnimation = () => { /* slideswipe 風格動畫 */ };
  const resetAnimation = () => { /* 重置狀態 */ };
  
  // 網格布局計算
  const getGridLayout = () => { /* 動態布局邏輯 */ };
  
  return (
    <div className="w-full h-screen bg-black">
      {/* 左上角返回按鈕 */}
      {/* 右上角控制區域 */}
      {/* 主要內容區域 - 1080x1920 */}
    </div>
  );
}

function ShortsCell({ item, revealed, index }) {
  return (
    <div className="relative">
      <Image /> {/* 背景圖 */}
      <div style={{ clipPath }} /> {/* slideswipe 遮罩 */}
      <div className="label" /> {/* 標籤 */}
    </div>
  );
}
```

### **文件結構**
```
src/app/shorts/
├── page.tsx              # Next.js 頁面入口
├── ShortsContent.tsx     # 主要邏輯組件
└── README_IMPORTANT.md   # 重要說明文檔
```

---

## 🧪 **測試檢查清單**

### **基本功能**
- [ ] 頁面正確載入圖片數據
- [ ] 網格布局根據圖片數量自動調整 (2x2 或 4x2)
- [ ] slideswipe 風格動畫正常播放
- [ ] 原圖有黃色標籤標識

### **控制功能**  
- [ ] 空白鍵開始/重置功能正常
- [ ] 右上角按鈕點擊正常
- [ ] 左上角返回按鈕正常
- [ ] 動畫播放狀態正確切換

### **視覺效果**
- [ ] 1080x1920 比例正確
- [ ] 白色遮罩滑動動畫流暢
- [ ] 控制元素不擋住主畫面
- [ ] 響應式設計在各設備正常

### **錄影友好性**
- [ ] 中央區域完全無遮擋
- [ ] 控制元素位於邊緣
- [ ] 動畫效果適合錄製
- [ ] 無干擾性彈窗或提示

---

## 🚀 **使用流程**

### **用戶操作步驟**
1. 在 Dashboard 點擊任意圖片的 "Shorts 模式" 按鈕
2. 頁面打開，顯示 1080x1920 的 Shorts 界面
3. 所有圖片以網格形式靜態顯示
4. 用戶可以：
   - 按空白鍵開始 slideswipe 動畫
   - 點擊右上角開始按鈕
   - 動畫播放時按空白鍵重置
5. 觀看完畢後點擊返回

### **系統行為**
1. 根據圖片數量自動選擇網格布局 (2x2 或 4x2)
2. 預設所有圖片靜態顯示，無動畫
3. 開始動畫後，按順序逐個切換 (slideswipe 效果)
4. 動畫完成後自動停止，可重新開始

---

## ⚠️ **重要設計原則**

### **錄影友好性**
- 🎥 **中央無遮擋**: 主要內容區域完全無控制元素
- 📍 **邊緣控制**: 所有控制按鈕和文字位於邊緣
- 🎬 **動畫流暢**: slideswipe 效果適合錄製
- ⚡ **快速響應**: 空白鍵控制反應迅速

### **視覺設計**
- 🖤 **純黑背景**: 突出圖片內容
- 🔳 **網格整齊**: 統一的間距和圓角
- 🏷️ **清晰標籤**: 原圖和風格圖區分明顯
- ✨ **動畫自然**: slideswipe 效果自然流暢

### **用戶體驗**
- ⌨️ **直觀控制**: 空白鍵是通用的開始/暫停鍵
- 🔄 **狀態清晰**: 開始/重置狀態明確
- 📱 **響應式**: 適配各種螢幕尺寸
- 🚀 **性能優化**: 流暢的動畫和快速載入

---

## 📝 **版本歷史**

### **v3.0 (2025-08-26)**
- 實現 slideswipe 風格的自動切換動畫
- 移除手動導航，改為自動播放
- 空白鍵控制開始/重置
- 控制元素移至邊緣，不擋住錄影畫面
- 優化錄影友好性

### **v2.0 (已廢棄)**
- 手動導航的一張一張顯示
- 觸摸滑動和鍵盤控制

### **v1.0 (已廢棄)**
- 靜態同時顯示所有圖片

---

## 🎯 **總結**

**Shorts 功能現在是一個錄影友好的垂直動畫展示器**，結合了 Shorts 格式和 slideswipe 動畫：

- ✅ 1080x1920 標準 Shorts 比例
- ✅ 動態網格布局 (2x2 或 4x2)
- ✅ slideswipe 風格的白色遮罩動畫
- ✅ 空白鍵控制開始/重置
- ✅ 控制元素不擋住主畫面
- ✅ 適合直接錄製的流暢動畫
- ✅ 響應式設計適配各種設備

**這是一個專為錄製優化的 Shorts 動畫展示器！** 📱🎬