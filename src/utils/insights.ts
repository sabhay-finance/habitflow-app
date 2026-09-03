import type { Habit, CompletionLog, StreakInfo } from '../types';
import { formatDate, getTodayDateString, isHabitScheduledForDate } from './date';

export interface SmartInsight {
  id: string;
  type: 'positive' | 'warning' | 'trend' | 'milestone';
  icon: string;
  title: string;
  description: string;
  metric?: string;
}

export interface InsightsResult {
  hasEnoughData: boolean;
  insights: SmartInsight[];
  bestDayOfWeek?: string;
  strongestHabit?: Habit;
  mostDifficultHabit?: Habit;
  weeklyChangePercent?: number;
  monthlyCompletionRate?: number;
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Calculates genuine insights based strictly on user completion logs and habits
 */
export function calculateSmartInsights(
  habits: Habit[],
  logs: CompletionLog[],
  streakMap: Map<string, StreakInfo>
): InsightsResult {
  // If insufficient data (< 4 logs or no habits)
  if (habits.length === 0 || logs.length < 4) {
    return {
      hasEnoughData: false,
      insights: [],
    };
  }

  const insights: SmartInsight[] = [];
  const todayStr = getTodayDateString();
  const completedDateSet = new Set(logs.map((l) => `${l.habitId}_${l.date}`));

  // 1. Day of the Week Analysis (Best day of the week)
  const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const log of logs) {
    // Parse log.date (YYYY-MM-DD) safely in local time
    const [year, month, day] = log.date.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayOfWeek = d.getDay();
    dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
  }

  let bestDayIdx = 1;
  let maxDayCount = 0;
  for (let d = 0; d < 7; d++) {
    if (dayCounts[d] > maxDayCount) {
      maxDayCount = dayCounts[d];
      bestDayIdx = d;
    }
  }

  const bestDayOfWeek = DAY_NAMES[bestDayIdx];
  if (maxDayCount >= 2) {
    insights.push({
      id: 'best_day',
      type: 'positive',
      icon: '📈',
      title: `Most productive on ${bestDayOfWeek}s`,
      description: `You have recorded ${maxDayCount} completions on ${bestDayOfWeek}s, making it your highest momentum day of the week.`,
      metric: `${maxDayCount} checks`,
    });
  }

  // 2. Strongest Habit
  let strongestHabit: Habit | undefined;
  let highestScore = -1;
  for (const habit of habits) {
    const streak = streakMap.get(habit.id);
    if (!streak) continue;
    // Score combines 30-day rate and current streak
    const score = streak.completionRateLast30Days * 1.5 + streak.currentStreak * 2;
    if (score > highestScore && streak.totalCompletions > 0) {
      highestScore = score;
      strongestHabit = habit;
    }
  }

  if (strongestHabit) {
    const streak = streakMap.get(strongestHabit.id);
    insights.push({
      id: 'strongest_habit',
      type: 'positive',
      icon: '🔥',
      title: `${strongestHabit.name} is your strongest habit`,
      description: `With a ${streak?.currentStreak || 0}-day streak and ${streak?.completionRateLast30Days || 0}% 30-day consistency, this routine is deeply ingrained.`,
      metric: `${streak?.currentStreak}d streak`,
    });
  }

  // 3. Habit Needing Attention (Most frequently missed this week)
  const past7Days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    past7Days.push(formatDate(d));
  }

  let mostDifficultHabit: Habit | undefined;
  let maxMissesThisWeek = 0;

  for (const habit of habits) {
    let misses = 0;
    for (const dateStr of past7Days) {
      if (dateStr === todayStr) continue; // Don't count today as missed yet
      if (isHabitScheduledForDate(habit.frequency, dateStr)) {
        if (!completedDateSet.has(`${habit.id}_${dateStr}`)) {
          misses++;
        }
      }
    }
    if (misses > maxMissesThisWeek) {
      maxMissesThisWeek = misses;
      mostDifficultHabit = habit;
    }
  }

  if (mostDifficultHabit && maxMissesThisWeek >= 2) {
    insights.push({
      id: 'missed_habit',
      type: 'warning',
      icon: '⚠️',
      title: `${mostDifficultHabit.name} missed ${maxMissesThisWeek} times this week`,
      description: `Consider adjusting its reminder time or breaking it into a smaller 2-minute starter ritual.`,
      metric: `${maxMissesThisWeek} missed`,
    });
  }

  // 4. Trend: Consistency compared with last week (days 0..6 vs days 7..13)
  let thisWeekScheduled = 0;
  let thisWeekCompleted = 0;
  let lastWeekScheduled = 0;
  let lastWeekCompleted = 0;

  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = formatDate(d);

    for (const habit of habits) {
      if (isHabitScheduledForDate(habit.frequency, dateStr)) {
        if (i < 7) {
          thisWeekScheduled++;
          if (completedDateSet.has(`${habit.id}_${dateStr}`)) thisWeekCompleted++;
        } else {
          lastWeekScheduled++;
          if (completedDateSet.has(`${habit.id}_${dateStr}`)) lastWeekCompleted++;
        }
      }
    }
  }

  const thisWeekRate = thisWeekScheduled > 0 ? (thisWeekCompleted / thisWeekScheduled) * 100 : 0;
  const lastWeekRate = lastWeekScheduled > 0 ? (lastWeekCompleted / lastWeekScheduled) * 100 : 0;
  const weeklyChangePercent = Math.round(thisWeekRate - lastWeekRate);

  if (lastWeekScheduled > 0 && Math.abs(weeklyChangePercent) >= 3) {
    if (weeklyChangePercent > 0) {
      insights.push({
        id: 'weekly_trend',
        type: 'positive',
        icon: '⚡',
        title: `Consistency improved ${weeklyChangePercent}% vs last week`,
        description: `Your rhythm is accelerating! You completed ${Math.round(thisWeekRate)}% of your habits this week compared to ${Math.round(lastWeekRate)}% previously.`,
        metric: `+${weeklyChangePercent}%`,
      });
    } else {
      insights.push({
        id: 'weekly_trend',
        type: 'trend',
        icon: '🎯',
        title: `Consistency dropped ${Math.abs(weeklyChangePercent)}% vs last week`,
        description: `Momentum fluctuates naturally. Pick 1 core habit today to rebuild your forward pace.`,
        metric: `${weeklyChangePercent}%`,
      });
    }
  }

  // 5. Monthly Completion Percentage
  let monthScheduled = 0;
  let monthCompleted = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = formatDate(d);
    for (const habit of habits) {
      if (isHabitScheduledForDate(habit.frequency, dateStr)) {
        monthScheduled++;
        if (completedDateSet.has(`${habit.id}_${dateStr}`)) monthCompleted++;
      }
    }
  }

  const monthlyCompletionRate =
    monthScheduled > 0 ? Math.round((monthCompleted / monthScheduled) * 100) : 0;

  if (monthScheduled >= 10) {
    insights.push({
      id: 'monthly_rate',
      type: 'milestone',
      icon: '🏆',
      title: `Completed ${monthlyCompletionRate}% of habits this month`,
      description: `Across the past 30 days, you satisfied ${monthCompleted} out of ${monthScheduled} planned habit routines.`,
      metric: `${monthlyCompletionRate}%`,
    });
  }

  return {
    hasEnoughData: insights.length > 0,
    insights,
    bestDayOfWeek,
    strongestHabit,
    mostDifficultHabit,
    weeklyChangePercent,
    monthlyCompletionRate,
  };
}
