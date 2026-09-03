import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { Habit, CompletionLog, StreakFreeze, StreakInfo } from '../../types';
import { getTodayDateString, isHabitScheduledForDate } from '../../utils/date';
import { HabitList } from '../habits/HabitList';
import { WeeklyTrendChart } from './WeeklyTrendChart';
import { CalendarHeatmap } from '../heatmap/CalendarHeatmap';
import { LevelProgressCard } from '../gamification/LevelProgressCard';
import { EmptyState } from '../common/EmptyState';
import { FlocusBanner } from './FlocusBanner';

interface DashboardOverviewProps {
  habits: Habit[];
  logs: CompletionLog[];
  freezes: StreakFreeze[];
  streakMap: Map<string, StreakInfo>;
  levelInfo: any;
  totalXp: number;
  onOpenFocusModal: () => void;
  onToggle: (habitId: string, date?: string, coords?: { x: number; y: number }) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onOpenFreezeModal: (habit: Habit) => void;
  onReorder: (newOrder: Habit[]) => void;
  onAddNewHabit: () => void;
  onSelectTemplate: (template: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  habits,
  logs,
  freezes,
  streakMap,
  levelInfo,
  totalXp,
  onOpenFocusModal,
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
    <div className="space-y-6">
      {/* Flocus Aesthetic Banner with Live Clock, Greeting, Quotes, Ambience */}
      <FlocusBanner onOpenFocusModal={onOpenFocusModal} />

      {/* Gamification Level Status Card */}
      <LevelProgressCard levelInfo={levelInfo} totalXp={totalXp} />

      {/* Today's Momentum Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-black">
              <Calendar className="w-3 h-3" />
              <span>Daily Focus</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Today's Momentum
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm">
              {motivationalMessage}
            </p>
          </div>

          {/* Radial Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
              {/* Background ring */}
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              {/* Progress ring */}
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

      {/* Habits Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Today's Habits
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
              {scheduledTodayHabits.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Done' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filter === item.id
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {displayedHabits.length > 0 ? (
          <HabitList
            habits={displayedHabits}
            streakMap={streakMap}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenFreezeModal={onOpenFreezeModal}
            onReorder={onReorder}
            isDraggable={filter === 'all'}
          />
        ) : scheduledTodayHabits.length === 0 ? (
          <EmptyState onAddCustom={onAddNewHabit} onSelectTemplate={onSelectTemplate} />
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
            {filter === 'completed'
              ? 'No habits completed yet today. Tap a checkmark to begin!'
              : 'All done for today! Fantastic job! 🎉'}
          </div>
        )}
      </div>

      {/* Weekly Trend Chart Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              7-Day Completion Rate
            </h3>
            <p className="text-xs text-slate-400">Consistency trend over the past week</p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            Past 7 Days
          </span>
        </div>
        <WeeklyTrendChart habits={habits} logs={logs} days={7} />
      </div>

      {/* All-Habits GitHub Heatmap Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
        <CalendarHeatmap
          habits={habits}
          logs={logs}
          freezes={freezes}
          daysCount={70}
          title="All-Habits Activity Heatmap"
        />
      </div>
    </div>
  );
};
