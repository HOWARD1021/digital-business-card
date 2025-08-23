"use client";
import Link from 'next/link';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';

const NotFoundPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-gray-100 -z-10 transform translate-x-2 translate-y-2">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              頁面未找到
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              抱歉，您要尋找的頁面不存在或已被移除。
            </p>
            <p className="text-gray-600">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Suggested Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-black to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              aria-label="返回首頁"
            >
              <Home size={20} className="group-hover:animate-bounce" />
              <span>返回首頁</span>
            </Link>
            
            <button
              onClick={handleRefresh}
              className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              aria-label="重新整理頁面"
            >
              <RefreshCw size={20} className="group-hover:animate-spin" />
              <span>重新整理</span>
            </button>
          </div>

          {/* Additional Navigation */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Search size={20} />
              可能的原因
            </h3>
            <ul className="text-gray-700 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">•</span>
                <span>網址輸入錯誤或連結已過期</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 font-bold">•</span>
                <span>頁面正在維護中</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-800 font-bold">•</span>
                <span>網路連線問題</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">•</span>
                <span>內容已被移至其他位置</span>
              </li>
            </ul>
          </div>

          {/* Fun Element */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-300">
              <span>💡</span>
              <span>提示：您可以使用瀏覽器的返回按鈕</span>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              aria-label="返回上一頁"
            >
              <ArrowLeft size={18} />
              <span>返回上一頁</span>
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-20 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white bg-opacity-20 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-white bg-opacity-20 rounded-full animate-float-slow"></div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage; 