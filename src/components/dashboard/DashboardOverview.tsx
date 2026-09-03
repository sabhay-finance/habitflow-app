import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Flame,
  Trophy,
  CheckCircle2,
  Clock,
  Play,
} from 'lucide-react';
import type { Habit, CompletionLog, StreakFreeze, StreakInfo } from '../../types';
import { getTodayDateString, isHabitScheduledForDate } from '../../utils/date';
import { HabitList } from '../habits/HabitList';
import { WeeklyTrendChart } from './WeeklyTrendChart';
import { LevelProgressCard } from '../gamification/LevelProgressCard';
import { EmptyState } from '../common/EmptyState';
import { FlocusMusicPlayer } from '../music/FlocusMusicPlayer';
import { FlocusBanner } from './FlocusBanner';
import { Button } from '../common/Button';

interface DashboardOverviewProps {
  habits: Habit[];
  logs: CompletionLog[];
  freezes?: StreakFreeze[];
  streakMap: Map<string, StreakInfo>;
  overallMaxStreak: number;
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
  freezes: _freezes,
  streakMap,
  overallMaxStreak,
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

  // Pending habits for today
  const pendingTodayHabits = useMemo(() => {
    return scheduledTodayHabits.filter((h) => {
      const streak = streakMap.get(h.id);
      return !streak?.isCompletedToday;
    });
  }, [scheduledTodayHabits, streakMap]);

  // Next primary habit to do now
  const nextPendingHabit = pendingTodayHabits[0];

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

  // Current active streak (highest active streak among habits)
  const currentActiveStreak = useMemo(() => {
    let max = 0;
    for (const info of streakMap.values()) {
      if (info.currentStreak > max) max = info.currentStreak;
    }
    return max;
  }, [streakMap]);

  // Motivational message based on progress
  const motivationalMessage = useMemo(() => {
    if (scheduledTodayHabits.length === 0) {
      return 'Ready to build your first streak? Create a habit to start.';
    }
    if (completionRateToday === 100) {
      return 'Flawless day! All habits completed today! 🏆';
    }
    if (completionRateToday >= 75) {
      return 'One more habit to complete your day. Keep the fire burning! 💪';
    }
    if (completionRateToday >= 50) {
      return "You're building momentum 🔥 Keep going!";
    }
    if (completionRateToday > 0) {
      return `${completedTodayCount} of ${scheduledTodayHabits.length} habits completed today. Great start! ⚡`;
    }
    return 'Ready to take action? Your daily streak begins with one tap.';
  }, [completionRateToday, completedTodayCount, scheduledTodayHabits.length]);

  // SVG Circle Progress Math
  const circleRadius = 42;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * completionRateToday) / 100;

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Flocus Aesthetic Sanctuary Banner (Clock, Ambience, Launch) */}
      <FlocusBanner onOpenFocusModal={onOpenFocusModal} />

      {/* 2. Premium "Today's Momentum" Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        {/* Subtle ambient mesh glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-black">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today's Momentum</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {completedTodayCount} of {scheduledTodayHabits.length} habits completed
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md">
              {motivationalMessage}
            </p>

            {/* Streak & Score Badges */}
            <div className="flex items-center gap-3 pt-1 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{currentActiveStreak}d Current Streak</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800/50">
                <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                <span>{overallMaxStreak}d Best Streak</span>
              </div>
            </div>
          </div>

          {/* Animated Circular Progress Indicator */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
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

            {/* Center Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {completionRateToday}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. "What Should I Do Now?" - Primary Action Callout */}
      {nextPendingHabit ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-3xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
              {nextPendingHabit.emoji}
            </span>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-white/80">
                <Clock className="w-3 h-3" />
                <span>What To Do Now</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {nextPendingHabit.name}
              </h3>
              <p className="text-xs text-white/80 line-clamp-1">
                {nextPendingHabit.description || 'Tap to complete this routine and preserve your momentum.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenFocusModal}
              icon={<Play className="w-3.5 h-3.5" />}
              className="flex-1 sm:flex-none bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Focus Mode
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onToggle(nextPendingHabit.id, undefined, {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                });
              }}
              icon={<CheckCircle2 className="w-4 h-4" />}
              className="flex-1 sm:flex-none bg-white text-brand-700 hover:bg-white/90 shadow-sm"
            >
              Complete Now
            </Button>
          </div>
        </div>
      ) : scheduledTodayHabits.length > 0 ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                All Habits Completed Today! 🎉
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                You've crushed every scheduled routine for today. Enjoy your well-earned streak bonus!
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* 4. Gamification Level Progress Card */}
      <LevelProgressCard levelInfo={levelInfo} totalXp={totalXp} />

      {/* 5. Flocus Music Lounge: Cigarettes After Sex, Billie Eilish, Lofi */}
      <FlocusMusicPlayer />

      {/* 6. Today's Habits List Section */}
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
                { id: 'all', label: 'All', count: scheduledTodayHabits.length },
                { id: 'pending', label: 'Pending', count: pendingTodayHabits.length },
                { id: 'completed', label: 'Done', count: completedTodayCount },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  filter === item.id
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] opacity-70">({item.count})</span>
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
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">
              {filter === 'completed'
                ? 'No habits completed yet today.'
                : 'All habits done for today! Fantastic job! 🎉'}
            </p>
            <p className="text-xs text-slate-400">
              {filter === 'completed'
                ? 'Tap any habit checkbox to start your streak.'
                : 'Take a break, rest, or launch Focus Sanctuary.'}
            </p>
          </div>
        )}
      </div>

      {/* 7. Weekly Performance Chart */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              7-Day Completion Rate
            </h3>
            <p className="text-xs text-slate-400">Daily habit consistency over the past week</p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            Past 7 Days
          </span>
        </div>
        <WeeklyTrendChart habits={habits} logs={logs} days={7} />
      </div>
    </div>
  );
};
