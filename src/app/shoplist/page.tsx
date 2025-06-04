"use client";
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

// 統一的項目型別定義
interface GroceryItem {
  store: string;
  item: string;
  quantity: string;
  nzd: number;
  twd: number;
  category: string;
  type: 'grocery' | 'woolworths' | 'paknsave';
}

const ShopListPage = () => {
  const [tableGenerated, setTableGenerated] = useState(false);

  // 合併所有資料
  const allData: GroceryItem[] = [
    // 原始食材購物清單
    {store: "Jadan 超市", item: "牛油果 (個)", quantity: "2", nzd: 3.98, twd: 75.62, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "洗水小土豆 (袋)", quantity: "1", nzd: 2.99, twd: 56.81, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "洋葱 (袋)", quantity: "1", nzd: 2.29, twd: 43.51, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "椰菜 (個)", quantity: "1", nzd: 2.99, twd: 56.81, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "本地蕃茄 (袋)", quantity: "1", nzd: 5.49, twd: 104.31, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "长青瓜 (條)", quantity: "1", nzd: 4.99, twd: 94.81, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "台灣白菜 (扎)", quantity: "1", nzd: 1.99, twd: 37.81, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "白花菜 (個)", quantity: "1", nzd: 3.49, twd: 66.31, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "凤尾菇 500克", quantity: "1", nzd: 7.99, twd: 151.81, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "有泥黄肉土豆 (公斤)", quantity: "0.76", nzd: 2.27, twd: 43.13, category: "蔬果類", type: "grocery"},
    {store: "Jadan 超市", item: "6号新鲜鸡蛋 (30只)", quantity: "1", nzd: 16.99, twd: 322.81, category: "蛋白質", type: "grocery"},
    {store: "Woolworths 超市", item: "奇異果 (金黃)", quantity: "0.775 kg", nzd: 3.10, twd: 58.90, category: "蔬果類", type: "grocery"},
    {store: "Woolworths 超市", item: "Hellers 麥盧卡煙熏培根", quantity: "800g", nzd: 12.80, twd: 243.20, category: "肉類", type: "grocery"},
    {store: "Woolworths 超市", item: "WW 西冷牛排薄切", quantity: "-", nzd: 18.98, twd: 360.62, category: "肉類", type: "grocery"},
    {store: "Woolworths 超市", item: "Ploughmans 鄉村麵包", quantity: "750g", nzd: 3.30, twd: 62.70, category: "主食", type: "grocery"},
    {store: "Woolworths 超市", item: "WW Kransky 起司香腸", quantity: "480g", nzd: 6.00, twd: 114.00, category: "肉類", type: "grocery"},
    {store: "Woolworths 超市", item: "WW 薄切豬肉香腸", quantity: "500g 9包", nzd: 8.00, twd: 152.00, category: "肉類", type: "grocery"},
    {store: "Woolworths 超市", item: "3件20元優惠折扣", quantity: "-", nzd: -5.92, twd: -112.48, category: "折扣", type: "grocery"},
    {store: "Woolworths 超市", item: "Yoplait 希臘輕怡優格原味", quantity: "1kg", nzd: 6.35, twd: 120.65, category: "乳製品", type: "grocery"},
    {store: "Woolworths 超市", item: "La Molisana 意大利寬麵", quantity: "500g", nzd: 3.50, twd: 66.50, category: "主食", type: "grocery"},
    
    // Woolworths Mt Eden 收據
    {store: "Woolworths Mt Eden", item: "Carrot", quantity: "0.610 kg NET", nzd: 1.58, twd: 30.02, category: "蔬果類", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Ginger", quantity: "0.140 kg NET", nzd: 1.40, twd: 26.60, category: "蔬果類", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Baguette", quantity: "-", nzd: 4.00, twd: 76.00, category: "主食", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Wholemeal & Grain Loaf", quantity: "-", nzd: 3.49, twd: 66.31, category: "主食", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Delisio SweetChilli Relish", quantity: "140g", nzd: 3.00, twd: 57.00, category: "調味料", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Delisio Caramelised Onion & Vinegar", quantity: "140g", nzd: 5.00, twd: 95.00, category: "調味料", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Eta Ripple Cut Salt & Vinegar", quantity: "150g", nzd: 1.90, twd: 36.10, category: "零食", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Apples 2kg Odd Bunch", quantity: "2kg", nzd: 5.99, twd: 113.81, category: "蔬果類", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "NZ Kettle Korn MultiPack", quantity: "12 pack", nzd: 4.50, twd: 85.50, category: "零食", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "VW Beef Chuck Steak", quantity: "-", nzd: 9.21, twd: 174.99, category: "肉類", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Whole Raw Banana Prawns", quantity: "600g", nzd: 30.00, twd: 570.00, category: "海鮮", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Lettuce Wrapped", quantity: "-", nzd: 3.30, twd: 62.70, category: "蔬果類", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "VW Milk Standard", quantity: "3L", nzd: 6.75, twd: 128.25, category: "乳製品", type: "woolworths"},
    {store: "Woolworths Mt Eden", item: "Leggos Roasted Garlic Pasta Sauce", quantity: "500g", nzd: 3.80, twd: 72.20, category: "調味料", type: "woolworths"},
    
    // PAK&apos;nSAVE Royal Oak 收據
    {store: "PAK&apos;nSAVE Royal Oak", item: "Bluebird Orig Cut S/Cream/Chives 150g", quantity: "150g", nzd: 1.79, twd: 34.01, category: "零食", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "ETA Chips Ripples Pickled Onion 150g", quantity: "150g", nzd: 2.19, twd: 41.61, category: "零食", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "Hup Seng Cream Crackers 428g", quantity: "428g", nzd: 3.49, twd: 66.31, category: "零食", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "Pams Rice Crackers S/Cream/Chives 100g", quantity: "100g", nzd: 1.09, twd: 20.71, category: "零食", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "Avocados Bag 1kg", quantity: "1kg", nzd: 6.99, twd: 132.81, category: "蔬果類", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "Cucumber Telegraph", quantity: "-", nzd: 3.99, twd: 75.81, category: "蔬果類", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "Daikon EA", quantity: "-", nzd: 2.29, twd: 43.51, category: "蔬果類", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "Constantia Butter Garlic 110g", quantity: "110g", nzd: 3.19, twd: 60.61, category: "調味料", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "Romanos Pizza Ham / Pineapple 400g", quantity: "400g", nzd: 3.69, twd: 70.11, category: "冷凍食品", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "French Stick Plain", quantity: "-", nzd: 1.99, twd: 37.81, category: "主食", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "NZ Beef Mince", quantity: "-", nzd: 14.28, twd: 271.32, category: "肉類", type: "paknsave"},
    {store: "PAK&apos;nSAVE Royal Oak", item: "NZ Chicken Drumsticks", quantity: "-", nzd: 7.11, twd: 135.09, category: "肉類", type: "paknsave"}
  ];

  // 計算統計資料
  const totalItems = allData.length;
  const totalNZD = allData.reduce((sum, item) => sum + item.nzd, 0);
  const totalTWD = allData.reduce((sum, item) => sum + item.twd, 0);

  // 生成 CSV 內容
  const downloadCSV = () => {
    const csvContent = [
      ['店家', '品項', '數量', '總價(紐幣)', '總價(台幣)', '類別', '類型'],
      ...allData.map(item => [
        item.store,
        item.item,
        item.quantity,
        item.nzd.toFixed(2),
        item.twd.toFixed(2),
        item.category,
        item.type
      ]),
      ['總計', `${totalItems}項食材`, '', totalNZD.toFixed(2), totalTWD.toFixed(2), '全部', '']
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `綜合購物清單_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 類別顏色映射
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      '蔬果類': 'bg-green-500',
      '肉類': 'bg-red-500',
      '蛋白質': 'bg-orange-500',
      '主食': 'bg-yellow-500',
      '乳製品': 'bg-blue-500',
      '折扣': 'bg-purple-500',
      '調味料': 'bg-pink-500',
      '零食': 'bg-indigo-500',
      '海鮮': 'bg-teal-500',
      '冷凍食品': 'bg-cyan-500'
    };
    return colorMap[category] || 'bg-gray-500';
  };

  // 店家顏色映射
  const getStoreColor = (store: string) => {
    if (store.includes('Jadan')) return 'bg-blue-100 text-blue-800';
    if (store.includes('Woolworths')) return 'bg-green-100 text-green-800';
    if (store.includes("PAK") && store.includes("nSAVE")) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    setTableGenerated(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Container */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            🛒 綜合購物清單管理系統
          </h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl p-6 text-white text-center shadow-lg">
              <h3 className="text-lg font-semibold mb-2">總項目數</h3>
              <div className="text-3xl font-bold">{totalItems}</div>
              <div className="text-sm opacity-90">項食材</div>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl p-6 text-white text-center shadow-lg">
              <h3 className="text-lg font-semibold mb-2">紐幣總額</h3>
              <div className="text-3xl font-bold">${totalNZD.toFixed(2)}</div>
              <div className="text-sm opacity-90">NZD</div>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-6 text-white text-center shadow-lg">
              <h3 className="text-lg font-semibold mb-2">台幣總額</h3>
              <div className="text-3xl font-bold">${totalTWD.toFixed(2)}</div>
              <div className="text-sm opacity-90">TWD</div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-xl">
            <h3 className="text-blue-700 text-lg font-semibold mb-2">📋 使用說明</h3>
            <ul className="text-blue-600 space-y-1">
              <li>• 包含食材購物清單、Woolworths 和 PAK&apos;nSAVE 收據</li>
              <li>• 點擊下方按鈕即可下載完整的 CSV 檔案</li>
              <li>• 檔案包含詳細的商品清單、價格對比和統計資訊</li>
              <li>• CSV 檔案可用於進一步的分析和記錄</li>
            </ul>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto rounded-xl shadow-lg mb-8">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <th className="p-4 text-left font-semibold">店家</th>
                  <th className="p-4 text-left font-semibold">品項</th>
                  <th className="p-4 text-left font-semibold">數量</th>
                  <th className="p-4 text-left font-semibold">總價 (紐幣)</th>
                  <th className="p-4 text-left font-semibold">總價 (台幣)</th>
                  <th className="p-4 text-left font-semibold">類別</th>
                </tr>
              </thead>
              <tbody>
                {tableGenerated && allData.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors border-b border-gray-200`}
                  >
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStoreColor(item.store)}`}>
                        {item.store}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{item.item}</td>
                    <td className="p-4 text-gray-700">{item.quantity}</td>
                    <td className="p-4 text-gray-700">${item.nzd.toFixed(2)}</td>
                    <td className="p-4 text-gray-700">${item.twd.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold">
                  <td className="p-4" colSpan={3}><strong>總計</strong></td>
                  <td className="p-4"><strong>${totalNZD.toFixed(2)}</strong></td>
                  <td className="p-4"><strong>${totalTWD.toFixed(2)}</strong></td>
                  <td className="p-4"><strong>{totalItems}項</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Download size={20} />
              📊 下載綜合清單 CSV 檔案
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListPage; 