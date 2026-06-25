'use client';

import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export default function HeartRain() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 6,
      size: 12 + Math.random() * 14,
    }));
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute text-red-500/25 animate-fall"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`,
            top: '-5%',
          }}
        >
          ❤️
        </span>
      ))}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
      `}</style>
    </div>
  );
}