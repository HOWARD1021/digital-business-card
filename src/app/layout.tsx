import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-serif-tc",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "台灣好物・中秋送暖｜全台 62 家身心障礙福利機構中秋愛心禮盒與手作良品導覽",
  description:
    "月圓人團圓，用一份手作禮盒溫暖全台灣！完整收錄全台 62 家身心障礙福利機構與庇護工場的中秋蛋黃酥、鳳梨酥、手工餅乾、冷製手工皂與小農好物，提供機構故事、主力特色與官方直接聯繫管道。",
  keywords: [
    "台灣好物中秋送暖",
    "中秋公益禮盒",
    "身心障礙福利機構",
    "庇護工場中秋月餅",
    "公益蛋黃酥",
    "愛心鳳梨酥",
    "唐氏症愛不囉嗦",
    "喜憨兒中秋禮盒",
    "企業ESG中秋採購",
    "台灣製造中秋好物",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${notoSerifTC.variable} ${notoSansTC.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#f6f0e4] text-[#25211e] antialiased selection:bg-[#ecd0b7] selection:text-[#783615]">
        {children}
      </body>
    </html>
  );
}
