"use client";

import React, { useState } from "react";
import { Sparkles, Send, CheckCircle2, HeartHandshake, Building, Award, Users, BookOpen } from "lucide-react";

export default function EsgInquirySection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    unitName: "",
    contactName: "",
    phone: "",
    email: "",
    inquiryType: "企業 ESG 永續採購媒合",
    preferredRegion: "全台皆可",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="connect" className="py-20 bg-gradient-to-b from-[#1b3b32] via-[#22483d] to-[#17322a] text-white relative overflow-hidden">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Catchphrase */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            公益串聯・機構交流與永續合作
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            把台灣的好，帶進生活裡
          </h2>
          
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            匯聚 62 家身心障礙福利機構與庇護工場。無論您是企業夥伴、學校單位或志工團體，歡迎透過本平台深入認識各機構，攜手創造溫暖的正向循環。
          </p>

          <div className="pt-2">
            <a
              href="#directory"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-[#a8422b] hover:bg-[#8f3521] text-white font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <span>瀏覽 62 家機構全覽名錄</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <Building className="w-8 h-8 text-amber-400" />
            <h3 className="text-lg font-bold font-serif">機構背景與故事導覽</h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              透明公開 62 家機構歷史、服務對象（唐寶寶、星兒、憨兒等）與職能訓練環境。
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <Award className="w-8 h-8 text-emerald-300" />
            <h3 className="text-lg font-bold font-serif">企業 ESG 永續串聯</h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              協助企業對接合適的身障機構，落實社會責任與永續採購倡議。
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <BookOpen className="w-8 h-8 text-blue-300" />
            <h3 className="text-lg font-bold font-serif">在地職人技術肯定</h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              推廣 21 道工序手作烘焙、45天冷製皂、原木陶藝與在地農產，展現職人硬實力。
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <Users className="w-8 h-8 text-rose-300" />
            <h3 className="text-lg font-bold font-serif">直接聯繫與透明支持</h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              提供各機構官方網站與直接聯繫電話，減少中間環節，直接傳遞關懷。
            </p>
          </div>
        </div>

        {/* Outreach / Matchmaking Consultation Form */}
        <div className="max-w-3xl mx-auto bg-[#fdf9f2] text-[#2b2520] rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#decbb8]">
          <div className="text-center mb-8 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#29221d]">
              機構合作、交流參訪或專案諮詢
            </h3>
            <p className="text-xs sm:text-sm text-[#736355]">
              若您有特定機構合作、參訪交流或企業永續對接需求，歡迎填寫表單，我們將竭誠為您指引媒合。
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4 bg-[#eaf3ed] rounded-2xl border border-[#cbe0d3] p-6">
              <div className="w-16 h-16 rounded-full bg-[#22483d] text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold font-serif text-[#22483d]">
                諮詢訊息已送出！
              </h4>
              <p className="text-sm text-[#4d4034] max-w-md mx-auto">
                感謝您對台灣 62 家身障福利機構的關注與支持，專案團隊將儘速回覆您的需求。
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#22483d] text-white text-xs font-bold hover:bg-[#1a3830] transition-colors"
              >
                再次填寫
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4d40] mb-1.5">
                    單位 / 企業 / 學校名稱 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例：宏遠社會永續基金會 / 個人志工"
                    value={formData.unitName}
                    onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f2e7] border border-[#d9c7b2] text-sm focus:outline-none focus:ring-2 focus:ring-[#22483d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4d40] mb-1.5">
                    聯絡人姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例：王小姐 / 張組長"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f2e7] border border-[#d9c7b2] text-sm focus:outline-none focus:ring-2 focus:ring-[#22483d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4d40] mb-1.5">
                    聯絡電話 *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="例：02-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f2e7] border border-[#d9c7b2] text-sm focus:outline-none focus:ring-2 focus:ring-[#22483d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4d40] mb-1.5">
                    電子信箱 (Email) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="例：info@example.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#f8f2e7] border border-[#d9c7b2] text-sm focus:outline-none focus:ring-2 focus:ring-[#22483d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4d40] mb-1.5">
                    諮詢合作類別
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-[#f8f2e7] border border-[#d9c7b2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#22483d]"
                  >
                    <option>企業 ESG 永續採購媒合</option>
                    <option>機構參訪與志工服務交流</option>
                    <option>校園生命教育與宣導講座</option>
                    <option>跨界聯名與媒體採訪報導</option>
                    <option>其他合作建議</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4d40] mb-1.5">
                    感興趣之地區 / 機構
                  </label>
                  <select
                    value={formData.preferredRegion}
                    onChange={(e) => setFormData({ ...formData, preferredRegion: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-[#f8f2e7] border border-[#d9c7b2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#22483d]"
                  >
                    <option>全台皆可</option>
                    <option>北部地區（基北北桃竹）</option>
                    <option>中部地區（苗中彰雲）</option>
                    <option>南部地區（嘉南高屏）</option>
                    <option>東部地區（宜花東）</option>
                    <option>離島地區（澎湖、金門）</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c4d40] mb-1.5">
                  諮詢內容或備註說明
                </label>
                <textarea
                  rows={3}
                  placeholder="請簡述您的需求、預計合作形式或特定想聯繫之機構..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f2e7] border border-[#d9c7b2] text-sm focus:outline-none focus:ring-2 focus:ring-[#22483d]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#a8422b] hover:bg-[#8f3521] text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>送出諮詢訊息</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
