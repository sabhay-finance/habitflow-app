import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import type { Habit, StreakInfo } from '../../types';
import { getTodayDateString, isHabitScheduledForDate } from '../../utils/date';
import { HabitList } from './HabitList';
import { LevelProgressCard } from '../gamification/LevelProgressCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';

interface HabitsPageViewProps {
  habits: Habit[];
  streakMap: Map<string, StreakInfo>;
  levelInfo: any;
  totalXp: number;
  onToggle: (habitId: string, date?: string, coords?: { x: number; y: number }) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onOpenFreezeModal: (habit: Habit) => void;
  onReorder: (newOrder: Habit[]) => void;
  onAddNewHabit: () => void;
  onSelectTemplate: (template: any) => void;
}

export const HabitsPageView: React.FC<HabitsPageViewProps> = ({
  habits,
  streakMap,
  levelInfo,
  totalXp,
  onToggle,
  onEdit,
  onDelete,
  onOpenFreezeModal,
  onReorder,
  onAddNewHabit,
  onSelectTemplate,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const today = getTodayDateString();

  // Filter habits scheduled for today
  const scheduledTodayHabits = useMemo(() => {
    return habits.filter((h) => isHabitScheduledForDate(h.frequency, today));
  }, [habits, today]);

  // Completed today count
  const completedTodayCount = useMemo(() => {
    return scheduledTodayHabits.filter((h) => {
      const streak = streakMap.get(h.id);
      return streak?.isCompletedToday;
    }).length;
  }, [scheduledTodayHabits, streakMap]);

  const completionRateToday =
    scheduledTodayHabits.length > 0
      ? Math.round((completedTodayCount / scheduledTodayHabits.length) * 100)
      : 0;

  // Filtered list based on active tab
  const displayedHabits = useMemo(() => {
    return scheduledTodayHabits.filter((h) => {
      const streak = streakMap.get(h.id);
      if (filter === 'completed') return streak?.isCompletedToday;
      if (filter === 'pending') return !streak?.isCompletedToday;
      return true;
    });
  }, [scheduledTodayHabits, streakMap, filter]);

  // Motivational quote based on completion rate
  const motivationalMessage = useMemo(() => {
    if (completionRateToday === 100) return 'Flawless day! You’ve crushed all scheduled habits! 🌟';
    if (completionRateToday >= 75) return 'Nearly there! Just one final push to finish the day strong. 💪';
    if (completionRateToday >= 40) return 'Awesome momentum! Keep the rhythm going. 🚀';
    return 'Every great streak starts with the very first checkmark today. ✨';
  }, [completionRateToday]);

  // SVG Circle Progress Math
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * completionRateToday) / 100;

  return (
    <div className="space-y-6 pb-24">
      {/* Level & XP Overview */}
      <LevelProgressCard levelInfo={levelInfo} totalXp={totalXp} />

      {/* Today's Momentum Card */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-black">
              <Calendar className="w-3 h-3" />
              <span>Daily Focus</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Habits Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm">
              {motivationalMessage}
            </p>
          </div>

          {/* Radial Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100 dark:text-zinc-800"
                fill="transparent"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeLinecap="round"
                className="text-brand-600 dark:text-brand-500"
                fill="transparent"
              />
            </svg>

            {/* Percentage text inside ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {completionRateToday}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {completedTodayCount}/{scheduledTodayHabits.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Add Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800 text-xs">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onAddNewHabit}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Habit
        </Button>
      </div>

      {/* Habits List or Empty State */}
      {displayedHabits.length === 0 ? (
        <EmptyState onSelectTemplate={onSelectTemplate} onAddCustom={onAddNewHabit} />
      ) : (
        <HabitList
          habits={displayedHabits}
          streakMap={streakMap}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenFreezeModal={onOpenFreezeModal}
          onReorder={onReorder}
        />
      )}
    </div>
  );
};
