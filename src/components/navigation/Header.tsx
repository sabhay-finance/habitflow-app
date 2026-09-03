import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Settings, Flame, Zap } from 'lucide-react';
import { ANIMATION_CONFIG } from '../../constants/config';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenBadges?: () => void;
  overallMaxStreak: number;
  level: number;
  xp: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenSettings,
  onOpenBadges,
  overallMaxStreak,
  level,
  xp,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            transition={ANIMATION_CONFIG.spring.bounce}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25"
          >
            <Zap className="w-5 h-5 fill-white" />
          </motion.div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 via-violet-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
              HabitFlow
            </span>
          </div>
        </div>

        {/* Right Status Indicators & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Max Streak Pill */}
          {overallMaxStreak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <AnimatedCounter value={overallMaxStreak} suffix="d" />
            </div>
          )}

          {/* Level & XP Pill */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenBadges}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-100/80 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-black shadow-sm"
          >
            <span className="text-xs">Lv.{level}</span>
            <span className="text-[10px] opacity-75 font-mono">({xp} XP)</span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 180 }}
            transition={ANIMATION_CONFIG.spring.bounce}
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </motion.button>

          {/* Settings button */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 30 }}
            whileTap={{ scale: 0.92 }}
            transition={ANIMATION_CONFIG.spring.bounce}
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-colors"
            aria-label="Open settings"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
