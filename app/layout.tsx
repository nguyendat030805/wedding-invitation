import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Alex_Brush,
  Pinyon_Script,
  Playfair_Display,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Font uốn lượn cho tên Cô Dâu & Chú Rể (Thay thế cho font cũ nếu muốn đổi kiểu)
const pinyonScript = Pinyon_Script({
  variable: "--font-uonluon",
  subsets: ["latin"], // Lưu ý: Pinyon Script nguyên bản chuẩn Latin, dấu tiếng Việt hiển thị đẹp ở hầu hết các ký tự chính. Nếu lỗi ký tự đặc biệt, hãy dùng Alex_Brush hoặc Great_Vibes bên dưới.
  weight: ["400"],
});

// 2. Font uốn lượn phụ trợ hỗ trợ 100% tiếng Việt hoàn hảo
const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["vietnamese"],
  weight: ["400"],
});

// 3. Font có chân sang trọng cho các tiêu đề (Lễ Vu Quy, Thành Hôn, Địa Điểm)
const playfairDisplay = Playfair_Display({
  variable: "--font-serif-title",
  subsets: ["vietnamese"],
  style: ["italic", "normal"],
  weight: ["400", "700", "900"],
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});
export const metadata: Metadata = {
  title: "Thiệp Cưới Văn Trung & Thu Huệ",
  description: "Trân trọng kính mời quý khách tới dự buổi tiệc thành hôn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${alexBrush.variable} ${pinyonScript.variable} ${playfairDisplay.variable} ${greatVibes.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfbf7]">{children}<Script
          src="https://cdn.lordicon.com/lordicon.js"
          strategy="afterInteractive"
        /></body>
    </html>
  );
}