import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: 실제 도메인이 정해지면 교체 (metadataBase, sitemap.ts의 baseUrl도 같이)
const SITE_URL = "https://dongne-info.example.com";

export const metadata: Metadata = {
  title: "우리동네 생활정보 | 재활용 쓰레기 버리는 날 · 종량제봉투",
  description:
    "전국 시군구별 재활용·음식물·일반쓰레기 배출 요일과 시간, 종량제봉투 판매소 위치를 확인하세요.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
        {children}
        <footer className="mt-auto border-t border-zinc-200 px-4 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
          데이터 출처: 행정안전부 생활쓰레기배출정보 조회서비스, 전국종량제봉투판매소표준데이터
          (공공데이터포털)
        </footer>
      </body>
    </html>
  );
}
