export type FrequencyType = 'daily' | 'specific_days' | 'times_per_week';

export type HabitCategory =
  | 'health'
  | 'fitness'
  | 'mindfulness'
  | 'productivity'
  | 'learning'
  | 'creativity'
  | 'finance'
  | 'custom';

export interface FrequencyConfig {
  type: FrequencyType;
  /** 0 = Sunday, 1 = Monday, ..., 6 = Saturday */
  daysOfWeek?: number[];
  /** target times per week, e.g. 3 times */
  timesPerWeek?: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  color: string; // Color key from COLOR_PALETTES or hex
  category: HabitCategory;
  frequency: FrequencyConfig;
  reminderTime?: string; // e.g. "08:30"
  createdAt: string; // ISO date
  order: number;
  archived?: boolean;
}

export interface CompletionLog {
  id: string;
  habitId: string;
  date: string; // "YYYY-MM-DD"
  completedAt: string; // ISO string
  xpEarned: number;
}

export interface StreakFreeze {
  id: string;
  habitId: string;
  date: string; // "YYYY-MM-DD" protected date
  weekKey: string; // "YYYY-Www" to enforce 1 per week per user/habit
  usedAt: string;
}

export interface DayConsistency {
  dayName: string; // 'M', 'T', 'W', etc.
  date: string; // 'YYYY-MM-DD'
  isCompleted: boolean;
  isScheduled: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isCompletedToday: boolean;
  isFrozenToday: boolean;
  totalCompletions: number;
  completionRateLast30Days: number;
  lastCompletedDate?: string;
  weeklyConsistency?: DayConsistency[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'consistency' | 'volume' | 'mastery' | 'special';
  requiredCount: number;
  gradient: string;
}

export interface UnlockedBadge {
  badgeId: string;
  unlockedAt: string;
  seen: boolean;
}

export interface GamificationState {
  xp: number;
  level: number;
  unlockedBadges: UnlockedBadge[];
  streakFreezesAvailable: number; // 1 available per week
  lastFreezeWeekKey: string; // tracks week of last freeze use
}

export interface UserSettings {
  theme: 'system' | 'light' | 'dark';
  aestheticTheme?: string; // 'gothic' | 'dark_academia' | 'gothic_velvet' | 'lavender' | 'sunset' | 'zen' | 'cyber' | 'ocean' | 'minimal'
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  dailyReminderTime: string;
}

export interface HabitFormData {
  name: string;
  description: string;
  emoji: string;
  color: string;
  category: HabitCategory;
  frequency: FrequencyConfig;
  reminderTime: string;
}

export type ActiveTab = 'today' | 'habits' | 'calendar' | 'analytics' | 'badges' | 'settings';
