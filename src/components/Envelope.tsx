'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
}

export default function Envelope({ isOpen, onOpen }: EnvelopeProps) {
  const [doorOpen, setDoorOpen] = useState(false);

  const handleOpenClick = () => {
    if (doorOpen) return;
    setDoorOpen(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#dfd2d200]"
      initial={{ opacity: 1 }}
      animate={isOpen ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Background hình ảnh */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/SAM10649.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <motion.div
        className="relative w-full max-w-[980px] px-4 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#f87171]/40 bg-[#efa1a15b] shadow-[0_35px_90px_rgba(248,113,113,0.18)]">
          <div className="absolute inset-0 bg-[#f6f5f52b] z-0" />

          <motion.div
            className="relative flex h-[560px] flex-col overflow-hidden rounded-[2.5rem] sm:h-[620px] lg:h-[680px]"
            style={{ perspective: 1200 }}
            onClick={handleOpenClick}
          >
          
            {/* Cánh cửa bên trái - Hạ z-index xuống z-10 */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1/2 border-r border-[#fee2e2] bg-[#f009095b] px-8 py-10 text-white z-10"
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
              animate={doorOpen ? { rotateY: -90, x: '-100%', opacity: 0 } : { rotateY: 0, x: '0%', opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Cánh cửa bên phải - Hạ z-index xuống z-10 */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-1/2 border-l border-[#fee2e2] bg-[#f009095b] px-8 py-10 text-white z-10"
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
              animate={doorOpen ? { rotateY: 90, x: '100%', opacity: 0 } : { rotateY: 0, x: '0%', opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* LÒNG THIỆP CHỨA THÔNG TIN: Đã đẩy lên z-20 (nổi lên trên cửa) và thêm hiệu ứng zoom nhẹ khi mở */}
            <motion.div
              className="relative z-20 mx-auto flex h-full w-full max-w-[760px] flex-col items-center justify-center gap-8 px-6 text-center text-[#0c0b0b] sm:px-10"
              animate={doorOpen ? { scale: 1.02, y: -5 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="relative rounded-[2.5rem] border-2 border-[#d4af37]/30 bg-gradient-to-b from-[#fffaf2] to-[#fff1f2] px-6 py-10 text-center sm:px-12 overflow-hidden shadow-[0_20px_50px_rgba(139,22,22,0.15),inset_0_0_30px_rgba(137,22,22,0.03)] flex flex-col items-center justify-center w-full">
                
                {/* Hoa văn góc hoàng gia mạ vàng chìm ở 4 góc thiệp */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/30 rounded-tl-md pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/30 rounded-tr-md pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/30 rounded-bl-md pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/30 rounded-br-md pointer-events-none" />

                {/* 1. Tiêu đề lời mời */}
                <p className="font-serif text-2xl lg:text-3xl text-[#891616] tracking-wide">
                  Trân trọng kính mời
                </p>
                
                {/* 2. Trung tâm kiệt tác: Icon cặp nhẫn */}
                <div className="w-full flex items-center justify-center relative my-2 sm:my-4">
                  <svg 
                    viewBox="0 0 200 120" 
                    className="w-56 sm:w-72 md:w-80 lg:w-[24rem] h-auto filter drop-shadow-[0_6px_15px_rgba(185,130,38,0.25)] transition-all duration-300 z-10"
                  >
                    <g fill="none" stroke="#dc2626" strokeWidth="1" opacity="0.12">
                      <circle cx="100" cy="55" r="38" />
                      <path d="M78,55 C78,38 100,32 100,55 C100,32 122,38 122,55 C122,72 100,78 100,55 Z" />
                    </g>

                    <g stroke="#d4af37" strokeWidth="2.8" fill="none">
                      <circle cx="88" cy="55" r="21" className="drop-shadow-lg" />
                      <circle cx="112" cy="55" r="19" className="drop-shadow-lg" />
                    </g>
                    <path d="M112,32 L117,37 L112,42 L107,37 Z" fill="#d4af37" />
                    <circle cx="112" cy="37" r="1.2" fill="#ffffff" />

                    <path d="M35,80 Q70,62 100,80 Q130,98 165,80" stroke="#b08226" strokeWidth="1.5" fill="none" opacity="0.5" />
                    <path d="M84,77 Q100,62 116,77 Q100,92 84,77" fill="#dc2626" opacity="0.85" />
                  </svg>

                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent z-0 pointer-events-none" />
                </div>

                {/* 3. Slogan */}
                <div className="my-2 space-y-1">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#991b1c] tracking-wide py-1 drop-shadow-sm font-['UTM_Bikham']">
                    Happy Wedding Day
                  </p>
                  <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#b08226] font-bold mt-2 ">
                    ─ 21 . 07 . 2026 ─
                  </p>
                </div>

                {/* 4. Tên cặp đôi Huệ & Trung */}
                <div className="mt-6 sm:mt-8 w-full rounded-2xl border border-[#fecaca] bg-gradient-to-r from-[#fff1f2] via-[#fff5f5] to-[#fff1f2] px-6 py-5 shadow-[0_15px_35px_rgba(139,22,22,0.05)]">
                    <p className="text-[24px] md:text-[28px] text-[#b91c1c] flex items-center justify-center gap-3 font-['UTM_Bikham']">
                        <span className="inline-block pt-1">Thu Huệ & Văn Trung</span>
                    </p>
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}