import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Check,
  MoreHorizontal,
  Edit2,
  Trash2,
  GripVertical,
  Calendar,
  Snowflake,
} from 'lucide-react';
import type { Habit, StreakInfo } from '../../types';
import { ANIMATION_CONFIG, getColorTheme } from '../../constants/config';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface HabitCardProps {
  habit: Habit;
  streakInfo: StreakInfo;
  onToggle: (habitId: string, date?: string, coords?: { x: number; y: number }) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onOpenFreezeModal: (habit: Habit) => void;
  showDragHandle?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  streakInfo,
  onToggle,
  onEdit,
  onDelete,
  onOpenFreezeModal,
  showDragHandle = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const theme = getColorTheme(habit.color);

  const handleCheckClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    onToggle(habit.id, undefined, coords);
  };

  // Format frequency label
  const frequencyLabel = (() => {
    if (habit.frequency.type === 'daily') return 'Every Day';
    if (habit.frequency.type === 'times_per_week') return `${habit.frequency.timesPerWeek || 3}x / week`;
    if (habit.frequency.type === 'specific_days' && habit.frequency.daysOfWeek) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return habit.frequency.daysOfWeek.map((d) => days[d]).join(', ');
    }
    return 'Custom';
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={ANIMATION_CONFIG.spring.bounce}
      className={`group relative w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 ${
        streakInfo.isCompletedToday
          ? 'border-slate-200/80 dark:border-slate-800 shadow-sm bg-gradient-to-r from-white via-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90'
          : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Drag handle */}
        {showDragHandle && (
          <div
            className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 p-1 -ml-1.5 touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* Emoji Avatar */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={ANIMATION_CONFIG.spring.bounce}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 select-none shadow-sm ${
            theme.bgLight
          } ${theme.bgDark}`}
        >
          {habit.emoji}
        </motion.div>

        {/* Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-base font-bold truncate transition-colors ${
                streakInfo.isCompletedToday
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {habit.name}
            </h3>
          </div>

          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            {/* Frequency badge */}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {frequencyLabel}
            </span>

            {/* Streak Counter with animated digits */}
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                streakInfo.isFrozenToday
                  ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300'
                  : streakInfo.currentStreak > 0
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {streakInfo.isFrozenToday ? (
                <Snowflake className="w-3.5 h-3.5 text-cyan-500 animate-spin-slow" />
              ) : (
                <Flame
                  className={`w-3.5 h-3.5 ${
                    streakInfo.currentStreak > 0
                      ? 'text-amber-500 fill-amber-500 animate-pulse'
                      : 'text-slate-400'
                  }`}
                />
              )}
              <AnimatedCounter value={streakInfo.currentStreak} suffix="d" />
            </div>

            {/* Best streak indicator */}
            {streakInfo.longestStreak > 0 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Best: {streakInfo.longestStreak}d
              </span>
            )}
          </div>
        </div>

        {/* Action button: Satisfying Checkmark */}
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            whileHover={{ scale: ANIMATION_CONFIG.hoverScale }}
            whileTap={{ scale: ANIMATION_CONFIG.tapScale }}
            transition={ANIMATION_CONFIG.spring.bounce}
            onClick={handleCheckClick}
            aria-label={streakInfo.isCompletedToday ? 'Mark as incomplete' : 'Complete habit'}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              streakInfo.isCompletedToday
                ? `bg-gradient-to-tr ${theme.gradient} text-white shadow-lg ${theme.glowClass}`
                : 'border-2 border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800/60 text-transparent hover:text-slate-300 dark:hover:text-slate-600'
            }`}
          >
            <AnimatePresence mode="wait">
              {streakInfo.isCompletedToday ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                  transition={ANIMATION_CONFIG.spring.bounce}
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Check className="w-5 h-5 stroke-[2] opacity-20 group-hover:opacity-60" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* More options menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Habit options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 4 }}
                    transition={ANIMATION_CONFIG.spring.snappy}
                    className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-30 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(habit);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      Edit Habit
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onOpenFreezeModal(habit);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 flex items-center gap-2.5 transition-colors"
                    >
                      <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
                      Streak Freeze
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(habit.id);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      Delete Habit
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
