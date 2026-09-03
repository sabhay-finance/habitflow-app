import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { ANIMATION_CONFIG } from '../../constants/config';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface LevelProgressCardProps {
  levelInfo: {
    level: number;
    title: string;
    icon: string;
    currentLevelXp: number;
    nextLevelXp: number;
    progressPercent: number;
  };
  totalXp: number;
}

export const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  levelInfo,
  totalXp,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -top-10 w-24 h-24 rounded-full bg-brand-400/20 blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={ANIMATION_CONFIG.spring.bounce}
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-inner select-none"
            >
              {levelInfo.icon}
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-brand-200">
                  Level {levelInfo.level}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-300" />
                <span className="text-xs font-bold text-brand-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <AnimatedCounter value={totalXp} suffix=" XP" />
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {levelInfo.title}
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-brand-100">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Tier {levelInfo.level}</span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-brand-100">
            <span>Progress to Level {levelInfo.level + 1}</span>
            <span>
              {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-black/25 overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
