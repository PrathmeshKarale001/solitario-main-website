'use client';

import { useState, useEffect } from 'react';
import { Clock, Gift } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ChristmasCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const christmas = new Date(new Date().getFullYear(), 11, 25); // December 25th
      if (new Date() > christmas) {
        christmas.setFullYear(christmas.getFullYear() + 1);
      }
      
      const difference = christmas.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 to-green-600 text-white py-3 px-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-center gap-4">
        <Gift className="w-5 h-5 text-yellow-300 animate-bounce" />
        <div className="text-center">
          <p className="text-xs font-gotham uppercase tracking-wider text-yellow-300 mb-1">
            Christmas Sale Ends In
          </p>
          <div className="flex gap-2 justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 min-w-[3rem]">
              <div className="text-lg font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wider opacity-80">Days</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 min-w-[3rem]">
              <div className="text-lg font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wider opacity-80">Hours</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 min-w-[3rem]">
              <div className="text-lg font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wider opacity-80">Mins</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 min-w-[3rem]">
              <div className="text-lg font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wider opacity-80">Secs</div>
            </div>
          </div>
        </div>
        <Clock className="w-5 h-5 text-yellow-300 animate-pulse" />
      </div>
    </div>
  );
}
