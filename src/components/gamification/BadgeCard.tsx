import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';
import type { Badge, UnlockedBadge } from '../../types';
import { ANIMATION_CONFIG } from '../../constants/config';
import { getFriendlyDateLabel } from '../../utils/date';

interface BadgeCardProps {
  badge: Badge;
  unlockedInfo?: UnlockedBadge;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  unlockedInfo,
  onClick,
}) => {
  const isUnlocked = !!unlockedInfo;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={ANIMATION_CONFIG.spring.bounce}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
        isUnlocked
          ? 'bg-white dark:bg-slate-900 border-amber-200/60 dark:border-amber-900/40 shadow-md shadow-amber-500/5 hover:border-amber-400'
          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-90'
      }`}
    >
      {/* Icon and status badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
            isUnlocked
              ? `bg-gradient-to-tr ${badge.gradient} text-white shadow-lg`
              : 'bg-slate-200 dark:bg-slate-800 grayscale'
          }`}
        >
          {badge.icon}
        </div>

        {isUnlocked ? (
          <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        ) : (
          <span className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400">
            <Lock className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
          {badge.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {badge.description}
        </p>
      </div>

      {/* Bottom status */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold">
        {isUnlocked ? (
          <span className="text-emerald-600 dark:text-emerald-400">
            Unlocked {getFriendlyDateLabel(unlockedInfo.unlockedAt.slice(0, 10))}
          </span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">Locked Milestone</span>
        )}
      </div>
    </motion.div>
  );
};
