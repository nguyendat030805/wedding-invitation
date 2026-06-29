'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HeartRain from './HeartRain';

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  type?: "bride" | "groom" | "guest"; // Thêm prop type để nhận diện trang
}

export default function Envelope({ isOpen, onOpen, type = "bride" }: EnvelopeProps) {
  const [doorOpen, setDoorOpen] = useState(false);

  // Cấu hình ngày giờ hiển thị trên bìa tương ứng với từng thiệp
  const dateConfig = {
    groom: {
      timeText: "Thứ 5 - 11:00",
      dateText: "23.07.2026",
      img: "/anh-a;bum11.jpg"
    },
    bride: {
      timeText: "Thứ 3 - 11:00",
      dateText: "21.07.2026",
      img: "/anh_bia4.jpg"
    },
    guest: {
      timeText: "Chủ Nhật - 18:00",
      dateText: "01.08.2026",
      img: "/anh-a;bum11.jpg"
    }
  };

  const currentDate = dateConfig[type];

  const handleOpenClick = () => {
    if (doorOpen) return;
    setDoorOpen(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/40 backdrop-blur-sm sm:p-4 overflow-y-auto"
      initial={{ opacity: 1 }}
      animate={isOpen ? { opacity: 0, scale: 1.05, pointerEvents: 'none' } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="pointer-events-none fixed inset-0 z-50">
        <HeartRain />
      </div>
      <motion.div
        className="relative w-full max-w-[440px] min-h-screen sm:min-h-[720px] sm:h-[85vh] bg-white sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden border-x sm:border border-amber-100 flex flex-col justify-between pt-16 pb-12 px-6 text-center cursor-pointer select-none my-auto"
        onClick={handleOpenClick}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* ================= 1. HÌNH ẢNH NỀN BÌA TOÀN CẢNH ================= */}
        <div className="absolute inset-0 z-0">
          <Image
            src={currentDate.img}
            alt="Wedding Background Cover"
            fill
            className="object-cover"
            priority
          />
          {/* Lớp phủ mờ tổng thể (Gradient tinh tế bảo vệ text phần trên) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/70" />
        </div>

        {/* ================= CONTAINER PHẦN TRÊN (TOP CONTENT) ================= */}
        <div className="relative pt-6 z-10 w-full flex flex-col items-center">
          {/* Tiêu đề đứng */}
          <p className="text-stone-800 font-bold tracking-[0.3em] font-['UTM_Bikham'] text-3xl  mb-3  drop-shadow-sm">
            Save The Date
          </p>
        </div>

        {/* ================= CONTAINER PHẦN DƯỚI (BOTTOM CONTENT) ================= */}
        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* KHỐI NỀN VÀ LỚP PHỦ GRADIENT RIÊNG BIỆT ĐỂ NỔI BẬT NGÀY THÁNG */}
          <div className="w-full bg-black/0 backdrop-blur-md rounded-2xl border border-white/20 p-5 shadow-lg relative overflow-hidden mb-6">
            
            {/* Nút thắt đồng tâm & Ngày tháng nằm gọn bên trong hộp mờ */}
            <div className="flex items-center justify-center gap-12 relative w-full text-white">
              <div className="text-amber-300 absolute left-2 sm:left-4 drop-shadow-md">
                <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2v10M12 12c-2-2-4-2-4 0s2 3 4 4m0-4c2-2 4-2 4 0s-2 3-4 4m0 0c-2 1-4 2-4 4s2 2 4 0m0 0c2 1 4 2 4 4s-2 2-4 0m0 0v12" strokeLinecap="round"/>
                  <circle cx="12" cy="14" r="1" fill="currentColor"/>
                </svg>
              </div>
              
              <div className="text-center z-10 font-['UTM_Bikham'] ">
                <p className="text-amber-200 font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase drop-shadow">
                  {currentDate.timeText}
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-white tracking-wider mt-1.5 drop-shadow-md">
                  {currentDate.dateText}
                </p>
              </div>

              <div className="text-amber-300 absolute right-2 sm:right-4 drop-shadow-md">
                <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2v10M12 12c-2-2-4-2-4 0s2 3 4 4m0-4c2-2 4-2 4 0s-2 3-4 4m0 0c-2 1-4 2-4 4s2 2 4 0m0 0c2 1 4 2 4 4s-2 2-4 0m0 0v12" strokeLinecap="round"/>
                  <circle cx="12" cy="14" r="1" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Dòng chữ hiệu ứng chạm để mở */}
          <p className="text-xs text-gray-200/90 font-medium tracking-widest uppercase animate-bounce drop-shadow-md">
            Chạm để mở thiệp cưới • Click to Open
          </p>
        </div>

      </motion.div>
    </motion.div>
  );
}