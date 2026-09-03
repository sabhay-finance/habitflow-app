import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RefreshCw, Clock } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../constants/flocusThemes';
import { AmbientSoundEngine, type SoundscapeType } from '../../services/ambientAudio';

interface FlocusBannerProps {
  onOpenFocusModal: () => void;
}

export const FlocusBanner: React.FC<FlocusBannerProps> = ({ onOpenFocusModal }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Welcome back');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [activeSound, setActiveSound] = useState<SoundscapeType>('off');

  // Update live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${mins} ${ampm}`);

      setCurrentDate(
        now.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
      );

      if (hours < 12) setGreeting('Good Morning');
      else if (hours < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleToggleSound = (type: SoundscapeType) => {
    if (activeSound === type) {
      setActiveSound('off');
      AmbientSoundEngine.stop();
    } else {
      setActiveSound(type);
      AmbientSoundEngine.play(type);
    }
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="relative p-5 sm:p-6 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-500/10 dark:bg-brand-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Side: Clock & Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>{currentDate}</span>
            <span>•</span>
            <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">
              {currentTime}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {greeting} ✨
          </h2>

          {/* Inspirational Quote with subtle fade */}
          <div className="flex items-center gap-2 pt-1 max-w-md">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic"
              >
                "{currentQuote.text}" — <span className="font-semibold">{currentQuote.author}</span>
              </motion.p>
            </AnimatePresence>
            <button
              onClick={handleNextQuote}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
              title="Next Quote"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Flocus Ambient Sound Bar & Focus Launch */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Quick Soundscape Chips */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <span className="text-[10px] font-bold text-slate-400 px-2 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-brand-500" />
              Ambience:
            </span>
            {[
              { id: 'rain' as SoundscapeType, emoji: '🌧️', label: 'Rain' },
              { id: 'waves' as SoundscapeType, emoji: '🌊', label: 'Waves' },
              { id: 'fire' as SoundscapeType, emoji: '🪵', label: 'Fire' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleToggleSound(s.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  activeSound === s.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{s.emoji}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
            {activeSound !== 'off' && (
              <button
                onClick={() => handleToggleSound(activeSound)}
                className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40"
                title="Mute Ambience"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Launch Focus Mode Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenFocusModal}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Clock className="w-4 h-4 stroke-[2.5]" />
            <span>Focus Mode</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
