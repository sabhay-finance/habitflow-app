import type { Habit, CompletionLog, StreakFreeze, StreakInfo, DayConsistency } from '../types';
import {
  formatDate,
  getTodayDateString,
  getYesterdayDateString,
  isHabitScheduledForDate,
  getWeekDates,
} from './date';

/**
 * Calculates complete streak analytics for a specific habit
 */
export function calculateHabitStreak(
  habit: Habit,
  allLogs: CompletionLog[],
  allFreezes: StreakFreeze[]
): StreakInfo {
  const habitLogs = allLogs.filter((l) => l.habitId === habit.id);
  const habitFreezes = allFreezes.filter((f) => f.habitId === habit.id);

  const completedDates = new Set(habitLogs.map((l) => l.date));
  const frozenDates = new Set(habitFreezes.map((f) => f.date));

  const today = getTodayDateString();

  const isCompletedToday = completedDates.has(today);
  const isFrozenToday = frozenDates.has(today);

  // Total completions count
  const totalCompletions = completedDates.size;

  // Last completion date
  const sortedCompleted = Array.from(completedDates).sort().reverse();
  const lastCompletedDate = sortedCompleted[0] || undefined;

  // Weekly consistency (past 7 days ending today)
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const weeklyConsistency: DayConsistency[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const dayName = dayLabels[d.getDay()];
    const isScheduled = isHabitScheduledForDate(habit.frequency, dateStr);
    const isCompleted = completedDates.has(dateStr);
    weeklyConsistency.push({
      dayName,
      date: dateStr,
      isCompleted,
      isScheduled,
    });
  }

  // 30-day consistency rate
  let scheduledLast30 = 0;
  let completedLast30 = 0;
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = formatDate(d);
    if (isHabitScheduledForDate(habit.frequency, dateStr)) {
      scheduledLast30++;
      if (completedDates.has(dateStr)) {
        completedLast30++;
      }
    }
  }
  const completionRateLast30Days =
    scheduledLast30 > 0 ? Math.round((completedLast30 / scheduledLast30) * 100) : 0;

  // Calculate streak based on frequency type
  if (habit.frequency.type === 'times_per_week') {
    const timesPerWeek = habit.frequency.timesPerWeek || 3;
    const { currentStreak, longestStreak } = calculateWeeklyQuotaStreak(
      completedDates,
      timesPerWeek
    );
    return {
      currentStreak,
      longestStreak,
      isCompletedToday,
      isFrozenToday,
      totalCompletions,
      completionRateLast30Days,
      lastCompletedDate,
      weeklyConsistency,
    };
  }

  // Daily or Specific Days streak calculation
  const { currentStreak, longestStreak } = calculateDailyOrDaysStreak(
    habit,
    completedDates,
    frozenDates,
    today
  );

  return {
    currentStreak,
    longestStreak,
    isCompletedToday,
    isFrozenToday,
    totalCompletions,
    completionRateLast30Days,
    lastCompletedDate,
    weeklyConsistency,
  };
}

/**
 * Calculates streak for daily and specific-days habits
 */
function calculateDailyOrDaysStreak(
  habit: Habit,
  completedDates: Set<string>,
  frozenDates: Set<string>,
  today: string
): { currentStreak: number; longestStreak: number } {
  const isCompletedToday = completedDates.has(today);
  const isFrozenToday = frozenDates.has(today);

  // Determine starting point for current streak
  let currentStreak = 0;
  const checkDate = new Date();

  // If today is scheduled and not completed/frozen, we can still hold yesterday's streak
  if (!isCompletedToday && !isFrozenToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  let safety = 1000;
  while (safety > 0) {
    safety--;
    const dateStr = formatDate(checkDate);
    const scheduled = isHabitScheduledForDate(habit.frequency, dateStr);

    if (scheduled) {
      if (completedDates.has(dateStr) || frozenDates.has(dateStr)) {
        currentStreak++;
      } else {
        // Streak broken
        break;
      }
    }
    checkDate.setDate(checkDate.getDate() - 1);

    // Stop if before creation date
    if (habit.createdAt && dateStr < habit.createdAt.slice(0, 10)) {
      break;
    }
  }

  // Longest streak calculation over full history
  let longestStreak = currentStreak;
  let runningStreak = 0;

  // Scan past 365 days
  const scanDate = new Date();
  scanDate.setDate(scanDate.getDate() - 365);
  const endDate = new Date();

  while (scanDate <= endDate) {
    const dateStr = formatDate(scanDate);
    if (habit.createdAt && dateStr < habit.createdAt.slice(0, 10)) {
      scanDate.setDate(scanDate.getDate() + 1);
      continue;
    }

    const scheduled = isHabitScheduledForDate(habit.frequency, dateStr);
    if (scheduled) {
      if (completedDates.has(dateStr) || frozenDates.has(dateStr)) {
        runningStreak++;
        if (runningStreak > longestStreak) {
          longestStreak = runningStreak;
        }
      } else {
        // Don't break streak for today if today is not over yet
        if (dateStr !== today) {
          runningStreak = 0;
        }
      }
    }
    scanDate.setDate(scanDate.getDate() + 1);
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}

/**
 * Calculates streak for habits with X times per week quota
 */
function calculateWeeklyQuotaStreak(
  completedDates: Set<string>,
  targetQuota: number
): { currentStreak: number; longestStreak: number } {
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  // Go back week by week (up to 52 weeks)
  const today = getTodayDateString();
  const currentWeekDays = getWeekDates(today);
  const completedThisWeek = currentWeekDays.filter((d: string) => completedDates.has(d)).length;

  // If this week is already met, add to current streak
  if (completedThisWeek >= targetQuota) {
    currentStreak++;
  }

  const checkDate = new Date();
  checkDate.setDate(checkDate.getDate() - 7); // previous week

  for (let w = 0; w < 52; w++) {
    const weekDays = getWeekDates(formatDate(checkDate));
    const completedCount = weekDays.filter((d: string) => completedDates.has(d)).length;

    if (completedCount >= targetQuota) {
      currentStreak++;
      runningStreak++;
      if (runningStreak > longestStreak) longestStreak = runningStreak;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 7);
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}

/**
 * Check if the habit is eligible for a streak freeze rescue right now
 */
export function canRescueWithFreeze(
  habit: Habit,
  allLogs: CompletionLog[],
  allFreezes: StreakFreeze[],
  freezesAvailableThisWeek: number
): { canFreeze: boolean; dateToProtect: string } {
  if (freezesAvailableThisWeek <= 0) {
    return { canFreeze: false, dateToProtect: '' };
  }

  const yesterday = getYesterdayDateString();
  const today = getTodayDateString();

  const habitLogs = allLogs.filter((l) => l.habitId === habit.id);
  const habitFreezes = allFreezes.filter((f) => f.habitId === habit.id);

  const completedDates = new Set(habitLogs.map((l) => l.date));
  const frozenDates = new Set(habitFreezes.map((f) => f.date));

  // Check if yesterday was scheduled, not completed, and not frozen
  const yesterdayScheduled = isHabitScheduledForDate(habit.frequency, yesterday);
  if (yesterdayScheduled && !completedDates.has(yesterday) && !frozenDates.has(yesterday)) {
    return { canFreeze: true, dateToProtect: yesterday };
  }

  // Check today if user wants proactive freeze for today
  if (!completedDates.has(today) && !frozenDates.has(today)) {
    return { canFreeze: true, dateToProtect: today };
  }

  return { canFreeze: false, dateToProtect: '' };
}
