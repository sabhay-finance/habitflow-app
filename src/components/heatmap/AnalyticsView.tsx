import React, { useMemo } from 'react';
import type { Habit, CompletionLog, StreakFreeze, StreakInfo } from '../../types';
import { CalendarHeatmap } from './CalendarHeatmap';
import { WeeklyTrendChart } from '../dashboard/WeeklyTrendChart';
import {
  Flame,
  Trophy,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { calculateSmartInsights } from '../../utils/insights';
import { getColorTheme } from '../../constants/config';

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

  // Average 30-day consistency score
  const avg30DayRate = useMemo(() => {
    if (habits.length === 0) return 0;
    const sum = habits.reduce(
      (acc, h) => acc + (streakMap.get(h.id)?.completionRateLast30Days || 0),
      0
    );
    return Math.round(sum / habits.length);
  }, [habits, streakMap]);

  // Real Smart Insights calculation
  const smartInsights = useMemo(() => {
    return calculateSmartInsights(habits, logs, streakMap);
  }, [habits, logs, streakMap]);

  // Habit Performance rankings
  const rankedHabits = useMemo(() => {
    return [...habits]
      .map((h) => {
        const streak = streakMap.get(h.id);
        const rate = streak?.completionRateLast30Days || 0;
        const currentStreak = streak?.currentStreak || 0;
        const longestStreak = streak?.longestStreak || 0;
        const completions = streak?.totalCompletions || 0;
        return {
          habit: h,
          rate,
          currentStreak,
          longestStreak,
          completions,
        };
      })
      .sort((a, b) => b.rate - a.rate || b.currentStreak - a.currentStreak);
  }, [habits, streakMap]);

  const bestHabit = rankedHabits[0];
  const mostConsistentHabit = [...rankedHabits].sort((a, b) => b.completions - a.completions)[0];
  const mostDifficultHabit = smartInsights.mostDifficultHabit
    ? rankedHabits.find((r) => r.habit.id === smartInsights.mostDifficultHabit?.id)
    : rankedHabits[rankedHabits.length - 1];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 text-xs font-black mb-1">
          <BarChart3 className="w-3 h-3" />
          <span>Performance Intelligence</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Analytics &amp; Smart Insights
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Detailed metrics, consistency trends, and genuine behavioral insights.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Consistency Score</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {avg30DayRate}%
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">30-day average rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Longest Streak</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {overallMaxStreak}d
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Across all routines</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Checks</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {totalCompletions}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Lifetime check-offs</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Habits</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {habits.length}
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">Tracked routines</p>
        </div>
      </div>

      {/* Section E: Real Smart Insights */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Smart Behavioral Insights
              </h3>
              <p className="text-xs text-slate-400">Derived strictly from your actual habit history</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            Real Data
          </span>
        </div>

        {smartInsights.hasEnoughData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {smartInsights.insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  insight.type === 'positive'
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/40'
                    : insight.type === 'warning'
                    ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/40'
                    : 'bg-slate-50/50 dark:bg-slate-850/50 border-slate-200/70 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl select-none shrink-0">{insight.icon}</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {insight.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  {insight.metric && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs shrink-0 border border-slate-200 dark:border-slate-700">
                      {insight.metric}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              Insights Need More Activity
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Check off your scheduled habits for 3 or more days to generate personalized AI performance trends.
            </p>
          </div>
        )}
      </div>

      {/* Section A: Weekly Performance Chart (7 Days) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Weekly Performance (Past 7 Days)
            </h3>
            <p className="text-xs text-slate-400">Day-by-day completion distribution</p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            Last 7 Days
          </span>
        </div>
        <WeeklyTrendChart habits={habits} logs={logs} days={7} />
      </div>

      {/* Section B: Monthly Progress Chart (30 Days) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Monthly Progress &amp; Trend (Past 30 Days)
            </h3>
            <p className="text-xs text-slate-400">Longer horizon habit consistency curve</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Last 30 Days
          </span>
        </div>
        <WeeklyTrendChart habits={habits} logs={logs} days={30} />
      </div>

      {/* Section C: Habit Performance Rankings */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
            Habit Performance &amp; Consistency Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            Identify your strongest routines and areas for daily focus
          </p>
        </div>

        {/* Highlight Cards: Best, Most Consistent, Needs Attention */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {bestHabit && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Best Habit
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{bestHabit.habit.emoji}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {bestHabit.habit.name}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {bestHabit.rate}% consistency • {bestHabit.currentStreak}d streak
              </p>
            </div>
          )}

          {mostConsistentHabit && (
            <div className="p-3.5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/50 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Most Consistent
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{mostConsistentHabit.habit.emoji}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {mostConsistentHabit.habit.name}
                </span>
              </div>
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                {mostConsistentHabit.completions} total completions
              </p>
            </div>
          )}

          {mostDifficultHabit && (
            <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Needs Attention
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{mostDifficultHabit.habit.emoji}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {mostDifficultHabit.habit.name}
                </span>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                {mostDifficultHabit.rate}% completion rate
              </p>
            </div>
          )}
        </div>

        {/* Detailed Habit Progress Bars */}
        <div className="space-y-3 pt-2">
          {rankedHabits.map(({ habit, rate, currentStreak, completions }) => {
            const theme = getColorTheme(habit.color);

            return (
              <div
                key={habit.id}
                className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base select-none">{habit.emoji}</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-medium text-slate-500 dark:text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {currentStreak}d
                    </span>
                    <span>•</span>
                    <span>{completions} checks</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900 dark:text-white">{rate}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 rounded-full`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section D: Premium GitHub-style Activity Heatmap */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
        <CalendarHeatmap
          habits={habits}
          logs={logs}
          freezes={freezes}
          daysCount={84}
          title="All-Habits Activity Heatmap (Last 12 Weeks)"
        />
      </div>
    </div>
  );
};
