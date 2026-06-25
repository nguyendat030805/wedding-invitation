'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from 'react-countdown';
import Envelope from './Envelope';
import HeartRain from './HeartRain';
import { submitWish } from '@/app/actions';

// Swiper Slide Banner
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

interface Wish {
  id: number;
  name: string;
  relationship: string;
  content: string;
  createdAt: Date;
}

export default function MainContent({ initialWishes }: { initialWishes: Wish[] }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMap, setActiveMap] = useState<'groom' | 'bride'>('groom');
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [statusMessage, setStatusMessage] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setWishes(initialWishes);
  }, [initialWishes]);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => console.log('Chờ người dùng tương tác để mở nhạc'));
    }
  };

  const handleToggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  // Quản lý trạng thái ảnh đang phóng to
  const [activeImgIndex, setActiveImgIndex] = useState<number | null>(null);

  const images = [
    '/SAM10649.jpg',
    '/SAM10649.jpg',
    '/SAM10649.jpg',
    '/SAM10649.jpg',
    '/SAM10649.jpg',
    '/SAM10649.jpg',
    '/SAM10649.jpg',
    '/SAM10649.jpg',
  ];

  // Hàm xử lý chuyển ảnh
  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation(); // Không làm đóng modal
    if (activeImgIndex !== null) {
      setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
    }
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation(); // Không làm đóng modal
    if (activeImgIndex !== null) {
      setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
    }
  };
  const countdownRenderer = ({ days, hours, minutes, seconds }: any) => {
  const timeUnits = [
    { label: 'Ngày', value: days },
    { label: 'Giờ', value: hours },
    { label: 'Phút', value: minutes },
    { label: 'Giây', value: seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-6 justify-center items-center max-w-2xl mx-auto px-2 select-none">
      {timeUnits.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 max-w-[100px]">
          {/* Vòng tròn số với hiệu ứng đổ bóng Neon Rose phát sáng mềm mại */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-rose-100 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(225,29,72,0.06)] backdrop-blur-sm overflow-hidden group">
            
            {/* Hiệu ứng tia sáng chạy ngầm khi hover hoặc tự động kích hoạt ở kim giây */}
            <div className={`absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${item.label === 'Giây' ? 'animate-pulse opacity-40' : ''}`} />
            
            {/* Sử dụng AnimatePresence để tạo hiệu ứng đổi số nhảy mượt mà (Fade/Slide từ trên xuống) */}
            <div className="relative h-7 sm:h-9 overflow-hidden flex items-center justify-center w-full">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={item.value}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight tabular-nums drop-shadow-[0_2px_10px_rgba(225,29,72,0.15)]"
                >
                  {String(item.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Thanh gạch ngang mờ chia đôi hộp số chuẩn phong cách đồng hồ cổ điển sang trọng */}
            <div className="absolute left-0 right-0 h-[1px] bg-rose-100/40 top-1/2 -translate-y-1/2" />
          </div>
          
          {/* Nhãn chữ phía dưới */}
          <span className="text-[10px] sm:text-xs font-bold mt-3 uppercase tracking-[0.2em] text-rose-600/80 font-sans">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

  return (
    <>
      {!isOpened && <Envelope isOpen={isOpened} onOpen={handleOpenInvitation} />}
      <audio ref={audioRef} src="/music/wedding-song.mp3" loop />

      {isOpened && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }} 
          className="w-full bg-[#FCF8F8] min-h-screen text-gray-800 overflow-x-hidden"
        >
          <div className="pointer-events-none fixed inset-0 z-50">
            <HeartRain />
        </div>

          {/* ================= CỤM PHÍM ĐIỀU HƯỚNG NỔI SVG (FLOATING NAV NAV) ================= */}
{/* ================= CỤM PHÍM ĐIỀU HƯỚNG NỔI SVG ĐẦY ĐỦ 6 NÚT (FLOATING NAV NAV) ================= */}
<div className="fixed bottom-6 right-6 z-[99] flex flex-col gap-3.5 items-center select-none">
  
  {/* Nút 1: Bản đồ Hôn Lễ */}
  <button
    onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
    className="w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur-md border border-rose-100 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-rose-50/50 hover:scale-110 active:scale-95 transition-all group relative text-[#BE123C]"
    title="Xem Bản Đồ"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 md:w-[22px] md:h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
    <span className="absolute right-14 bg-gray-900/85 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md tracking-wider">
      Bản Đồ Hôn Lễ
    </span>
  </button>

  {/* Nút 2: MỚI - Câu Chuyện Tình Yêu */}
  <button
    onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}
    className="w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur-md border border-rose-100 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-rose-50/50 hover:scale-110 active:scale-95 transition-all group relative text-[#BE123C]"
    title="Câu Chuyện Tình Yêu"
  >
    {/* SVG Icon Cuốn Sách Trái Tim Kể Chuyện */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 md:w-[22px] md:h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
    </svg>
    <span className="absolute right-14 bg-gray-900/85 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md tracking-wider">
      Câu Chuyện Tình Yêu
    </span>
  </button>

  {/* Nút 3: Album Ảnh */}
  <button
    onClick={() => document.getElementById('album-section')?.scrollIntoView({ behavior: 'smooth' })}
    className="w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur-md border border-rose-100 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-rose-50/50 hover:scale-110 active:scale-95 transition-all group relative text-[#BE123C]"
    title="Album Ảnh"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 md:w-[22px] md:h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0Z" />
    </svg>
    <span className="absolute right-14 bg-gray-900/85 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md tracking-wider">
      Album Ảnh Cưới
    </span>
  </button>

  {/* Nút 4: MỚI - Hộp Quà Mừng Cưới */}
  <button
    onClick={() => document.getElementById('wedding-gift-section')?.scrollIntoView({ behavior: 'smooth' })}
    className="w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur-md border border-rose-100 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-rose-50/50 hover:scale-110 active:scale-95 transition-all group relative text-[#BE123C]"
    title="Hộp Quà Mừng Cưới"
  >
    {/* SVG Icon Hộp Quà Thắt Nơ May Mắn */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 md:w-[22px] md:h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0-2.625V7.5m0 0h-9.375c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125H12m0-4.5h9.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H12M12 7.5v14.25" />
    </svg>
    <span className="absolute right-14 bg-gray-900/85 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md tracking-wider">
      Hộp Quà Mừng Cưới
    </span>
  </button>

  {/* Nút 5: Viết lời chúc */}
  <button
    onClick={() => document.getElementById('wishes-section')?.scrollIntoView({ behavior: 'smooth' })}
    className="w-11 h-11 md:w-12 md:h-12 bg-white/90 backdrop-blur-md border border-rose-100 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-rose-50/50 hover:scale-110 active:scale-95 transition-all group relative text-[#BE123C]"
    title="Gửi Lời Chúc"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 md:w-[22px] md:h-[22px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
    <span className="absolute right-14 bg-gray-900/85 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md tracking-wider">
      Gửi Lời Chúc Mừng
    </span>
  </button>

  {/* Nút 6: Đĩa Nhạc Gốc (Dưới cùng) */}
  <button
    onClick={handleToggleMusic}
    className={`w-13 h-13 md:w-14 md:h-14 bg-gradient-to-br from-[#E11D48] to-rose-600 text-white rounded-full shadow-[0_10px_30px_rgba(225,29,72,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${isPlaying ? 'animate-spin' : ''}`}
    style={{ animationDuration: '6s' }}
    title={isPlaying ? 'Tắt Nhạc' : 'Mở Nhạc'}
  >
    {isPlaying ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 animate-pulse">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0v11.25A2.25 2.25 0 0117.25 19.5h-.75a2.25 2.25 0 01-2.25-2.25V15a2.25 2.25 0 012.25-2.25h.75m0-3V3.375c0-.621-.504-1.125-1.125-1.125h-9.75c-.621 0-1.125.504-1.125 1.125V13.5M9 9V20.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 20.25V15.75A2.25 2.25 0 016 13.5h.75a2.25 2.25 0 012.25 2.25v2.25" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V3.75z" />
      </svg>
    )}
  </button>

</div>
            
          {/* ================= PHẦN 1: BANNER CHÍNH (HERO SECTION) ================= */}
          <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Background Slideshow với lớp phủ mờ nhẹ tinh tế */}
            <div className="absolute inset-0 z-0 bg-white/10">
              <Swiper modules={[Autoplay, EffectFade]} effect="fade" autoplay={{ delay: 3500 }} className="h-full w-full">
                <SwiperSlide><img src="/SAM10649.jpg" className="w-full h-full object-cover" alt="Slide 1" /></SwiperSlide>
                <SwiperSlide><img src="/SAM10649.jpg" className="w-full h-full object-cover" alt="Slide 2" /></SwiperSlide>
              </Swiper>
              {/* Lớp overlay trắng nhạt phủ lên ảnh tạo cảm giác thơ mộng */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#FCF8F8]" />
            </div>

            {/* Chữ Happy Wedding Cách Điệu Đỏ Nhung sang trọng nổi bật trên nền sáng */}
            <div className="relative z-10 space-y-2">
                {/* Dùng class font-uonluon lấy trực tiếp từ Google Fonts */}
                <p className="text-[100px] sm:text-[100px] md:text-[130px] lg:text-[150px] text-[#fefefe] font-uonluon leading-none pb-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                    Happy Wedding
                </p>
                <div className="w-50 h-[1.5px] bg-gradient-to-r from-transparent via-[#fefefe] to-transparent mx-auto my-4" />
                <p className="font-uonluon text-[50px] sm:text-[70px] tracking-[0.3em]  text-[#fefefe]">
                    Thu Huệ & Văn Trung
                </p>
            </div>
            
            {/* Mũi tên gợi ý cuộn xuống */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-[#fefefe]/60 text-sm tracking-widest font-semibold uppercase">
              <span className="block mb-1 text-[11px]">Cuộn xuống</span>
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </section>


          {/* ================= PHẦN 2: CARD NỘI DUNG THÔNG TIN CHI TIẾT (Trắng nhạt trong suốt) ================= */}
          <section className="relative w-full py-16 md:py-24 px-4 flex items-center justify-center bg-gradient-to-b from-[#FCF8F8] via-[#FFF1F2] to-[#FCF8F8]">
            
            {/* Card Kính Mờ Màu Trắng Sữa Nhẹ Nhàng phối viền hồng cam tinh tế */}
            <div className="relative z-10 bg-white/70 backdrop-blur-xl border border-rose-200/60 p-6 sm:p-10 md:p-16 rounded-[2.5rem] max-w-7xl w-full shadow-[0_20px_50px_rgba(225,29,72,0.05)] mx-auto">
              
              {/* 1. THÔNG TIN HAI BÊN GIA ĐÌNH */}
              <div className="grid grid-cols-2 gap-6 sm:gap-12 text-[24px] sm:text-[24px] md:text-[28px] text-gray-800 mb-10 border-b border-rose-200/50 pb-8 font-sans text-center">
  
                {/* Nhà Gái */}
                <div className="space-y-1.5">
                    <p className="text-[#BE123C]  text-[18px] sm:text-[18px] font-['UTM_Bikham'] md:text-[20px] font-bold tracking-wider mb-1">Nhà Gái</p>
                    <p className="font-medium font-['UTM_Bikham'] text-gray-700">Ông: <span className="font-bold font-['UTM_Bikham'] text-gray-950">TRẦN QUANG HIỂN</span></p>
                    <p className="font-medium font-['UTM_Bikham'] text-gray-700">Bà: <span className="font-bold font-['UTM_Bikham'] text-gray-950">DƯƠNG THỊ LÊ</span></p>
                    <p className="text-[18px] sm:text-[18px] md:text-[20px] text-gray-500 font-['UTM_Bikham'] leading-relaxed mt-2 pt-2 border-t border-rose-100">
                    Thôn Tân Bằng - Xã Tân Mỹ<br />Tỉnh Quảng Trị (Quảng Bình cũ)
                    </p>
                </div>
                
                {/* Nhà Trai */}
                <div className="space-y-1.5">
                    <p className="text-[#BE123C]  text-[18px] sm:text-[18px] font-['UTM_Bikham'] md:text-[20px] font-bold tracking-wider mb-1">Nhà Trai</p>
                    <p className="font-medium  font-['UTM_Bikham'] text-gray-700">Ông: <span className="font-bold  font-['UTM_Bikham'] text-gray-950">HỒ VĂN HÙNG</span></p>
                    <p className="font-medium font-['UTM_Bikham'] text-gray-700">Bà: <span className="font-bold font-['UTM_Bikham'] text-gray-950">LÊ THỊ CHINH</span></p>
                    <p className="text-[18px] sm:text-[18px] md:text-[20px] text-gray-500 font-['UTM_Bikham'] leading-relaxed mt-2 pt-2 border-t border-rose-100">
                    Xóm Vụng Chùa - Xã Thiên Nhẫn<br />Tỉnh Nghệ An
                    </p>
                </div>

                </div>

              {/* 2. TIÊU ĐỀ LỜI MỜI */}
              <div className="space-y-1.5 mb-8 sm:mb-10 font-sans text-center">
                <p className="text-xs sm:text-sm tracking-[0.25em] text-gray-500 font-['UTM_Bikham'] font-medium uppercase">Trân trọng báo tin</p>
                <p className="text-3xl sm:text-4xl font-['UTM_Bikham'] font-black text-[#BE123C] tracking-[0.15em] uppercase">Lễ Vu Quy</p>
              </div>

              {/* 3. TRUNG TÂM: LAYOUT TÊN CẶP ĐÔI + CHỮ HỶ ĐỎ */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-2 md:gap-8 my-8 sm:my-12 w-full text-center">
                {/* Khối Cô Dâu */}
                <div className="flex flex-col items-center sm:items-end flex-1 w-full sm:w-auto">
                  <p className="text-[50px] md:text-[50px] lg:text-[70px] text-[#BE123C] font-uonluon leading-none whitespace-nowrap">
                    Thu Huệ
                  </p>
                  <p className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mt-2 sm:mt-2 sm:mr-4">
                    Trưởng Nữ
                  </p>
                </div>

                {/* Icon Chữ Hỷ Đỏ làm tâm điểm quý phái */}
                <div className="flex-shrink-0 my-2 sm:my-0">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#BE123C" className="w-12 h-12 md:w-14 md:h-14 filter drop-shadow-[0_2px_4px_rgba(225,18,60,0.15)]">
                    <path d="M3 4v3h4v3H2v3h5v7h3v-7h4v7h3v-7h5v-3h-5v-3h4V4H3zm6 3h3v3H9V7zm0 6h3v4H9v-4zm6-6h3v3h-3V7zm0 6h3v4h-3v-4z"/>
                  </svg>
                </div>

                {/* Khối Chú Rể */}
                <div className="flex flex-col items-center sm:items-start flex-1 w-full sm:w-auto">
                  <p className="text-[50px] md:text-[50px] lg:text-[70px] text-[#BE123C] font-uonluon leading-none whitespace-nowrap">
                    Văn Trung
                  </p>
                  <p className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mt-2 sm:mt-2 sm:ml-4">
                    Trưởng Nam
                  </p>
                </div>
              </div>

              {/* 4. ĐỊA ĐIỂM & THỜI GIAN TỔ CHỨC */}
              <div className="mt-8 pt-8 border-t border-rose-200/50 space-y-3 font-sans text-center">
                <p className="text-gray-400 text-[11px] sm:text-xs tracking-[0.25em] uppercase">Hôn lễ được cử hành tại:</p>
                <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-wide uppercase">Tư Gia Nhà Nữ</p>
                
                <div className="space-y-2 pt-2">
                  <p className="text-gray-700 font-medium text-xs sm:text-sm tracking-widest uppercase">
                    Vào lúc <span className="text-[#BE123C] font-bold">09</span> giờ <span className="text-[#BE123C] font-bold">00</span> phút - Thứ Ba
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-[#BE123C] tracking-widest">
                    21/07/2026
                  </p>
                  <p className="text-gray-400 text-[11px] sm:text-xs italic tracking-wider">
                    Nhằm ngày 08/06 ( Bính Ngọ )
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 2: THANH NGÀY GIỜ ĐẾM NGƯỢC */}
         {/* ================= SECTION: ĐẾM NGƯỢC KÈM BẢNG LỊCH THÁNG (MINI CALENDAR) ================= */}
<section id="countdown-section" className="relative bg-gradient-to-b from-[#FCF8F8] via-[#FFF1F2]/50 to-[#FCF8F8] py-20 px-4 overflow-hidden border-y border-rose-100/40 font-sans">
      {/* --- 2. TIÊU ĐỀ CHỮ VIẾT TAY --- */}
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="w-6 h-[1px] bg-rose-300" />
      <h3 className="text-rose-700/80 font-bold tracking-[0.2em] font-['UTM_Bikham'] text-2xl md:text-3xl">
        Cùng Đếm Ngược Thời Gian
      </h3>
      <div className="w-6 h-[1px] bg-rose-300" />
    </div>
  {/* Biểu tượng trang trí bay nhẹ ở nền */}
  <div className="absolute top-8 left-[8%] opacity-20 animate-bounce text-rose-400 text-lg hidden md:block" style={{ animationDuration: '5s' }}>✨</div>
  <div className="absolute bottom-10 right-[10%] opacity-30 animate-pulse text-rose-400 text-xl hidden md:block" style={{ animationDuration: '4s' }}>♥</div>

  <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center">
    
    {/* --- 1. THIẾT KẾ BẢNG LỊCH THÁNG THỰC TẾ (AUGUST 2026 CALENDAR) --- */}
    <div className="mb-12 w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(190,18,60,0.05)] border border-rose-100/40 relative overflow-hidden">
      
      {/* Tên tháng & năm */}
      <div className="text-center mb-6">
        <h4 className="text-gray-900 font-extrabold text-lg tracking-widest uppercase">
          Tháng 07 / 2026
        </h4>
        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mt-0.5">
          July Wedding
        </p>
      </div>

      {/* Hàng tiêu đề Thứ trong tuần (T2 - CN) */}
      <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-bold text-gray-400 border-b border-gray-100 pb-3 mb-3">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
          <div key={day} className={day === 'CN' ? 'text-rose-500/70' : ''}>{day}</div>
        ))}
      </div>

      {/* Lưới chứa các ngày trong tháng 8/2026 */}
      {/* Tháng 8/2026 bắt đầu vào Thứ Bảy, tức là cần 5 ô trống ban đầu (T2->T6 trống) */}
      <div className="grid grid-cols-7 gap-y-3.5 text-center text-xs font-semibold text-gray-700 relative z-10">
        
        {/* 5 ô trống đầu tháng */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`empty-${i}`} className="opacity-0" />
        ))}

        {/* Vòng lặp hiển thị từ ngày 1 đến ngày 31 */}
        {Array.from({ length: 31 }).map((_, i) => {
          const dayNumber = i + 1;
          const isWeddingDay = dayNumber === 21; // Ngày cưới: mùng 3 tháng 8

          return (
            <div key={dayNumber} className="flex items-center justify-center relative h-8">
              {isWeddingDay ? (
                /* Ô NGÀY CƯỚI: Khoanh vùng trái tim màu đỏ phát sáng lãng mạn */
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 w-8 h-8 mx-auto bg-gradient-to-br from-[#BE123C] to-rose-500 text-white rounded-full flex flex-col items-center justify-center font-bold shadow-[0_6px_20px_rgba(190,18,60,0.35)] cursor-pointer z-20"
                >
                  <span className="leading-none text-[13px]">{dayNumber}</span>
                  {/* Icon trái tim nhỏ xíu nằm dưới chân số ngày cưới */}
                  <span className="text-[7px] leading-none mt-0.5">♥</span>
                </motion.div>
              ) : (
                /* Các ngày bình thường khác */
                <span className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors cursor-default ${
                  // Tô hồng nhạt ngày chủ nhật để giống lịch thực tế
                  (dayNumber + 5) % 7 === 0 ? 'text-rose-500 font-bold' : ''
                }`}>
                  {dayNumber}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Con dấu chữ Hỷ chìm trang trí nền lịch */}
      <div className="absolute -right-4 -bottom-4 text-rose-600/[0.03] text-8xl font-serif pointer-events-none select-none">
        囍
      </div>
    </div>



    {/* --- 3. KHỐI ĐẾM NGƯỢC THỜI GIAN (COUNTDOWN ROW) --- */}
    <div className="w-full bg-white/50 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white/80 shadow-[0_20px_50px_-20px_rgba(225,29,72,0.06)]">
      <Countdown date={new Date('2026-08-03T11:00:00')} renderer={countdownRenderer} />
    </div>
    
  </div>
</section>

          {/* SECTION 3: ALBUM ẢNH CƯỚI */}
          <section id="album-section" className="py-24 px-4 max-w-7xl mx-auto font-sans rounded-[3rem] my-20">
  
  {/* --- TIÊU ĐỀ NGHỆ THUẬT --- */}
  <div className="text-center mb-16 relative">
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[120px] font-black text-rose-50 opacity-[0.03] select-none">
      Gallery
    </span>
    <h2 className="relative font-['UTM_Bikham'] text-5xl md:text-6xl text-[#BE123C] font-normal mb-2 drop-shadow-sm">
      Album Ảnh Cưới
    </h2>
    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-4" />
    <p className="text-xs tracking-[0.4em] text-gray-500 font-semibold uppercase">
      Lưu giữ kỷ niệm đẹp
    </p>
  </div>
  
  {/* --- LƯỚI HIỂN THỊ ẢNH (TỐI ĐA 6 TẤM) --- */}
  <div className="columns-2 md:columns-3 gap-6 space-y-6">
    {images.slice(0, 6).map((src, index) => {
      // Kiểm tra xem đây có phải là tấm ảnh cuối cùng hiển thị (tấm thứ 6) và mảng ảnh gốc còn nhiều hơn không
      const isLastVisible = index === 5 && images.length > 6;

      return (
        <motion.div 
          key={index} 
          onClick={() => setActiveImgIndex(index)} // Mở modal tại đúng vị trí ảnh được click
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="break-inside-avoid overflow-hidden rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-rose-100/50 cursor-pointer group bg-white relative transition-all duration-300 hover:shadow-[0_20px_50px_rgba(225,29,72,0.12)] hover:-translate-y-1"
        >
          <img
            src={src}
            alt={`Wedding Image ${index + 1}`}
            className="w-full h-auto object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110 group-hover:rotate-1"
          />
          
          {isLastVisible ? (
            /* LỚP PHỦ ĐẶC BIỆT CHO TẤM THỨ 6: LUÔN HIỂN THỊ CHỮ "XEM TẤT CẢ" */
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/70 flex flex-col items-center justify-center text-white gap-2 text-center p-4">
              <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xl shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25A2.25 2.25 0 0 1 21.75 21H2.25A2.25 2.25 0 0 1 0 18.75v-4.25A2.25 2.25 0 0 1 2.25 13.5Zm0-3h18A2.25 2.25 0 0 0 24 8.25v-4.25A2.25 2.25 0 0 0 21.75 1.75H2.25A2.25 2.25 0 0 0 0 4.25v4.25A2.25 2.25 0 0 0 2.25 10.5Z" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-[0.2em] uppercase">Xem Tất Cả</span>
              <span className="text-[10px] text-white/60 font-medium tracking-wider">+{images.length - 5} hình ảnh</span>
            </div>
          ) : (
            /* LỚP PHỦ HOVER CHO CÁC TẤM BÌNH THƯỜNG (1 ĐẾN 5) */
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner transform scale-90 group-hover:scale-100 transition-transform duration-500 text-white text-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <span className="absolute bottom-5 left-6 text-white text-sm font-medium tracking-wider">
                Xem ảnh {index + 1}
              </span>
            </div>
          )}
        </motion.div>
      );
    })}
  </div>

  {/* ================= LIGHTBOX CAROUSEL MODAL (HIỂN THỊ TOÀN BỘ MẢNG ẢNH GỐC) ================= */}
  <AnimatePresence>
    {activeImgIndex !== null && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setActiveImgIndex(null)}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl select-none"
      >
        {/* Nút Đóng */}
        <button 
          onClick={() => setActiveImgIndex(null)}
          className="absolute top-6 right-6 z-[120] w-12 h-12 rounded-full bg-white/10 hover:bg-rose-600/80 flex items-center justify-center text-white transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Mũi tên Trái (<) */}
        <button
          onClick={handlePrevImg}
          className="absolute left-4 md:left-8 z-[110] w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Khung Ảnh Hiện Tại */}
        <div className="relative max-w-5xl max-h-[85vh] p-2 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImgIndex}
              src={images[activeImgIndex]} // Đọc từ mảng "images" gốc đầy đủ
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              alt="Wedding Zoomed"
              className="max-w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-white/10"
            />
          </AnimatePresence>

          {/* Số thứ tự ảnh thực tế trên tổng số ảnh gốc */}
          <div className="text-white/60 text-xs font-semibold tracking-widest mt-4 bg-black/40 px-3 py-1 rounded-full border border-white/5">
            {activeImgIndex + 1} / {images.length}
          </div>
        </div>

        {/* Mũi tên Phải (>) */}
        <button
          onClick={handleNextImg}
          className="absolute right-4 md:right-8 z-[110] w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      </motion.div>
    )}
  </AnimatePresence>
</section>

          {/* ================= SECTION 4: BẢN ĐỒ & THÔNG TIN ĐỊA ĐIỂM NÂNG CẤP ================= */}
{/* ================= SECTION 4: BẢN ĐỒ & THÔNG TIN ĐỊA ĐIỂM ================= */}
<section id="map-section" className="py-24 bg-gradient-to-b from-[#FCF8F8] via-[#FFF1F2]/60 to-[#FCF8F8] border-y border-rose-100/40 px-4 font-sans overflow-hidden">
  <div className="max-w-7xl mx-auto">
    
    {/* --- TIÊU ĐỀ SECTION --- */}
    <div className="text-center mb-12">
      <h2 className="font-['UTM_Bikham'] text-4xl md:text-5xl text-[#BE123C] mb-2">
        Đường Đến Hôn Lễ
      </h2>
      <p className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase">
        Rất hân hạnh được đón tiếp quý khách
      </p>
    </div>

    {/* --- THANH CHUYỂN TAB ĐỔI NHÀ CHÚ RỂ / CÔ DÂU --- */}
    <div className="flex justify-center gap-4 mb-10">
      {[
        { type: 'groom', label: 'Nhà Chú Rể' },
        { type: 'bride', label: 'Nhà Cô Dâu' }
      ].map((item) => (
        <button
          key={item.type}
          onClick={() => setActiveMap(item.type as any)}
          className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 border ${
            activeMap === item.type
              ? 'bg-[#BE123C] border-[#BE123C] text-white shadow-[0_10px_20px_rgba(190,18,60,0.15)] scale-105'
              : 'bg-white border-rose-100 text-gray-500 hover:text-[#BE123C] hover:border-rose-300'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>

    {/* --- BỐ CỤC CHÍNH: 2 CỘT (THÔNG TIN BÊN TRÁI - BẢN ĐỒ BÊN PHẢI) --- */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* CỘT TRÁI (CHIẾM 5/12 CỘT): KHỐI THÔNG TIN TƯ GIA THEO TAB */}
      <div className="lg:col-span-5 flex">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMap}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-rose-100/50 shadow-[0_15px_40px_rgba(225,29,72,0.03)] flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Họa tiết trang trí chìm phía sau tạo điểm nhấn nghệ thuật */}
            <div className="absolute -right-6 -bottom-6 text-7xl opacity-[0.03] text-[#BE123C] pointer-events-none select-none">
              ♥
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase">
                  {activeMap === 'groom' ? 'Tiệc Nhà Trai' : 'Tiệc Nhà Gái'}
                </span>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-wide mt-4">
                  {activeMap === 'groom' ? 'Tư Gia Nhà Trai' : 'Tư Gia Nhà Nữ'}
                </h3>
              </div>

              {/* Chi tiết đại diện gia đình & địa chỉ */}
              <div className="space-y-3 text-sm text-gray-600 border-t border-rose-100/60 pt-4">
                {activeMap === 'groom' ? (
                  <>
                    <p className="font-medium">Đại diện nhà trai:</p>
                    <p className="text-gray-900 font-bold text-base">Ông: HỒ VĂN HÙNG & Bà: LÊ THỊ CHINH</p>
                    <p className="flex items-start gap-2 mt-2">
                      <span>📍</span>
                      <span>Xóm Vụng Chùa - Xã Thiên Nhẫn, Tỉnh Nghệ An</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Đại diện nhà gái:</p>
                    <p className="text-gray-900 font-bold text-base">Ông: TRẦN QUANG HIỂN & Bà: DƯƠNG THỊ LÊ</p>
                    <p className="flex items-start gap-2 mt-2">
                      <span>📍</span>
                      <span>Thôn Tân Bằng - Xã Tân Mỹ, Tỉnh Quảng Trị</span>
                    </p>
                  </>
                )}
              </div>

              {/* Lịch tổ chức cụ thể rút gọn */}
              <div className="bg-rose-50/40 border border-rose-100/40 p-4 rounded-2xl space-y-1">
                <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">Thời gian cử hành:</p>
                <p className="text-sm font-bold text-gray-800">
                  {activeMap === 'groom' ? '11:00 Trưa - Thứ Hai' : '09:00 Sáng - Thứ Ba'}
                </p>
                <p className="text-sm font-extrabold text-[#BE123C]">
                  {activeMap === 'groom' ? '03/08/2026' : '21/07/2026'}
                </p>
              </div>
            </div>

            {/* KHỐI NÚT HÀNH ĐỘNG (XEM MAPS & THÊM LỊCH GOOGLE) */}
            <div className="mt-8 space-y-3">
              {/* Nút 1: Mở Google Maps ứng dụng ngoài */}
              <a
                href={activeMap === 'groom' 
                  ? "https://maps.google.com/?q=Thien+Nhan,+Nghe+An,+Vietnam" 
                  : "https://www.google.com/maps?q=17.1986799,106.8454512"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-[#BE123C] to-rose-600 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest text-center shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 animate-bounce">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.446l6.002-3.466a2.25 2.25 0 001.072-1.922V3.479a2.25 2.25 0 00-2.835-2.155L15.93 2.914a1.125 1.125 0 01-.86 0L8.717 1.42a1.125 1.125 0 00-.86 0L1.757 3.669A2.25 2.25 0 000 5.824v11.103a2.25 2.25 0 001.072 1.922l6.002 3.466a2.25 2.25 0 002.186 0l5.443-3.143a1.125 1.125 0 01.86 0z" />
                </svg>
                Xem Bản Đồ Lớn
              </a>

              {/* Nút 2: THÊM MỚI - Thêm Sự Kiện Vào Google Calendar */}
              <a
                href={activeMap === 'groom'
                  ? "https://calendar.google.com/calendar/render?action=TEMPLATE&text=L%E1%BB%85+Th%C3%A0nh+H%C3%B4n%3A+V%C4%83n+Trung+%26+Thu+Hu%E1%BB%87+%28Nh%C3%A0+Trai%29&dates=20260803T110000/20260803T150000&details=Tr%C3%A2n+tr%E1%BB%8Dng+k%C3%ADnh+m%E1%BB%9Di+b%E1%BA%A1n+%C4%91%E1%BA%BFn+d%E1%BB%B1+b%E1%BB%AFa+c%C6%A1m+th%C3%A2n+m%E1%BA%ADt+m%E1%BB%ABng+ngh%C3%A0y+vui+c%E1%BB%A7a+ch%C3%BAng+m%C3%ACnh%21&location=X%C3%B3m+V%E1%BB%A5ng+Ch%C3%B9a+-+X%C3%A3+Thi%C3%AAn+Nh%E1%BB%85n%2C+T%E1%BB%89nh+Ngh%E1%BB%87+An"
                  : "https://calendar.google.com/calendar/render?action=TEMPLATE&text=L%E1%BB%85+Vu+Quy%3A+Thu+Hu%E1%BB%87+%26+V%C4%83n+Trung+%28Nh%C3%A0+G%C3%A1i%29&dates=20260721T090000/20260721T130000&details=Tr%C3%A2n+tr%E1%BB%8Dng+k%C3%ADnh+m%E1%BB%9Di+b%E1%BA%A1n+%C4%91%E1%BA%BFn+d%E1%BB%B1+l%E1%BB%85+Vu+Quy+v%C3%A0+chung+vui+c%C3%B9ng+gia+%C4%91%C3%ACnh+ch%C3%BAng+m%C3%ACnh%21&location=Th%C3%B4n+T%C3%A2n+B%E1%BA%B1ng+-+X%C3%A3+T%C3%A2n+M%E1%BB%B3%2C+T%E1%BB%89nh+Qu%E1%BA%A3ng+Tr%E1%BB%8B"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-white border border-rose-200 text-[#BE123C] hover:bg-rose-50 rounded-xl font-bold text-xs uppercase tracking-widest text-center shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                {/* SVG Icon Cuốn Lịch (Calendar) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                </svg>
                Thêm Vào Lịch Google
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CỘT PHẢI (CHIẾM 7/12 CỘT): KHUNG BẢN ĐỒ GOOGLE MAPS EMBED */}
      <div className="lg:col-span-7 h-[450px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white border-4 border-white relative group">
        <iframe
          src={activeMap === 'groom' 
            ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58139.80322414609!2d105.51374510853805!3d18.598791072331796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139c65bfb76667f%3A0xbff3675c728b0102!2sThien%20Nhan%2C%20Nghe%20An%2C%20Vietnam!5e1!3m2!1sen!2s!4v1782379775558!5m2!1sen!2s"
            : "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d915.6327299252574!2d106.8454512752608!3d17.198679996344826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDExJzU1LjMiTiAxMDbCsDUwJzQ4LjAiRQ!5e1!3m2!1sen!2s!4v1782379574958!5m2!1sen!2s"
          }
          className="w-full h-full border-0 rounded-2xl transition-all duration-500"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

    </div>
  </div>
</section>
{/* ================= SECTION: CÂU CHUYỆN TÌNH YÊU (LOVE STORY BLOG) ================= */}
<section id="story-section" className="py-28 bg-[#FCF8F8] px-4 font-sans overflow-hidden">
  <div className="max-w-5xl mx-auto">
    
    {/* --- TIÊU ĐỀ CHÍNH --- */}
    <div className="text-center mb-24 relative">
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[80px] md:text-[120px] font-black text-rose-50 opacity-[0.04] select-none">
        Our Story
      </span>
      <h2 className="relative font-['UTM_Bikham'] text-5xl md:text-6xl text-[#BE123C] font-normal mb-2 drop-shadow-sm">
        Câu Chuyện Tình Yêu
      </h2>
      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-4" />
      <p className="text-xs tracking-[0.3em] text-gray-400 font-bold uppercase">
        Hành trình từ gặp gỡ đến trăm năm
      </p>
    </div>

    {/* --- TRỤC TIMELINE KỂ CHUYỆN --- */}
    <div className="relative space-y-20 md:space-y-32">
      
      {/* Đường chỉ dọc kết nối các câu chuyện (Chỉ hiển thị trên máy tính) */}
      <div className="absolute left-1/2 top-10 bottom-10 w-[1px] bg-dashed bg-rose-200 hidden md:block -translate-x-1/2" style={{ backgroundImage: 'linear-gradient(to bottom, #f43f5e 30%, rgba(255,255,255,0) 0%)', backgroundSize: '1px 8px', backgroundRepeat: 'repeat-y' }} />

      {/* MỐC 1: LẦN ĐẦU GẶP GỠ (Ảnh Trái - Chữ Phải) */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
        {/* Khối Ảnh bên trái */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 overflow-hidden rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.04)] border-4 border-white group aspect-[4/3]"
        >
          <img src="/SAM10649.jpg" alt="Lần đầu gặp gỡ" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </motion.div>
        
        {/* Khối Chữ bên phải */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 space-y-3 text-center md:text-left"
        >
          <span className="text-xs font-extrabold text-[#BE123C] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            12 / 04 / 2023
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide pt-1">Tiếng Sét Ái Tình</h3>
          <p className="text-gray-500 leading-relaxed font-light text-sm italic">
            "Vào một ngày trời thu trong xanh, định mệnh đã cho chúng mình chạm mặt nhau tại một quán cà phê nhỏ. Ánh mắt đầu tiên ấy chạm nhau làm con tim bỗng lỗi nhịp, để rồi từ một người xa lạ, chúng mình bắt đầu viết nên chương đầu tiên của câu chuyện đôi ta..."
          </p>
        </motion.div>

        {/* Điểm nút thắt hình trái tim ở giữa trục dọc */}
        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-rose-200 shadow-md hidden md:flex items-center justify-center text-xs text-[#BE123C] z-10">
          ♥
        </div>
      </div>

      {/* MỐC 2: HẸN HÒ (Ảnh Phải - Chữ Trái) */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 relative">
        {/* Khối Ảnh bên phải */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 overflow-hidden rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.04)] border-4 border-white group aspect-[4/3]"
        >
          <img src="/SAM10649.jpg" alt="Những chuyến đi" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </motion.div>
        
        {/* Khối Chữ bên trái */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 space-y-3 text-center md:text-right"
        >
          <span className="text-xs font-extrabold text-[#BE123C] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            20 / 10 / 2024
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide pt-1">Hành Trình Gắn Kết</h3>
          <p className="text-gray-500 leading-relaxed font-light text-sm italic">
            "Hơn một năm bên nhau là những ngày tháng tràn ngập nụ cười và cả những trải nghiệm mới. Những chuyến du lịch xa xôi, những buổi chiều lộng gió, từng khoảnh khắc ấy giúp chúng mình nhận ra bản thân đã trở thành một phần không thể thiếu trong cuộc sống của đối phương."
          </p>
        </motion.div>

        {/* Điểm nút thắt hình trái tim ở giữa trục dọc */}
        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-rose-200 shadow-md hidden md:flex items-center justify-center text-xs text-[#BE123C] z-10">
          ♥
        </div>
      </div>

      {/* MỐC 3: LỜI CẦU HÔN (Ảnh Trái - Chữ Phải) */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
        {/* Khối Ảnh bên trái */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 overflow-hidden rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.04)] border-4 border-white group aspect-[4/3]"
        >
          <img src="/SAM10649.jpg" alt="Lời cầu hôn" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </motion.div>
        
        {/* Khối Chữ bên phải */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 space-y-3 text-center md:text-left"
        >
          <span className="text-xs font-extrabold text-[#BE123C] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            14 / 02 / 2026
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide pt-1">Cái Gật Đầu Định Mệnh</h3>
          <p className="text-gray-500 leading-relaxed font-light text-sm italic">
            "Dưới ánh nến lung linh và giai điệu ngọt ngào của ngày lễ tình nhân, câu nói 'Em đồng ý làm vợ anh nhé?' đã nhận lại cái gật đầu trong nước mắt hạnh phúc. Chiếc nhẫn cầu hôn chính là lời thề ước thầm lặng rằng từ nay về sau, hai ta sẽ chung một lối về."
          </p>
        </motion.div>

        {/* Điểm nút thắt hình trái tim ở giữa trục dọc */}
        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#BE123C] to-rose-500 shadow-md hidden md:flex items-center justify-center text-xs text-white z-10 animate-pulse">
          ♥
        </div>
      </div>

    </div>
  </div>
</section>

          {/* SECTION 5: LỜI NGỎ */}
          {/* ================= SECTION: LỜI NGỎ NGHỆ THUẬT ================= */}
<section id="story-section" className="py-28 px-4 max-w-4xl mx-auto font-sans relative overflow-hidden">
  
  {/* Các dải hoa văn hoặc trái tim chìm nhẹ tạo không gian lãng mạn */}
  <div className="absolute top-10 left-10 text-rose-200/40 text-2xl pointer-events-none select-none animate-pulse">✨</div>
  <div className="absolute bottom-10 right-10 text-rose-200/40 text-2xl pointer-events-none select-none animate-pulse" style={{ animationDelay: '1s' }}>✨</div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative bg-gradient-to-b from-white to-rose-50/20 p-10 md:p-16 rounded-[3rem] border border-rose-100/60 shadow-[0_20px_50px_rgba(225,29,72,0.02)] text-center"
  >
    {/* Dấu ngoặc kép trang trí dạng lớn - Biểu tượng của lời ngỏ/lời tự sự */}
    <span className="absolute top-6 left-10 font-serif text-[120px] text-rose-200/30 leading-none select-none pointer-events-none">
      “
    </span>

    {/* --- TIÊU ĐỀ NỔI BẬT --- */}
    <div className="relative z-10 mb-8">
      <h2 className="font-['UTM_Bikham'] text-4xl md:text-5xl text-[#BE123C] mb-3 drop-shadow-sm">
        Lời Ngỏ Của Chúng Mình
      </h2>
      {/* Biểu tượng phân cách nhỏ xinh thay cho dấu gạch ngang thô cứng */}
      <div className="flex items-center justify-center gap-2 text-rose-300">
        <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-300" />
        <span className="text-xs">♥</span>
        <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-300" />
      </div>
    </div>

    {/* --- NỘI DUNG LỜI NGỎ (BỨC THƯ TÌNH) --- */}
    <p className="relative z-10 text-gray-600 leading-loose font-light text-sm md:text-base max-w-2xl mx-auto px-2 italic tracking-wide">
      "Tình yêu không phải là việc tìm thấy một ai đó hoàn hảo, mà là học cách nhìn thấy những điều tuyệt vời nhất từ một con người không hoàn hảo. Cảm ơn bạn đã luôn đồng hành, chia sẻ và chứng kiến hành trình trưởng thành đầy hạnh phúc của tụi mình. Sự hiện diện của bạn chính là món quà ý nghĩa nhất dành cho chúng mình trong ngày trọng đại này."
    </p>

    {/* --- CHỮ KÝ CỦA CÔ DÂU & CHÚ RỂ --- */}
    <div className="mt-10 relative z-10 flex items-center justify-center gap-6 font-uonluon text-5xl md:text-5xl text-rose-700/80">
      <span>Thu Huệ</span>
      <span className="text-4xl font-uonluon text-rose-300 font-light">&</span>
      <span>Văn Trung</span>
    </div>

    {/* Dấu ngoặc kép đóng ở góc dưới */}
    <span className="absolute bottom-[-40px] right-10 font-serif text-[120px] text-rose-200/20 leading-none select-none pointer-events-none">
      ”
    </span>
  </motion.div>
</section>

          {/* ================= SECTION 6: CUỐN SỔ LƯU NIỆM 3D (GUESTBOOK DIARY) ================= */}
<section id="wishes-section" className="py-24 bg-[#FCF8F8] border-t border-rose-100/30 px-4 font-sans relative overflow-hidden">
  
  {/* Decor hoa văn cổ điển phía sau cuốn sổ */}
  <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center opacity-5 select-none pointer-events-none">
    <span className="font-['UTM_Bikham'] text-[150px] text-[#BE123C]">Guestbook</span>
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Tiêu đề khu vực */}
    <div className="text-center mb-16">
      <h2 className="font-['UTM_Bikham'] text-5xl md:text-5xl text-[#BE123C] mb-2">
        Sổ Lưu Niệm Kỷ Niệm
      </h2>
      <p className="text-[14px] tracking-[0.25em] text-gray-400 font-bold uppercase">
        Để lại lời chúc ngọt ngào dành cho ngày chung đôi
      </p>
    </div>

    {/* --- THIẾT KẾ CUỐN SỔ MỞ RỘNG (DIARY LAYOUT) --- */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#FBF7F4] rounded-[2.5rem] shadow-[0_30px_70px_rgba(139,92,26,0.08)] border-4 border-[#EFE9E4] min-h-[580px] relative overflow-hidden">
      
      {/* 1. TRANG TRÁI (CHIẾM 5/12 CỘT): FORM GỬI LỜI CHÚC (STYLE TRANG GIẤY KẺ) */}
      <div className="lg:col-span-5 bg-white p-8 md:p-10 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-[#EAE2DB]">
        {/* Hiệu ứng dòng kẻ ngang chìm mờ của trang giấy viết thư */}
        <div className="absolute inset-0 bg-[linear-gradient(#f9f6f0_1px,transparent_1px)] bg-[size:100%_2.5rem] opacity-30 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="mb-2 text-center">
            <span className="text-[18px] font-bold text-rose-500 font-['UTM_Bikham'] uppercase tracking-widest block mb-1">Gửi gắm yêu thương</span>
            <h3 className="text-[18px] font-bold font-['UTM_Bikham'] text-gray-800 tracking-wide">Đặt Bút Ký Tên</h3>
          </div>

          <form
            ref={formRef}
            action={async (formData) => {
              setStatusMessage('Đang lưu lại nét bút...');
              const result = await submitWish(formData);
              if (result.success) {
                setStatusMessage('Đã ký tên vào sổ! Cảm ơn bạn rất nhiều.');
                formRef.current?.reset();
              } else {
                setStatusMessage(result.error || 'Có lỗi xảy ra.');
              }
            }}
            className="space-y-5"
          >
            <div>
              <label className="block font-['UTM_Bikham']  text-[16px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Tên của bạn</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full p-3.5 bg-rose-50/20 border border-[#E4DDD6] rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#BE123C] focus:bg-white transition-all shadow-inner" 
              />
            </div>

            <div>
              <label className="block text-[16px] font-['UTM_Bikham']  font-bold text-gray-400 uppercase mb-2 tracking-wider">Bạn là khách của:</label>
              <div className="flex gap-6 text-[14px] mt-1 text-gray-600 font-medium">
                {[
                  { val: 'Groom', label: 'Chú Rể' },
                  { val: 'Bride', label: 'Cô Dâu' },
                  { val: 'Both', label: 'Cả Hai' }
                ].map((item) => (
                  <label key={item.val} className="flex items-center gap-2 cursor-pointer select-none group">
                    <input 
                      type="radio" 
                      name="relationship" 
                      value={item.val} 
                      defaultChecked={item.val === 'Both'} 
                      className="accent-[#BE123C] w-4 h-4 transition" 
                    />
                    <span className="group-hover:text-[#BE123C] transition-colors">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[16px] font-['UTM_Bikham']  font-bold text-gray-400 uppercase mb-2 tracking-wider">Lời chúc tâm tình</label>
              <textarea 
                name="content" 
                required 
                rows={4} 
                placeholder="Hãy viết những lời chúc tốt đẹp nhất tại đây..."
                className="w-full p-3.5 bg-rose-50/20 border border-[#E4DDD6] rounded-xl text-[13px] text-gray-800 focus:outline-none focus:border-[#BE123C] focus:bg-white transition-all resize-none shadow-inner leading-relaxed" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-[#BE123C] to-rose-600 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl font-bold text-[13px] uppercase tracking-widest transition-all duration-300 shadow-[0_10px_20px_rgba(190,18,60,0.15)] hover:shadow-none transform hover:scale-[0.99]"
            >
              Gửi Lời Chúc
            </button>
            
            {statusMessage && (
              <p className="text-center text-[11px] font-semibold text-[#BE123C] mt-2 animate-pulse bg-rose-50 py-2 rounded-lg border border-rose-100">
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* --- GÁY SÁCH 3D (CHỈ HIỂN THỊ TRÊN MÀN HÌNH LỚN) --- */}
      <div className="hidden lg:block lg:col-span-1 relative bg-gradient-to-r from-[#EAE2DB] via-[#F3EDE8] to-[#EAE2DB] w-[24px] mx-auto h-full shadow-[inset_0_0_10px_rgba(0,0,0,0.06)] z-20">
        <div className="absolute inset-y-0 left-[6px] w-[1px] bg-black/5" />
        <div className="absolute inset-y-0 right-[6px] w-[1px] bg-black/5" />
      </div>

      {/* 2. TRANG PHẢI (CHIẾM 6/12 CỘT): NHẬT KÝ LỜI CHÚC (DIARY TIMELINE STYLE) */}
      <div className="lg:col-span-6 p-8 md:p-10 flex flex-col h-[580px] bg-[#FAF6F2]">
        <div className="flex justify-between items-center mb-6 border-b border-[#EAE2DB] pb-3">
          <h3 className="font-serif text-[18px] font-bold text-[#BE123C] flex items-center gap-2">
            <span>📖</span> Nhật Ký Lưu Niệm
          </h3>
          <span className="text-[14px] font-bold bg-rose-100 text-[#BE123C] px-3 py-1 rounded-full border border-rose-200">
            {wishes.length} Lời chúc
          </span>
        </div>

        {/* Khối cuộn danh sách dạng Dòng thời gian nhật ký */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs custom-scrollbar scroll-smooth">
          {wishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
              <span className="text-3xl mb-2">✍️</span>
              <p className="text-gray-400 italic font-medium">Chưa có nét chữ nào, hãy là người đặt bút đầu tiên nhé!</p>
            </div>
          ) : (
            wishes.map((w, index) => (
              <motion.div 
                key={w.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(139,92,26,0.02)] border border-[#EFE9E4] relative group hover:border-rose-200 transition-all duration-300"
              >
                {/* Chấm tròn nhỏ dạng timeline dọc trang ký sự */}
                <div className="absolute left-[-6px] top-6 w-3 h-3 rounded-full bg-rose-200 border-2 border-white hidden lg:block" />

                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-gray-800 text-sm block tracking-wide">{w.name}</span>
                    <span className="text-[13px] text-gray-400 font-medium tracking-wider">
                      {w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : 'Kỷ niệm'}
                    </span>
                  </div>
                  <span className="text-[13px] px-2.5 py-0.5 rounded-full bg-rose-50 text-[#BE123C] font-bold border border-rose-100/70 whitespace-nowrap">
                    {w.relationship === 'Groom' ? 'Bạn Chú Rể' : w.relationship === 'Bride' ? 'Bạn Cô Dâu' : 'Khách Cả Hai'}
                  </span>
                </div>
                
                {/* Nội dung tin nhắn viết tay mượt mà */}
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-[13px] italic bg-rose-50/10 p-2.5 rounded-xl border border-dashed border-rose-100/40">
                  "{w.content}"
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>

    </div>
  </div>

  {/* Thêm chút CSS tùy biến cho thanh cuộn Sổ lưu niệm mượt mà hơn */}
  <style jsx global>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(139, 92, 26, 0.02);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(190, 18, 60, 0.15);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(190, 18, 60, 0.3);
    }
  `}</style>
</section>
{/* ================= SECTION: GỬI LỜI CHÚC & MỪNG CƯỚI (WEDDING GIFT SONG SONG) ================= */}
<section id="wedding-gift-section" className="py-24 bg-gradient-to-b from-[#FCF8F8] via-[#FFF1F2]/40 to-[#FCF8F8] px-4 font-sans overflow-hidden border-t border-rose-100/30">
  <div className="max-w-6xl mx-auto">
    
    {/* --- TIÊU ĐỀ SECTION --- */}
    <div className="text-center mb-16">
      <h2 className="font-['UTM_Bikham'] text-4xl md:text-5xl text-[#BE123C] mb-2">
        Hộp Quà Mừng Cưới
      </h2>
    </div>

    {/* --- BỐ CỤC HIỂN THỊ SONG SONG 2 BÊN --- */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      
      {/* 1. KHỐI MỪNG CƯỚI CHÚ RỂ (BÊN TRÁI) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-rose-100/60 shadow-[0_20px_50px_rgba(225,29,72,0.03)] grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative overflow-hidden group"
      >
        {/* Họa tiết tim chìm trang trí góc hộp quà */}
        <div className="absolute -right-4 -bottom-4 text-5xl opacity-[0.02] text-[#BE123C] pointer-events-none select-none">♥</div>

        {/* Thông tin chữ (Chiếm 7/12 cột ở màn hình ngang) */}
        <div className="sm:col-span-7 space-y-4 text-center sm:text-left order-2 sm:order-1">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full uppercase">
              Mừng cưới chú rể
            </span>
            <h3 className="text-lg font-bold text-gray-800 tracking-wide mt-3">
              Chú Rể: VĂN TRUNG
            </h3>
          </div>

          <div className="space-y-2.5 pt-2 text-xs border-t border-dashed border-rose-100/70">
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Ngân hàng</span>
              <p className="text-gray-700 font-bold text-xs">MB Bank (Ngân hàng Quân Đội)</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Số tài khoản</span>
              <p className="text-[#BE123C] font-black text-base tracking-wider font-mono">9999123456789</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Chủ tài khoản</span>
              <p className="text-gray-700 font-bold uppercase text-[11px]">HỒ VĂN TRUNG</p>
            </div>
          </div>
        </div>

        {/* Khung chứa mã QR (Chiếm 5/12 cột ở màn hình ngang) */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-rose-50/30 border border-rose-100/40 rounded-2xl order-1 sm:order-2">
          <div className="w-32 h-32 bg-white p-1.5 rounded-xl shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src="/qr-groom.jpg" 
              alt="Mã QR mừng cưới Chú Rể"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-rose-600 uppercase tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
            </svg>
            Scan Me
          </div>
        </div>
      </motion.div>

      {/* 2. KHỐI MỪNG CƯỚI CÔ DÂU (BÊN PHẢI) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-rose-100/60 shadow-[0_20px_50px_rgba(225,29,72,0.03)] grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative overflow-hidden group"
      >
        {/* Họa tiết tim chìm trang trí góc hộp quà */}
        <div className="absolute -right-4 -bottom-4 text-5xl opacity-[0.02] text-[#BE123C] pointer-events-none select-none">♥</div>

        {/* Thông tin chữ (Chiếm 7/12 cột ở màn hình ngang) */}
        <div className="sm:col-span-7 space-y-4 text-center sm:text-left order-2 sm:order-1">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full uppercase">
              Mừng cưới cô dâu
            </span>
            <h3 className="text-lg font-bold text-gray-800 tracking-wide mt-3">
              Cô Dâu: THU HUỆ
            </h3>
          </div>

          <div className="space-y-2.5 pt-2 text-xs border-t border-dashed border-rose-100/70">
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Ngân hàng</span>
              <p className="text-gray-700 font-bold text-xs">Vietcombank (Ngoại thương VN)</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Số tài khoản</span>
              <p className="text-[#BE123C] font-black text-base tracking-wider font-mono">0011002233445</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Chủ tài khoản</span>
              <p className="text-gray-700 font-bold uppercase text-[11px]">TRẦN THỊ THU HUỆ</p>
            </div>
          </div>
        </div>

        {/* Khung chứa mã QR (Chiếm 5/12 cột ở màn hình ngang) */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-rose-50/30 border border-rose-100/40 rounded-2xl order-1 sm:order-2">
          <div className="w-32 h-32 bg-white p-1.5 rounded-xl shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              src="/qr-bride.jpg" 
              alt="Mã QR mừng cưới Cô Dâu"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-rose-600 uppercase tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
            </svg>
            Scan Me
          </div>
        </div>
      </motion.div>

    </div>
  </div>
</section>
        </motion.div>
      )}
    </>
  );
}