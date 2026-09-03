import type {
  Habit,
  CompletionLog,
  StreakFreeze,
  GamificationState,
  UserSettings,
} from '../types';
import { formatDate, getWeekKey } from '../utils/date';
import { safeJsonParse, validateBackupPayload } from '../utils/security';

const STORAGE_KEYS = {
  HABITS: 'habitflow_habits_v1',
  LOGS: 'habitflow_logs_v1',
  FREEZES: 'habitflow_freezes_v1',
  GAMIFICATION: 'habitflow_gamification_v1',
  SETTINGS: 'habitflow_settings_v1',
  INITIALIZED: 'habitflow_initialized_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  soundEnabled: true,
  hapticsEnabled: true,
  notificationsEnabled: false,
  dailyReminderTime: '20:00',
};

const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 320,
  level: 3,
  unlockedBadges: [
    { badgeId: 'first_spark', unlockedAt: new Date(Date.now() - 86400000 * 7).toISOString(), seen: true },
    { badgeId: 'streak_3', unlockedAt: new Date(Date.now() - 86400000 * 4).toISOString(), seen: true },
  ],
  streakFreezesAvailable: 1,
  lastFreezeWeekKey: '',
};

export const StorageService = {
  /** Get all habits */
  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  /** Save all habits */
  saveHabits(habits: Habit[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage', e);
    }
  },

  /** Get completion logs */
  getLogs(): CompletionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  /** Save completion logs */
  saveLogs(logs: CompletionLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  },

  /** Get streak freezes */
  getFreezes(): StreakFreeze[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FREEZES);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  /** Save streak freezes */
  saveFreezes(freezes: StreakFreeze[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FREEZES, JSON.stringify(freezes));
    } catch (e) {
      console.error('Failed to save freezes to localStorage', e);
    }
  },

  /** Get gamification state, refreshing weekly freeze if new week */
  getGamification(): GamificationState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
      const state: GamificationState = data ? JSON.parse(data) : { ...DEFAULT_GAMIFICATION };

      // Check if we entered a new week, replenishing the streak freeze
      const currentWeekKey = getWeekKey(new Date());
      if (state.lastFreezeWeekKey !== currentWeekKey && state.streakFreezesAvailable < 1) {
        state.streakFreezesAvailable = 1;
        this.saveGamification(state);
      }

      return state;
    } catch {
      return { ...DEFAULT_GAMIFICATION };
    }
  },

  /** Save gamification state */
  saveGamification(state: GamificationState): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save gamification state', e);
    }
  },

  /** Get user settings */
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  /** Save user settings */
  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  /** Check if app has been initialized with demo seed */
  isInitialized(): boolean {
    return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
  },

  /** Export all data to JSON string for backup */
  exportAllData(): string {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      habits: this.getHabits(),
      logs: this.getLogs(),
      freezes: this.getFreezes(),
      gamification: this.getGamification(),
      settings: this.getSettings(),
    };
    return JSON.stringify(payload, null, 2);
  },

  /** Import data from JSON string with strict validation */
  importAllData(jsonString: string): boolean {
    const parseResult = safeJsonParse<any>(jsonString);
    if (!parseResult.success || !parseResult.data) {
      console.error('Import parse error:', parseResult.error);
      return false;
    }

    const parsed = parseResult.data;
    if (!validateBackupPayload(parsed)) {
      console.error('Invalid backup schema');
      return false;
    }

    try {
      if (Array.isArray(parsed.habits)) this.saveHabits(parsed.habits);
      if (Array.isArray(parsed.logs)) this.saveLogs(parsed.logs);
      if (Array.isArray(parsed.freezes)) this.saveFreezes(parsed.freezes);
      if (parsed.gamification) this.saveGamification(parsed.gamification);
      if (parsed.settings) this.saveSettings(parsed.settings);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      return true;
    } catch (e) {
      console.error('Storage write error during import', e);
      return false;
    }
  },

  /** Clear all data and reset */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.FREEZES);
    localStorage.removeItem(STORAGE_KEYS.GAMIFICATION);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  },

  /** Initialize with rich realistic seed data */
  seedDemoData(): {
    habits: Habit[];
    logs: CompletionLog[];
    freezes: StreakFreeze[];
    gamification: GamificationState;
  } {
    const now = new Date();

    const habits: Habit[] = [
      {
        id: 'habit-water-1',
        name: 'Drink 2.5L Water',
        description: 'Stay hydrated throughout the day',
        emoji: '💧',
        color: 'cyan',
        category: 'health',
        frequency: { type: 'daily' },
        reminderTime: '08:30',
        createdAt: new Date(now.getTime() - 86400000 * 25).toISOString(),
        order: 0,
      },
      {
        id: 'habit-workout-2',
        name: 'Morning Workout & Stretch',
        description: '30 mins kettlebell, calisthenics or cardio',
        emoji: '⚡',
        color: 'amber',
        category: 'fitness',
        frequency: { type: 'daily' },
        reminderTime: '07:00',
        createdAt: new Date(now.getTime() - 86400000 * 20).toISOString(),
        order: 1,
      },
      {
        id: 'habit-read-3',
        name: 'Read 20 Pages',
        description: 'Non-fiction books & articles',
        emoji: '📚',
        color: 'indigo',
        category: 'learning',
        frequency: { type: 'daily' },
        reminderTime: '21:30',
        createdAt: new Date(now.getTime() - 86400000 * 18).toISOString(),
        order: 2,
      },
      {
        id: 'habit-meditate-4',
        name: '10-Min Meditation',
        description: 'Mindful breathing & body scan',
        emoji: '🧘',
        color: 'violet',
        category: 'mindfulness',
        frequency: { type: 'specific_days', daysOfWeek: [1, 2, 3, 4, 5] }, // Weekdays
        reminderTime: '08:00',
        createdAt: new Date(now.getTime() - 86400000 * 15).toISOString(),
        order: 3,
      },
    ];

    const logs: CompletionLog[] = [];

    // Populate past 25 days of realistic data
    for (let dayOffset = 25; dayOffset >= 1; dayOffset--) {
      const d = new Date(now);
      d.setDate(now.getDate() - dayOffset);
      const dateStr = formatDate(d);

      // Water: completed almost every day (solid 18-day streak)
      if (dayOffset <= 18) {
        logs.push({
          id: `log-water-${dateStr}`,
          habitId: 'habit-water-1',
          date: dateStr,
          completedAt: new Date(d.getTime() + 3600000 * 14).toISOString(),
          xpEarned: 25,
        });
      }

      // Workout: 6-day current streak
      if (dayOffset <= 6) {
        logs.push({
          id: `log-workout-${dateStr}`,
          habitId: 'habit-workout-2',
          date: dateStr,
          completedAt: new Date(d.getTime() + 3600000 * 8).toISOString(),
          xpEarned: 25,
        });
      } else if (dayOffset % 2 === 0 && dayOffset > 6) {
        logs.push({
          id: `log-workout-${dateStr}`,
          habitId: 'habit-workout-2',
          date: dateStr,
          completedAt: new Date(d.getTime() + 3600000 * 8).toISOString(),
          xpEarned: 25,
        });
      }

      // Read: completed on most days
      if (dayOffset <= 12 && dayOffset !== 4) {
        logs.push({
          id: `log-read-${dateStr}`,
          habitId: 'habit-read-3',
          date: dateStr,
          completedAt: new Date(d.getTime() + 3600000 * 22).toISOString(),
          xpEarned: 25,
        });
      }

      // Meditate: weekdays
      const dow = d.getDay();
      if (dow >= 1 && dow <= 5 && dayOffset <= 14) {
        logs.push({
          id: `log-med-${dateStr}`,
          habitId: 'habit-meditate-4',
          date: dateStr,
          completedAt: new Date(d.getTime() + 3600000 * 9).toISOString(),
          xpEarned: 25,
        });
      }
    }

    // Streak freeze protection for Read on day 4
    const freezeDate = new Date(now);
    freezeDate.setDate(now.getDate() - 4);
    const freezeDateStr = formatDate(freezeDate);
    const freezes: StreakFreeze[] = [
      {
        id: 'freeze-read-sample',
        habitId: 'habit-read-3',
        date: freezeDateStr,
        weekKey: getWeekKey(freezeDate),
        usedAt: new Date(freezeDate.getTime() + 86400000).toISOString(),
      },
    ];

    const gamification = {
      ...DEFAULT_GAMIFICATION,
      xp: 425,
      level: 3,
    };

    this.saveHabits(habits);
    this.saveLogs(logs);
    this.saveFreezes(freezes);
    this.saveGamification(gamification);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

    return { habits, logs, freezes, gamification };
  },
};
