import type { FrequencyConfig } from '../types';

/** Format date object to YYYY-MM-DD in local time */
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Get today's date formatted as YYYY-MM-DD */
export function getTodayDateString(): string {
  return formatDate(new Date());
}

/** Get yesterday's date formatted as YYYY-MM-DD */
export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

/** Parse YYYY-MM-DD string into a local Date */
export function parseDateString(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Returns day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat */
export function getDayOfWeek(dateStr: string): number {
  return parseDateString(dateStr).getDay();
}

/** Returns ISO week key e.g. "2026-W36" */
export function getWeekKey(date: Date | string): string {
  const d = typeof date === 'string' ? parseDateString(date) : new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/** Get array of past N dates up to and including today */
export function getPastDates(daysCount: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

/** Friendly date label, e.g. "Today, Sep 3", "Yesterday", "Mon, Sep 1" */
export function getFriendlyDateLabel(dateStr: string): string {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const d = parseDateString(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Check if a habit is scheduled for a given date */
export function isHabitScheduledForDate(frequency: FrequencyConfig, dateStr: string): boolean {
  if (frequency.type === 'daily') {
    return true;
  }
  if (frequency.type === 'specific_days') {
    const day = getDayOfWeek(dateStr);
    return Array.isArray(frequency.daysOfWeek) && frequency.daysOfWeek.includes(day);
  }
  if (frequency.type === 'times_per_week') {
    return true;
  }
  return true;
}

/** Get week dates (Mon to Sun) for a given date */
export function getWeekDates(dateStr: string): string[] {
  const d = parseDateString(dateStr);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    dates.push(formatDate(current));
  }
  return dates;
}
