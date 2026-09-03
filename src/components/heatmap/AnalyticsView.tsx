import React from 'react';
import type { Habit, CompletionLog, StreakFreeze, StreakInfo } from '../../types';
import { CalendarHeatmap } from './CalendarHeatmap';
import { WeeklyTrendChart } from '../dashboard/WeeklyTrendChart';
import { Flame, Trophy, CheckCircle2, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  habits: Habit[];
  logs: CompletionLog[];
  freezes: StreakFreeze[];
  streakMap: Map<string, StreakInfo>;
  overallMaxStreak: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  habits,
  logs,
  freezes,
  streakMap,
  overallMaxStreak,
}) => {
  const totalCompletions = logs.length;

  // Average 30-day rate
  const avg30DayRate = habits.length > 0
    ? Math.round(
        habits.reduce((acc, h) => acc + (streakMap.get(h.id)?.completionRateLast30Days || 0), 0) /
          habits.length
      )
    : 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Consistency & Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Visualize your momentum, trends, and GitHub-style heatmaps.
        </p>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Best Streak</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {overallMaxStreak}d
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Completions</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {totalCompletions}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-brand-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">30d Rate</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {avg30DayRate}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Habits</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {habits.length}
          </span>
        </div>
      </div>

      {/* 14-Day Completion Chart */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              14-Day Trend
            </h3>
            <p className="text-xs text-slate-400">Daily completion percentage across two weeks</p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">14 Days</span>
        </div>
        <WeeklyTrendChart habits={habits} logs={logs} days={14} />
      </div>

      {/* Overall Heatmap */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
        <CalendarHeatmap
          habits={habits}
          logs={logs}
          freezes={freezes}
          daysCount={84}
          title="Cumulative Consistency Heatmap"
        />
      </div>

      {/* Per-Habit Heatmaps */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
          Per-Habit Heatmaps
        </h3>
        {habits.map((habit) => {
          const streak = streakMap.get(habit.id);
          return (
            <div
              key={habit.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{habit.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{habit.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Streak: {streak?.currentStreak || 0}d · Best: {streak?.longestStreak || 0}d
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {streak?.completionRateLast30Days || 0}% (30d)
                </span>
              </div>

              <CalendarHeatmap
                habit={habit}
                logs={logs}
                freezes={freezes}
                daysCount={70}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
