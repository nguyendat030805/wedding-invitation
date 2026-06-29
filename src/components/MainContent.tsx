'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Countdown from 'react-countdown';
import Image from 'next/image';
import Envelope from './Envelope';
import HeartRain from './HeartRain';
import { submitWish, likeWish, replyWish } from '@/app/actions';

// Import thư viện Lightbox phóng to ảnh cưới
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Wish {
  id: number;
  name: string;
  relationship: string;
  content: string;
  createdAt: Date;
  likes?: number;
  comment?: string;
}

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}
interface MainContentProps {
  initialWishes: Wish[];
  type?: "bride" | "groom" | "guest";
}

export default function MainContent({  initialWishes, type = "guest", }:  MainContentProps ) {
  // =========================================================================
  // BỘ ĐIỀU PHỐI DỮ LIỆU & MÀU SẮC RIÊNG BIỆT CHO 3 THIỆP (BẠN SỬA DATA TẠI ĐÂY)
  // =========================================================================
  const weddingConfig = {
    groom: {
      defaultTab: 'groom' as 'groom' | 'bride',
      title:"Trân Trọng Báo Tin Lễ Thành Hôn Của",
      // Hệ màu sắc riêng biệt cho Nhà Trai
      themeColor: '#6b0707',      // Màu đỏ đậm hoàng gia
      textColor: '#be123c',       // Màu nhấn đỏ hồng
      borderColor: '#d4af37',     // Màu viền vàng gold
      // Ngày giờ Lễ chính ở Section 1 & Countdown
      countdownDate: '2026-07-23T11:00:00',
      timeText: '11:00',
      dayOfWeek: 'Thứ 5',
      dateText: '23 . 07',
      yearText: '2026',
      lunarText: '(Tức Ngày 10 Tháng 06 Năm Bính Ngọ)',
      // Cấu hình lịch tháng 7/2026 làm nổi bật ngày 23
      weddingDayNumber: 23,
      calendarEmptySlots: 2,
      // Link Google Calendar
      calendarTitle: "Lễ Thành Hôn: Văn Trung & Thu Huệ (Nhà Trai)",
      calendarDates: "20260723T110000/20260723T150000",
    },
    bride: {
      defaultTab: 'bride' as 'groom' | 'bride',
      title:"Trân Trọng Báo Tin Lễ Vu Quy Của",
      // Hệ màu sắc riêng biệt cho Nhà Gái
      themeColor: '#881337',      // Màu đỏ Rose đậm
      textColor: '#e11d48',       // Màu hồng đỏ tươi
      borderColor: '#c5a059',     // Màu viền vàng champagne
      // Ngày giờ Lễ chính ở Section 1 & Countdown
      countdownDate: '2026-07-21T11:00:00',
      timeText: '11:00',
      dayOfWeek: 'Thứ 3',
      dateText: '21 . 07',
      yearText: '2026',
      lunarText: '(Tức Ngày 08 Tháng 06 Năm Bính Ngọ)',
      // Cấu hình lịch tháng 7/2026 làm nổi bật ngày 21
      weddingDayNumber: 21,
      calendarEmptySlots: 2,
      // Link Google Calendar
      calendarTitle: "Lễ Vu Quy: Văn Trung & Thu Huệ (Nhà Gái)",
      calendarDates: "20260721T110000/20260721T150000",
    },
    guest: {
      defaultTab: 'groom' as 'groom' | 'bride',
      title:"Trân Trọng Báo Tin Lễ Thành Hôn Của",
      // Hệ màu sắc riêng biệt cho Tiệc Sài Gòn
      themeColor: '#4c0519',      // Màu đỏ rượu vang Bordeaux
      textColor: '#9f1239',       // Màu đỏ thẫm tinh tế
      borderColor: '#b45309',     // Màu vàng hổ phách
      // Ngày giờ Lễ chính ở Section 1 & Countdown
      countdownDate: '2026-08-01T18:00:00', 
      timeText: '18:00',
      dayOfWeek: 'Thứ 7',
      dateText: '01 . 08',
      yearText: '2026',
      lunarText: '(Tức Ngày 19 Tháng 06 Năm Bính Ngọ)',
      // Cấu hình lịch tháng 7/2026 làm nổi bật ngày 26
      
      weddingDayNumber: 1,
      calendarEmptySlots: 5,
      // Link Google Calendar
      calendarTitle: "Tiệc Mừng Thành Hôn: Văn Trung & Thu Huệ",
      calendarDates: "20260801T180000/20260801T210000",
    }
  };

  const currentConfig = weddingConfig[type];

  // Định vị bản đồ và địa điểm tiệc cưới cố định theo từng thiệp
  const locations = {
    groom: {
      mainTitle:"THAM DỰ TIỆC MỪNG LỄ THÀNH HÔN",
      title: "TƯ GIA GIA ĐÌNH NHÀ TRAI",
      address: "Xóm Vụng Chùa - Xã Thiên Nhẫn - Tỉnh Nghệ An",
      map: "https://www.google.com/maps/place/H%C4%90ND-UBND+X%C3%A3+Thi%C3%AAn+Nh%E1%BA%ABn/@18.5987911,105.5137451,13351m/data=!3m1!1e3!4m10!1m2!2m1!1zWMOzbSBW4bulbmcgQ2jDuWEgLSBYw6MgVGhpw6puIE5o4bqrbiAtIFThu4luaCBOZ2jhu4cgQW4!3m6!1s0x3139c70005138d93:0xa1eca8f07476b32d!8m2!3d18.6069922!4d105.5789449!15sCjhYw7NtIFbhu6VuZyBDaMO5YSAtIFjDoyBUaGnDqm4gTmjhuqtuIC0gVOG7iW5oIE5naOG7hyBBblo2IjR4w7NtIHbhu6VuZyBjaMO5YSB4w6MgdGhpw6puIG5o4bqrbiB04buJbmggbmdo4buHIGFukgERZ292ZXJubWVudF9vZmZpY2WaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMjVHZWxkWWNGZFNSM015VDBkT1FscEhWbnBoU0ZaU1ZYa3hjR0p0WXhBQuABAPoBBAgAEEk!16s%2Fg%2F11xl43kxkx?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D",
      dayOfWeekMini: "Thứ 5",
      dateNumberMini: "23",
      lunarMini: "(Tức Ngày 10 Tháng 06 Năm Bính Ngọ)",
      calendarTitle: "Tháng 7 - 2026"
    },
    bride: {
      mainTitle:"THAM DỰ TIỆC MỪNG LỄ VU QUY",
      title: "TƯ GIA GIA ĐÌNH NHÀ GÁI",
      address: "Thôn Tân Bằng, xã Tân Mỹ, tỉnh Quảng Trị",
      map: "https://www.google.com/maps/place/T%C3%A2n+B%E1%BA%B1ng,+T%C3%A2n+L%E1%BA%A1c,+T%C3%A2n+Th%E1%BB%A7y,+T%C3%A2n+M%E1%BB%B9,+Qu%E1%BA%A3ng+Tr%E1%BB%8B,+Vietnam/@17.198652,106.8465224,187m/data=!3m1!1e3!4m6!3m5!1s0x3140b6eeeb091f39:0x74d707f6d97589b6!8m2!3d17.1981624!4d106.8483871!16s%2Fg%2F11rqtp6v1m?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D",
      dayOfWeekMini: "Thứ 3",
      dateNumberMini: "21",
      lunarMini: "(Tức Ngày 08 Tháng 06 Năm Bính Ngọ)",
      calendarTitle: "Tháng 7 - 2026"
    },
    guest: {
      mainTitle:"THAM DỰ TIỆC MỪNG LỄ THÀNH HÔN",
      title: "NHÀ HÀNG KIM CƯƠNG PLAZA",
      address: "Số 188 đại lộ Bình Dương - Phường Thuận Giao - Thành Phố Hồ Chí Minh",
      map: "https://www.google.com/maps/place/Diamond+Wedding+Restaurant/@10.9514838,106.7027957,864m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3174d7460bae5f9d:0xbdac6ef286624c6f!8m2!3d10.9514838!4d106.7053706!16s%2Fg%2F11b6pfnm_9?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D",
      dayOfWeekMini: "Thứ 7",
      dateNumberMini: "01",
      lunarMini: "(Tức Ngày 19 Tháng 06 Năm Bính Ngọ)",
      calendarTitle: "Tháng 8 - 2026"
    },
  };

  const location = locations[type];

  const [isOpened, setIsOpened] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [statusMessage, setStatusMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [stars, setStars] = useState<Star[]>([]);
  
  // States cho tính năng Phản hồi và Modal Quà cưới
  const [isAdmin, setIsAdmin] = useState(false);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const [giftTab, setGiftTab] = useState<"groom" | "bride">(currentConfig.defaultTab);

  const formRef = useRef<HTMLFormElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Khởi tạo ánh sao lấp lánh ngẫu nhiên
  useEffect(() => {
    if (isOpened) {
      const generatedStars = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2.5 + 1.5}px`, 
        delay: `${Math.random() * 4}s`,     
        duration: `${Math.random() * 3 + 2}s` 
      }));
      setStars(generatedStars);
    }
  }, [isOpened]);

  useEffect(() => {
    setWishes(initialWishes);
  }, [initialWishes]);
  
  const imagesGrid = [
    { src: '/anh_cong_1.jpg' }, 
    { src: '/anh_album6.jpg' }, 
    { src: '/anh_ngang.jpg' }, 
    { src: '/anh_album8.jpg' }, 
    { src: '/anh_album2.jpg' }, 
    { src: '/anh_ngang4.jpg' }, 
    { src: '/anh_album4.jpg' }, 
    { src: '/anh_album5.jpg' },
    { src: '/anh_cong2.jpg' },
    { src: '/anh_album7.jpg' },
    { src: '/anh_album3.jpg' },
    { src: '/anh_album10.jpg' },
  ];

  const lightboxSlides = imagesGrid.map(img => ({ src: img.src }));

  const bankInfo = {
    groom: { name: "Hồ Văn Trung", bank: "SHB Bank", number: "0352893879", qr: "/qr_chure.jpg" },
    bride: { name: "Trần Thị Thu Huệ", bank: "Agribank", number: "3802205297131", qr: "/qr_codau.jpg" },
  };

  const loveStories = [
    {
      date: "Love story",
      title: "Chạm Mặt Phút Đầu",
      content: "Một buổi chiều mưa, định mệnh đưa hai người xa lạ . Ánh mắt chạm nhau gửi gắm cả một đời.",
      image: "/story_gap_mat_v2.jpg",
    },
    {
      date: "Love story",
      title: "Gật đầu đồng ý",
      content: "Dưới ánh đèn lung linh, lời tỏ tình ngọt ngào đã được chấp thuận.",
      image: "/story_gachdau.jpg",
    },
    {
      date: "Love story",
      title: "Chung lối hẹn ước",
      content: "Chúng mình chính thức mở ra chương mới, cùng nhau viết tiếp trăm năm.",
      image: "/story_damngo.jpg",
    }
  ];

  // Lấy dữ liệu link lịch Google tự động theo cấu hình thiệp hiện tại
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: currentConfig.calendarTitle,
    dates: currentConfig.calendarDates,
    details: "Trân trọng kính mời bạn đến dự buổi tiệc mừng ngày vui của chúng mình!",
    location: location.address,
  });
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => console.log("Kích hoạt audio tương tác"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch((err) => console.log("Chờ tương tác phát nhạc: ", err));
    }, 300);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatusMessage('Đang lưu lại nét bút...');

    try {
      const res = await submitWish(formData);
      if (res.success) {
        setStatusMessage('Đã ký tên thành công! Xin chân thành cảm ơn.');
        formRef.current?.reset();
        
        const name = formData.get('name') as string;
        const relationship = formData.get('relationship') as string;
        const content = formData.get('content') as string;
        
        const mockNewWish = { id: Date.now(), name, relationship, content, createdAt: new Date(), likes: 0, comment: "" };
        setWishes((prev) => [mockNewWish, ...prev]);
      } else {
        setStatusMessage(res.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi lời chúc:', error);
      setStatusMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại!');
    }
  };

  const handleLikeWish = async (id: number) => {
    setWishes(prev => prev.map(w => w.id === id ? { ...w, likes: (w.likes || 0) + 1 } : w));
    try {
      const res = await likeWish(id);
      if (!res.success) {
        setWishes(prev => prev.map(w => w.id === id ? { ...w, likes: Math.max(0, (w.likes || 1) - 1) } : w));
      }
    } catch (error) {
      console.error(error);
      setWishes(prev => prev.map(w => w.id === id ? { ...w, likes: Math.max(0, (w.likes || 1) - 1) } : w));
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.21, 1.02, 0.43, 1.01] } }
  };

  const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const countdownRenderer = ({ days, hours, minutes, seconds }: any) => {
    const timeUnits = [
      { label: 'Ngày', value: days }, { label: 'Giờ', value: hours },
      { label: 'Phút', value: minutes }, { label: 'Giây', value: seconds },
    ];
    
    return (
      <div className="flex gap-3 justify-center items-center w-full max-w-sm mx-auto">
        {timeUnits.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-14 h-14 rounded-xl bg-[#faf8f5] border border-amber-200/40 flex items-center justify-center shadow-sm">
              <span className="text-md font-bold tabular-nums" style={{ color: currentConfig.textColor }}>{String(item.value).padStart(2, '0')}</span>
            </div>
            <span className="text-[13px] font-bold mt-2 uppercase tracking-widest text-amber-800/60 font-sans">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.7)); }
        }
        .animate-twinkle { animation: twinkle linear infinite; }
        .royal-wavy-borders {
          box-shadow: 
            inset 0 0 0 4px #fff,
            inset 0 0 0 6px ${currentConfig.borderColor},
            inset 0 0 0 10px #fff,
            inset 0 0 0 12px #aa7c11;
        }
        .royal-wavy-borders::before {
          content: "";
          position: absolute;
          inset: 16px;
          border: 1px dashed ${currentConfig.borderColor};
          pointer-events: none;
          z-index: 40;
          border-radius: inherit;
        }
      `}</style>

      <audio ref={audioRef} src="/Beautiful In White.mp3" loop preload="auto" />

      {!isOpened && <Envelope isOpen={isOpened} onOpen={handleOpenInvitation} type={type} />}

      {isOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-[#fdfbf7] min-h-screen text-gray-800 selection:bg-rose-100 overflow-x-hidden flex flex-col items-center py-0 sm:py-6 md:py-12 relative"
          style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
        >
          <div className="pointer-events-none fixed inset-0 z-50">
            <HeartRain />
          </div>

          <button onClick={toggleMusic} className={`fixed top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-amber-100 transition-transform active:scale-90 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s', color: currentConfig.textColor }}>
            {isPlaying ? (
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-6z"/></svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l3-3m0 0l3-3m-3 3l-3-3m3 3l3 3" /></svg>
            )}
          </button>

          <div className="w-full max-w-[480px] bg-white min-h-screen sm:min-h-[92vh] sm:rounded-[2.5rem] shadow-[0_25px_70px_rgba(139,92,26,0.04)] flex flex-col items-center overflow-hidden relative z-10 royal-wavy-borders px-4 sm:px-6">
            
            <motion.section 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10px" }} variants={staggerContainer}
              className="w-full pt-14 pb-10 px-2 flex flex-col items-center text-center border-b border-dashed border-amber-200/40 relative z-10"
            >
              <motion.p variants={fadeInUp} className="text-3xl text-amber-700/90 mb-6" style={{ fontFamily: 'var(--font-uonluon), var(--font-alex-brush), cursive' }}>Một hành trình mới bắt đầu từ hôm nay</motion.p>

              <motion.div variants={fadeInScale} className="flex items-center justify-center w-full max-w-[370px] gap-4 mb-6 select-none">
                <div className="flex-1 text-amber-500/70 opacity-80">
                  <svg viewBox="0 0 80 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M10 20 Q 30 5, 50 15 T 75 10 M15 22 C 30 12, 45 25, 60 14" />
                    <circle cx="12" cy="21" r="2" fill="currentColor" />
                    <circle cx="73" cy="11" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="relative w-24 h-24 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
                  <Image src="/tải xuống.png" alt="Chữ Song Hỷ Đám Cưới" fill className="object-contain" priority />
                </div>
                <div className="flex-1 text-amber-500/70 opacity-80 scale-x-[-1]">
                  <svg viewBox="0 0 80 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M10 20 Q 30 5, 50 15 T 75 10 M15 22 C 30 12, 45 25, 60 14" />
                    <circle cx="12" cy="21" r="2" fill="currentColor" />
                    <circle cx="73" cy="11" r="1.5" fill="currentColor" />
                  </svg>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 w-full text-center mt-2 mb-8 text-[13px]">
                <div className="space-y-1.5">
                    <p className="text-[13px] font-['UTM_Bikham'] font-bold tracking-wider mb-1" style={{ color: currentConfig.textColor }}>Nhà Trai</p>
                    <p className="font-medium font-['UTM_Bikham'] text-gray-700">Ông: <span className="font-bold font-['UTM_Bikham'] text-gray-950">HỒ VĂN HÙNG</span></p>
                    <p className="font-medium font-['UTM_Bikham'] text-gray-700">Bà: <span className="font-bold font-['UTM_Bikham'] text-gray-950">LÊ THỊ CHINH</span></p>
                    <p className="text-[11px] text-gray-500 font-['UTM_Bikham'] leading-relaxed mt-2 pt-2 border-t border-rose-100">Xóm Vụng Chùa - Xã Thiên Nhẫn<br />Tỉnh Nghệ An</p>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[13px] font-['UTM_Bikham'] font-bold tracking-wider mb-1" style={{ color: currentConfig.textColor }}>Nhà Gái</p>
                    <p className="font-medium font-['UTM_Bikham'] text-gray-700">Ông: <span className="font-bold font-['UTM_Bikham'] text-gray-950">TRẦN QUANG HIỂN</span></p>
                    <p className="font-medium font-['UTM_Bikham'] text-gray-700">Bà: <span className="font-bold font-['UTM_Bikham'] text-gray-950">DƯƠNG THỊ LÊ</span></p>
                    <p className="text-[11px] text-gray-500 font-['UTM_Bikham'] leading-relaxed mt-2 pt-2 border-t border-rose-100">Thôn Tân Bằng - Xã Tân Mỹ<br />Tỉnh Quảng Trị</p>
                </div>
              </motion.div>

              <motion.p variants={fadeInUp} className="text-[14px] font-semibold tracking-widest text-gray-900 mb-4 uppercase font-mono" style={{ fontFamily: 'var(--font-serif-title), serif' }}>{currentConfig.title}</motion.p>
              
              <motion.div variants={fadeInScale} className="flex flex-col items-center justify-center space-y-2 mb-8 w-full overflow-hidden select-none">
                <h2 className="text-7xl leading-none" style={{ fontFamily: "var(--font-alex-brush), cursive", color: currentConfig.themeColor }}>Văn Trung</h2>
                <div className="relative w-18 h-18 my-1 flex items-center justify-center shrink-0 drop-shadow-[0_2px_5px_rgba(212,175,55,0.2)]">
                  <Image src="/ring.png" alt="Nhẫn cưới hạnh phúc" fill className="object-contain" />
                </div>
                <h2 className="text-7xl leading-none" style={{ fontFamily: "var(--font-alex-brush), cursive", color: currentConfig.themeColor }}>Thu Huệ</h2>
              </motion.div>

              <motion.div variants={fadeInUp} className="w-full bg-[#fffdf9] border-y border-amber-200/50 py-4 px-2 mb-8 rounded-md">
                <div className="flex items-center justify-center w-full max-w-[340px] mx-auto">
                  <div className="flex-1 text-center pr-2">
                    <span className="text-2xl font-['UTM_Bikham'] font-bold text-gray-700 tracking-wide">{currentConfig.timeText}</span>
                  </div>
                  <div className="w-[1px] h-10 bg-amber-300/50" />
                  <div className="flex-1 flex flex-col items-center justify-center px-4 min-w-[95px]">
                    <span className="text-[16px] font-bold text-amber-800 tracking-wider mb-0.5 font-sans uppercase">{currentConfig.dayOfWeek}</span>
                    <span className="text-2xl font-['UTM_Bikham'] font-bold leading-none tracking-tighter" style={{ color: currentConfig.textColor }}>{currentConfig.dateText}</span>
                  </div>
                  <div className="w-[1px] h-10 bg-amber-300/50" />
                  <div className="flex-1 text-center pl-2">
                    <span className="text-2xl font-['UTM_Bikham'] font-bold text-gray-700 tracking-wide">{currentConfig.yearText}</span>
                  </div>
                </div>
                <p className="text-xl text-amber-900/60 font-semibold italic mt-2 tracking-wide font-['UTM_Bikham']">{currentConfig.lunarText}</p>
              </motion.div>

              <motion.div variants={fadeInScale} className="relative w-full aspect-[4/5] p-0.5 bg-white shadow-md rounded-sm overflow-hidden" style={{ border: `5px solid ${currentConfig.themeColor}` }}>
                <div className="absolute top-0 left-0 w-16 h-20 z-20 pointer-events-none">
                  <Image src="/đèn lồng.png" alt="Đèn lồng góc trái" fill className="object-contain object-top" />
                </div>
                <div className="absolute top-0 right-0 w-16 h-20 z-20 pointer-events-none scale-x-[-1]">
                  <Image src="/đèn lồng.png" alt="Đèn lồng góc phải" fill className="object-contain object-top" />
                </div>
                <div className="relative w-full h-full z-10">
                  <Image src="/anh_cong_1.jpg" fill className="object-cover" alt="Ảnh đại diện chính" priority />
                </div>
              </motion.div>
            </motion.section>

            <motion.section 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={staggerContainer}
              className="w-full py-10 px-2 bg-[#faf8f4]/60 border-b border-dashed border-amber-200/40 text-center flex flex-col items-center relative z-10"
            >
              <motion.h3 variants={fadeInUp} className="text-3xl" style={{ fontFamily: 'var(--font-alex-brush), cursive', color: currentConfig.themeColor }}>{location.calendarTitle}</motion.h3>
              
              <motion.div variants={fadeInScale} className="w-full max-w-[320px] bg-white border border-amber-200/20 p-5 rounded-2xl shadow-sm mb-6">
                <div className="grid grid-cols-7 gap-1 text-center text-[13px] font-bold text-gray-400 border-b border-gray-100 pb-2 mb-3 font-mono">
                  <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div className="text-red-500">CN</div>
                </div>
                <div className="grid grid-cols-7 gap-y-3 text-center text-xs font-semibold text-gray-700 relative">
                  {Array.from({ length: currentConfig.calendarEmptySlots }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="opacity-0"></div>
                  ))}
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isWeddingDay = day === currentConfig.weddingDayNumber;
                    return (
                      <div key={day} className="relative flex items-center justify-center h-6 w-full">
                        {isWeddingDay ? (
                          <div className="relative flex items-center justify-center h-8 w-8 z-10">
                            <motion.div 
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ color: currentConfig.textColor, filter: `drop-shadow(0_2px_6px rgba(190,18,60,0.35))` }}
                            >
                              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={currentConfig.textColor} fillOpacity="0.1" />
                              </svg>
                            </motion.div>
                            <span className="relative z-20 text-[11px] font-black pb-[1px]" style={{ color: currentConfig.textColor }}>{day}</span>
                          </div>
                        ) : (
                          <span className={`text-[13px] font-mono ${day === 5 || day === 12 || day === 19 || day === 26 ? 'text-red-400/80' : ''}`}>{day}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="w-full mb-6">
                <Countdown date={new Date(currentConfig.countdownDate)} renderer={countdownRenderer} />
              </motion.div>

              <motion.a variants={fadeInUp} href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-amber-200/60 rounded-xl text-[13px] font-bold uppercase tracking-wider shadow-sm active:scale-95 font-mono">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Thêm Vào Lịch Google
              </motion.a>
            </motion.section>

            <section className="w-full py-6 bg-[#faf8f4]/30 border-b border-dashed border-amber-200/40 text-center relative z-20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={fadeInUp} className="flex flex-col items-center justify-center gap-1 mb-6 px-4 select-none">
                <h3 className="text-4xl" style={{ fontFamily: 'var(--font-alex-brush), cursive', color: currentConfig.themeColor }}>Câu Chuyện Tình Yêu</h3>
                <p className="text-[13px] tracking-widest uppercase text-amber-800/70 font-bold font-mono mt-1" style={{ fontFamily: 'var(--font-serif-title), serif' }}>Our Stories</p>
              </motion.div>

              <div className="w-full flex flex-col relative">
                <div className="absolute inset-y-0 left-1/2 w-[2px] bg-gradient-to-b from-amber-200/20 via-amber-300/70 to-amber-200/20 border-dashed border-l border-amber-400/40 pointer-events-none" />

                {loveStories.map((story, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div key={idx} className="w-full px-2 sm:px-4 py-6 relative overflow-hidden">
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -40 : 40, y: 30 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className={`w-[85%] sm:w-[80%] bg-white border border-amber-100 p-4 rounded-2xl shadow-[0_10px_25px_rgba(139,92,26,0.02)] flex flex-col space-y-3 relative ${isEven ? 'mr-auto' : 'ml-auto'}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">{story.date}</span>
                        </div>
                        <h4 className="text-[13px] font-bold text-gray-900 text-left" style={{ fontFamily: 'var(--font-serif-title), serif' }}>{story.title}</h4>
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                          <Image src={story.image} fill className="object-cover" alt="Kỷ niệm chặng đường" />
                        </div>
                        <p className="text-[13px] text-gray-500 text-left leading-relaxed font-medium italic">"{story.content}"</p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ================= SECTION 4: THỜI GIAN & ĐỊA ĐIỂM TIỆC CHÍNH (ĐÃ CỐ ĐỊNH) ================= */}
            <motion.section 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={staggerContainer}
              className="w-full py-6 px-2 flex flex-col items-center text-center bg-white border-b border-dashed border-amber-200/40 relative z-20"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl mb-8" style={{ fontFamily: 'var(--font-alex-brush), cursive', color: currentConfig.themeColor }}>Trân Trọng Kính Mời</motion.h2>

              <div className="w-full mb-8">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4 }}
                  className="w-full text-center"
                >
                  <p className="text-[15px] font-bold text-gray-900 tracking-wider uppercase font-sans">{location.mainTitle}</p>
                  <p className="text-[18px] text-gray-900 font-medium font-sans mt-0.5 mb-5 lowercase italic">Vào Lúc</p>
                  
                  <div className="flex items-center justify-center w-full max-w-[340px] mx-auto">
                    <div className="flex-1 text-center pr-2">
                      <span className="text-xl font-semibold text-gray-900 tracking-tight">{currentConfig.timeText}</span>
                    </div>
                    <div className="w-[1px] h-12 bg-gray-400/80" />
                    <div className="flex-1 flex flex-col items-center justify-center px-4 min-w-[100px]">
                      <span className="text-[18px] font-medium text-gray-900 tracking-wide mb-1">{location.dayOfWeekMini}</span>
                      <span className="text-[44px] font-normal text-gray-955 leading-none tracking-tight">{location.dateNumberMini}</span>
                    </div>
                    <div className="w-[1px] h-12 bg-gray-400/80" />
                    <div className="flex-1 text-center pl-2">
                      <span className="text-xl font-semibold text-gray-900 tracking-tight">{currentConfig.yearText}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-800 font-medium italic mt-6 tracking-wide">
                    {location.lunarMini}
                  </p>
                </motion.div>
              </div>

              <motion.div variants={fadeInScale} className="w-full">
                <div className="w-full">
                  <div className="p-5 bg-[#faf8f5] border border-amber-100 rounded-2xl shadow-sm space-y-3 border-t-4" style={{ borderTopColor: currentConfig.themeColor }}>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] font-mono">BUỔI TIỆC ĐƯỢC TỔ CHỨC TẠI</p>
                    <h4 className="text-md font-black text-[#1e293b] tracking-wide" style={{ fontFamily: "var(--font-serif-title), serif" }}>{location.title}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{location.address}</p>
                    <a href={location.map} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex justify-center w-full">
                      <button className="px-5 py-2 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 active:scale-95 transition-all" style={{ backgroundColor: currentConfig.themeColor }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        Xem Chỉ Đường
                      </button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={staggerContainer}
              className="w-full py-5 px-2 bg-[#faf8f5]/50 flex flex-col items-center border-b border-dashed border-amber-200/40 relative z-20"
            >
              <motion.h4 variants={fadeInUp} className="text-4xl text-center mb-1" style={{ fontFamily: "var(--font-alex-brush), cursive", color: currentConfig.themeColor }}>Gửi Lời Chúc Mừng</motion.h4>
              <motion.p variants={fadeInUp} className="text-[10px] italic text-gray-700 tracking-widest text-center uppercase mb-6">"Cảm ơn tất cả tình cảm mà mọi người đã dành cho chúng mình"</motion.p>

              <motion.form variants={fadeInScale} ref={formRef} onSubmit={handleFormSubmit} className="bg-amber-200/40 p-5 rounded-2xl shadow-sm border border-amber-200/40 space-y-4 w-full">
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 uppercase mb-1">Tên của bạn là gì?</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    className="w-full p-2.5 bg-[#faf8f5] border border-gray-100 rounded-xl text-base focus:outline-none focus:border-[var(--focus-color)]" 
                    style={{ '--focus-color': currentConfig.themeColor } as React.CSSProperties} 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 uppercase mb-1">Bạn là bạn của...</label>
                  <div className="flex gap-4 text-[12px] font-medium text-gray-600 mt-1">
                    {["Chú Rể", "Cô Dâu", "Cả Hai"].map((rel) => (
                      <label key={rel} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="relationship" value={rel} defaultChecked={rel === "Cả Hai"} className="accent-[#6b0707]" />
                        <span>{rel}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-700 uppercase mb-1">Gửi lời chúc</label>
                  <textarea 
                    name="content" 
                    rows={3} 
                    required 
                    placeholder="Hãy viết lời chúc chân thành..." 
                    className="w-full resize-none p-2.5 bg-[#faf8f5] border border-gray-100 rounded-xl text-base focus:outline-none focus:border-[var(--focus-color)]" 
                    style={{ '--focus-color': currentConfig.themeColor } as React.CSSProperties} 
                  />
                </div>
                <button type="submit" className="w-full py-3 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md" style={{ backgroundColor: currentConfig.themeColor }}>GỬI LỜI CHÚC</button>
                <button 
                    type="button" 
                    onClick={() => setOpenGiftModal(true)} 
                    className="w-full py-3 border-2 text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition" 
                    style={{ 
                      borderColor: currentConfig.themeColor, 
                      color: currentConfig.themeColor, 
                      backgroundColor: 'transparent' 
                    }} 
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentConfig.themeColor;
                      e.currentTarget.style.color = '#ffffff'; // Đổi chữ sang màu trắng khi hover vào
                    }} 
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = currentConfig.themeColor; // Trả lại màu chữ ban đầu khi rêu chuột ra ngoài
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M2 7h20v5H2V7z" stroke="currentColor" strokeWidth="2" />
                      <path d="M20 12v10H4V12" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 22V7" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 7H7a2 2 0 1 1 0-4c2 0 5 4 5 4z" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 7h5a2 2 0 1 0 0-4c-2 0-5 4-5 4z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Gửi Quà Cưới
                  </button>
                {statusMessage && <p className="text-center text-[11px] font-semibold bg-red-50 py-1.5 rounded-lg" style={{ color: currentConfig.themeColor }}>{statusMessage}</p>}
              </motion.form>

              <div className="w-full text-center mt-4 mb-2">
                {!isAdmin ? (
                  <button 
                    type="button"
                    onClick={() => {
                      const password = prompt("Nhập mã bí mật của Dâu & Rể để phản hồi:");
                      if (password === "2107") {
                        setIsAdmin(true);
                      } else if (password !== null) {
                        alert("Mã xác thực không chính xác!");
                      }
                    }} 
                    className="text-[13px] text-gray-300 hover:text-[#6b0707] transition font-mono"
                  >
                    [Chế độ Dâu Rể]
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-emerald-600 font-bold">Đang bật chế độ Dâu Rể Phản Hồi</span>
                    <button type="button" onClick={() => { setIsAdmin(false); }} className="text-[13px] text-red-500 underline">Thoát</button>
                  </div>
                )}
              </div>

              <motion.div variants={fadeInUp} className="w-full mt-2 max-h-[250px] overflow-y-auto space-y-2.5 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {wishes.map((w) => (
                  <div key={w.id} className="bg-white p-3.5 rounded-xl border border-gray-100 flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between items-start gap-2 w-full">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1 text-base">
                          <span className="font-bold text-gray-800">{w.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-50 text-[13px] font-bold" style={{ color: currentConfig.textColor }}>{w.relationship}</span>
                        </div>
                        <p className="text-gray-500 italic text-base">"{w.content}"</p>
                        
                        {w.comment && (
                          <div className="text-base mt-2 pl-2.5 bg-amber-50/40 p-2 rounded-r-lg" style={{ borderLeft: `2px solid ${currentConfig.themeColor}` }}>
                            <span className="block text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: currentConfig.themeColor }}>Dâu & Rể phản hồi:</span>
                            <p className="text-gray-700 italic">"{w.comment}"</p>
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleLikeWish(w.id)} 
                        className="flex flex-col items-center justify-center self-center bg-rose-50 hover:bg-rose-100 active:scale-90 transition p-1.5 rounded-lg"
                        style={{ color: currentConfig.textColor }}
                      >
                        <svg width="16" height="16" fill={(w.likes && w.likes > 0) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {w.likes && w.likes > 0 ? (
                          <span className="text-[10px] font-bold mt-0.5">{w.likes}</span>
                        ) : null}
                      </button>
                    </div>

                    {isAdmin && (
                      <div className="pt-1 border-t border-dashed border-gray-100 text-right w-full">
                        {replyingId === w.id ? (
                          <div className="flex flex-col gap-2 mt-1">
                            <textarea 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Nhập lời cảm ơn gửi tới khách..." 
                              className="w-full p-2.5 bg-[#faf8f5] border border-gray-200 rounded-xl text-base focus:outline-none focus:border-[var(--focus-color)] resize-none"
                              style={{ '--focus-color': currentConfig.themeColor } as React.CSSProperties}
                              rows={2}
                            />
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => { setReplyingId(null); setReplyText(""); }} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 font-bold rounded-lg">Hủy</button>
                              <button 
                                type="button"
                                onClick={async () => {
                                  if (!replyText.trim()) return;
                                  const res = await replyWish(w.id, replyText, "2107"); 
                                  if (res.success) {
                                    setWishes(prev => prev.map(item => item.id === w.id ? { ...item, comment: replyText } : item));
                                    setReplyingId(null);
                                    setReplyText("");
                                  } else {
                                    alert(res.error || "Gặp lỗi khi lưu phản hồi.");
                                  }
                                }} 
                                className="px-3 py-1.5 text-xs text-white font-bold rounded-lg shadow-sm"
                                style={{ backgroundColor: currentConfig.themeColor }}
                              >
                                Lưu bình luận
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => { setReplyingId(w.id); setReplyText(w.comment || ""); }} 
                            className="text-[13px] font-bold hover:underline"
                            style={{ color: currentConfig.themeColor }}
                          >
                            {w.comment ? "Sửa phản hồi" : "Phản hồi lời chúc"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </motion.section>

            <motion.section 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={staggerContainer}
              className="w-full py-4 px-2 flex flex-col items-center bg-white relative z-1"
            >
              <div className="w-full space-y-4">
                <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-2">
                  <span className="w-20 h-[1px] bg-amber-200" />
                  <div className="relative w-14 h-14"><Image src="/anbum_icon.png" fill className="object-contain" alt="Hỷ mini" /></div>
                  <span className="w-20 h-[1px] bg-amber-200" />
                </motion.div>

                <motion.div variants={fadeInUp} className="text-center mb-6">
                  <h3 className="text-4xl" style={{ fontFamily: 'var(--font-alex-brush), cursive', color: currentConfig.themeColor }}>Album Ảnh Cưới</h3>
                </motion.div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1].map((idx) => imagesGrid[idx] && (
                      <motion.div 
                        key={idx} variants={fadeInScale} whileHover={{ scale: 0.99 }} onClick={() => setLightboxIndex(idx)}
                        className="overflow-hidden border border-gray-100 shadow-sm bg-white p-1 group cursor-pointer relative"
                      >
                        <img src={imagesGrid[idx].src} className="w-full h-auto object-cover" alt={`Wedding ${idx + 1}`} />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {imagesGrid[2] && (
                    <motion.div 
                      variants={fadeInScale} whileHover={{ scale: 0.99 }} onClick={() => setLightboxIndex(2)}
                      className="w-full overflow-hidden border border-gray-100 shadow-sm bg-white p-1 group cursor-pointer relative"
                    >
                      <img src={imagesGrid[2].src} className="w-full h-auto object-cover" alt="Wedding Center" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].slice(0, imagesGrid.length - 3).map((idx) => {
                      const isLastSlot = idx === 12 || idx === imagesGrid.length - 1;
                      const hasMoreImages = imagesGrid.length > 12;
                      const remainingCount = imagesGrid.length - 12;

                      return (
                        <motion.div 
                          key={idx} variants={fadeInScale} whileHover={{ scale: 0.99 }} onClick={() => setLightboxIndex(idx)}
                          className={`overflow-hidden border border-gray-100 shadow-sm bg-white p-1 group cursor-pointer relative ${idx === 5 && !hasMoreImages ? 'col-span-2' : 'col-span-1'}`}
                        >
                          <img src={imagesGrid[idx].src} className="w-full h-auto object-cover" alt={`Wedding ${idx + 1}`} />
                          {!isLastSlot && (
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            </div>
                          )}
                          {isLastSlot && (
                            hasMoreImages ? (
                              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center text-white transition-all group-hover:bg-black/60">
                                <span className="text-xl font-black tracking-wide font-sans">+{remainingCount}</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold bg-white/20 px-3 py-1 mt-1 border border-white/20">Xem tất cả</span>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              </div>
                            )
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeInScale}
              className="w-full relative h-[360px] flex items-center justify-center overflow-hidden border-t border-dashed border-amber-200/30 group"
            >
              <div className="absolute inset-0 z-0">
                <Image src="/anh_ngang3.jpg" alt="Ảnh cưới cảm ơn" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" priority />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/20 z-10" />
              <div className="relative z-20 max-w-[88%] w-full text-center px-5 py-8 border border-white/30 bg-black/5 rounded-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-1 border border-white/10 pointer-events-none" />
                <h3 className="text-4xl text-amber-200 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] leading-snug tracking-wide" style={{ fontFamily: "var(--font-alex-brush), cursive" }}>Trân Trọng Cảm Ơn</h3>
                <p className="text-white text-[13px] font-semibold leading-relaxed tracking-wider italic mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  "Sự hiện diện và những lời chúc phúc chân thành của quý vị là niềm vinh hạnh lớn nhất đối với gia đình chúng tôi. Cảm ơn vì đã là một phần trong ngày hạnh phúc trọn vẹn này."
                </p>
                <p className="text-3xl text-amber-100 drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)] mt-5 tracking-wide" style={{ fontFamily: "var(--font-alex-brush), cursive" }}>Văn Trung & Thu Huệ</p>
              </div>
            </motion.section>

            <footer className="w-full py-8 text-center text-[10px] text-gray-400 uppercase tracking-widest bg-white border-t border-gray-50 font-mono relative z-1">
              Thank you for sharing our big day! 07 • 2026
            </footer>
          </div>

          <Lightbox open={lightboxIndex >= 0} index={lightboxIndex} close={() => setLightboxIndex(-1)} slides={lightboxSlides} />

          <AnimatePresence>
            {openGiftModal && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setOpenGiftModal(false)}
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }} 
                  animate={{ scale: 1, y: 0 }} 
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-2xl border border-amber-100 flex flex-col items-center text-center relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setOpenGiftModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif-title), serif', color: currentConfig.themeColor }}>Gửi Quà Cưới</h3>
                  
                  <div className="flex bg-gray-100 p-1 rounded-full w-full mb-5">
                    <button 
                      onClick={() => setGiftTab("groom")} 
                      className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all ${giftTab === "groom" ? "text-white" : "text-gray-500"}`}
                      style={{ backgroundColor: giftTab === "groom" ? currentConfig.themeColor : 'transparent' }}
                    >
                      Mừng Chú Rể
                    </button>
                    <button 
                      onClick={() => setGiftTab("bride")} 
                      className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all ${giftTab === "bride" ? "text-white" : "text-gray-500"}`}
                      style={{ backgroundColor: giftTab === "bride" ? currentConfig.themeColor : 'transparent' }}
                    >
                      Mừng Cô Dâu
                    </button>
                  </div>

                  <div className="w-full flex flex-col items-center space-y-3 bg-[#faf8f5] p-4 rounded-2xl border border-amber-100/60">
                    <div className="relative w-48 h-48 bg-white border border-gray-200 rounded-xl p-2 shadow-inner">
                      <Image 
                        src={bankInfo[giftTab].qr} 
                        alt={`Mã QR ${giftTab === "groom" ? "Chú Rể" : "Cô Dâu"}`} 
                        fill 
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="text-gray-800 text-sm space-y-1">
                      <p className="font-bold text-base" style={{ color: currentConfig.themeColor }}>{bankInfo[giftTab].name}</p>
                      <p className="font-medium"><span className="text-gray-400">Ngân hàng:</span> {bankInfo[giftTab].bank}</p>
                      <p className="font-mono font-bold bg-white px-3 py-1 rounded-lg inline-block border border-gray-100 select-all tracking-wide text-base">
                        {bankInfo[giftTab].number}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 italic mt-4">Nhấp đúp hoặc đè vào số tài khoản để sao chép nhanh</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-amber-400 rounded-full pointer-events-none animate-twinkle"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}
        </motion.div>
      )}
    </>
  );
}