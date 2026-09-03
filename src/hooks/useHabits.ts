import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type {
  Habit,
  CompletionLog,
  StreakFreeze,
  UserSettings,
  StreakInfo,
  HabitFormData,
} from '../types';
import { StorageService } from '../services/storage';
import { SoundEngine } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { calculateHabitStreak } from '../utils/streaks';
import { getTodayDateString, getWeekKey } from '../utils/date';
import { useGamification } from './useGamification';
import { XP_CONFIG } from '../constants/config';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<CompletionLog[]>([]);
  const [freezes, setFreezes] = useState<StreakFreeze[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Gamification hook
  const {
    gamification,
    levelInfo,
    awardXp,
    evaluateBadges,
    levelUpData,
    dismissLevelUp,
    newlyUnlockedBadge,
    dismissBadgeModal,
    setGamificationState,
  } = useGamification(
    StorageService.getGamification(),
    settings.soundEnabled,
    settings.hapticsEnabled
  );

  // Load initial data
  useEffect(() => {
    let initialHabits = StorageService.getHabits();
    let initialLogs = StorageService.getLogs();
    let initialFreezes = StorageService.getFreezes();

    // If first launch, seed rich demo data
    if (!StorageService.isInitialized() || initialHabits.length === 0) {
      const seeded = StorageService.seedDemoData();
      initialHabits = seeded.habits;
      initialLogs = seeded.logs;
      initialFreezes = seeded.freezes;
      setGamificationState(seeded.gamification);
    }

    setHabits(initialHabits.sort((a, b) => a.order - b.order));
    setLogs(initialLogs);
    setFreezes(initialFreezes);
    setIsLoading(false);
  }, []);

  // Compute streaks for all habits
  const streakMap = useMemo(() => {
    const map = new Map<string, StreakInfo>();
    for (const habit of habits) {
      map.set(habit.id, calculateHabitStreak(habit, logs, freezes));
    }
    return map;
  }, [habits, logs, freezes]);

  // Overall longest streak across all habits
  const overallMaxStreak = useMemo(() => {
    let max = 0;
    for (const info of streakMap.values()) {
      if (info.longestStreak > max) max = info.longestStreak;
    }
    return max;
  }, [streakMap]);

  /**
   * Toggle completion for a habit on a given date (defaults to today)
   */
  const toggleCompletion = useCallback(
    (habitId: string, targetDate = getTodayDateString(), clickCoords?: { x: number; y: number }) => {
      const existingLogIndex = logs.findIndex(
        (l) => l.habitId === habitId && l.date === targetDate
      );

      if (existingLogIndex >= 0) {
        // Uncomplete
        const removedLog = logs[existingLogIndex];
        const newLogs = logs.filter((_, idx) => idx !== existingLogIndex);
        setLogs(newLogs);
        StorageService.saveLogs(newLogs);

        // Deduct XP
        awardXp(-removedLog.xpEarned);
        HapticsService.light(settings.hapticsEnabled);
      } else {
        // Complete
        const streakInfo = streakMap.get(habitId);
        const currentStreak = streakInfo ? streakInfo.currentStreak : 0;
        const streakBonus = Math.min(
          currentStreak * XP_CONFIG.streakBonusMultiplier,
          XP_CONFIG.maxStreakBonus
        );
        const earnedXp = XP_CONFIG.basePerCompletion + streakBonus;

        const newLog: CompletionLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          habitId,
          date: targetDate,
          completedAt: new Date().toISOString(),
          xpEarned: earnedXp,
        };

        const newLogs = [...logs, newLog];
        setLogs(newLogs);
        StorageService.saveLogs(newLogs);

        // Sound & Haptic
        SoundEngine.playPop(settings.soundEnabled);
        HapticsService.medium(settings.hapticsEnabled);

        // Fire localized Confetti
        try {
          const originX = clickCoords ? clickCoords.x / window.innerWidth : 0.5;
          const originY = clickCoords ? clickCoords.y / window.innerHeight : 0.6;

          confetti({
            particleCount: 40,
            spread: 60,
            origin: { x: originX, y: originY },
            colors: ['#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'],
            ticks: 150,
            gravity: 1.2,
            scalar: 0.85,
            shapes: ['circle', 'square'],
            disableForReducedMotion: true,
          });
        } catch {
          // Confetti fallback
        }

        // Award XP and evaluate badges
        awardXp(earnedXp);
        evaluateBadges(habits, newLogs, freezes, Math.max(overallMaxStreak, currentStreak + 1));
      }
    },
    [logs, streakMap, settings, awardXp, evaluateBadges, habits, freezes, overallMaxStreak]
  );

  /**
   * Apply a streak freeze to protect a missed habit day
   */
  const applyFreeze = useCallback(
    (habitId: string, targetDate: string) => {
      if (gamification.streakFreezesAvailable <= 0) return false;

      const currentWeekKey = getWeekKey(new Date());
      const newFreeze: StreakFreeze = {
        id: `freeze-${Date.now()}`,
        habitId,
        date: targetDate,
        weekKey: currentWeekKey,
        usedAt: new Date().toISOString(),
      };

      const updatedFreezes = [...freezes, newFreeze];
      setFreezes(updatedFreezes);
      StorageService.saveFreezes(updatedFreezes);

      const updatedGamification = {
        ...gamification,
        streakFreezesAvailable: gamification.streakFreezesAvailable - 1,
        lastFreezeWeekKey: currentWeekKey,
      };
      setGamificationState(updatedGamification);
      StorageService.saveGamification(updatedGamification);

      SoundEngine.playFreeze(settings.soundEnabled);
      HapticsService.light(settings.hapticsEnabled);

      // Check for freeze savior badge
      evaluateBadges(habits, logs, updatedFreezes, overallMaxStreak);
      return true;
    },
    [gamification, freezes, settings, habits, logs, overallMaxStreak, evaluateBadges, setGamificationState]
  );

  /**
   * Add a new habit
   */
  const addHabit = useCallback(
    (formData: HabitFormData) => {
      const newHabit: Habit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: formData.name.trim(),
        description: formData.description.trim(),
        emoji: formData.emoji || '⚡',
        color: formData.color || 'violet',
        category: formData.category || 'custom',
        frequency: formData.frequency,
        reminderTime: formData.reminderTime || undefined,
        createdAt: new Date().toISOString(),
        order: habits.length,
      };

      const updated = [...habits, newHabit];
      setHabits(updated);
      StorageService.saveHabits(updated);

      HapticsService.light(settings.hapticsEnabled);
      evaluateBadges(updated, logs, freezes, overallMaxStreak);
      return newHabit;
    },
    [habits, settings, evaluateBadges, logs, freezes, overallMaxStreak]
  );

  /**
   * Update an existing habit
   */
  const updateHabit = useCallback(
    (habitId: string, formData: Partial<HabitFormData>) => {
      const updated = habits.map((h) => {
        if (h.id !== habitId) return h;
        return {
          ...h,
          name: formData.name !== undefined ? formData.name.trim() : h.name,
          description: formData.description !== undefined ? formData.description.trim() : h.description,
          emoji: formData.emoji || h.emoji,
          color: formData.color || h.color,
          category: formData.category || h.category,
          frequency: formData.frequency || h.frequency,
          reminderTime: formData.reminderTime !== undefined ? formData.reminderTime : h.reminderTime,
        };
      });

      setHabits(updated);
      StorageService.saveHabits(updated);
      HapticsService.light(settings.hapticsEnabled);
    },
    [habits, settings]
  );

  /**
   * Delete a habit and its logs
   */
  const deleteHabit = useCallback(
    (habitId: string) => {
      const updatedHabits = habits.filter((h) => h.id !== habitId);
      const updatedLogs = logs.filter((l) => l.habitId !== habitId);
      const updatedFreezes = freezes.filter((f) => f.habitId !== habitId);

      setHabits(updatedHabits);
      setLogs(updatedLogs);
      setFreezes(updatedFreezes);

      StorageService.saveHabits(updatedHabits);
      StorageService.saveLogs(updatedLogs);
      StorageService.saveFreezes(updatedFreezes);

      HapticsService.heavy(settings.hapticsEnabled);
    },
    [habits, logs, freezes, settings]
  );

  /**
   * Reorder habits (used with Framer Motion Reorder)
   */
  const reorderHabits = useCallback(
    (newOrder: Habit[]) => {
      const reindexed = newOrder.map((habit, index) => ({
        ...habit,
        order: index,
      }));
      setHabits(reindexed);
      StorageService.saveHabits(reindexed);
    },
    []
  );

  /**
   * Update user settings
   */
  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      StorageService.saveSettings(updated);
    },
    [settings]
  );

  /**
   * Reset to demo seed data
   */
  const resetToDemoData = useCallback(() => {
    const seeded = StorageService.seedDemoData();
    setHabits(seeded.habits);
    setLogs(seeded.logs);
    setFreezes(seeded.freezes);
    setGamificationState(seeded.gamification);
  }, [setGamificationState]);

  /**
   * Clear all user data
   */
  const clearAllData = useCallback(() => {
    StorageService.clearAll();
    setHabits([]);
    setLogs([]);
    setFreezes([]);
    setGamificationState(StorageService.getGamification());
  }, [setGamificationState]);

  return {
    habits,
    logs,
    freezes,
    streakMap,
    overallMaxStreak,
    isLoading,
    // Gamification
    gamification,
    levelInfo,
    levelUpData,
    dismissLevelUp,
    newlyUnlockedBadge,
    dismissBadgeModal,
    // Actions
    toggleCompletion,
    applyFreeze,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    // Settings
    settings,
    updateSettings,
    resetToDemoData,
    clearAllData,
  };
}
