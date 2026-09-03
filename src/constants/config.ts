import type { Badge, HabitCategory } from '../types';

/** Central animation constants - spring physics & durations */
export const ANIMATION_CONFIG = {
  // Framer motion spring curves
  spring: {
    bounce: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 17,
    },
    gentle: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 24,
    },
    snappy: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 28,
    },
    wobbly: {
      type: 'spring' as const,
      stiffness: 600,
      damping: 14,
    },
  },
  // Interaction scales
  tapScale: 0.94,
  hoverScale: 1.02,
  // Millisecond transition timing
  tabTransitionDuration: 0.25,
  counterRollDurationMs: 650,
  xpFloatingFadeMs: 1200,
};

/** Gamification XP parameters */
export const XP_CONFIG = {
  basePerCompletion: 25,
  streakBonusMultiplier: 5,
  maxStreakBonus: 50,
  perfectDayBonus: 60,
  freezeRescueXp: 15,
};

/** Level thresholds and titles */
export const LEVEL_TIERS = [
  { level: 1, minXp: 0, title: 'Seedling Sprout', icon: '🌱' },
  { level: 2, minXp: 100, title: 'Momentum Builder', icon: '🌿' },
  { level: 3, minXp: 280, title: 'Consistency Scout', icon: '⚡' },
  { level: 4, minXp: 550, title: 'Daily Champion', icon: '🔥' },
  { level: 5, minXp: 950, title: 'Habit Architect', icon: '🏛️' },
  { level: 6, minXp: 1500, title: 'Flow Master', icon: '🌊' },
  { level: 7, minXp: 2250, title: 'Unshakable Will', icon: '💎' },
  { level: 8, minXp: 3200, title: 'Zen Titan', icon: '🧘' },
  { level: 9, minXp: 4500, title: 'Grandmaster of Routine', icon: '👑' },
  { level: 10, minXp: 6200, title: 'Legendary Momentum', icon: '🌌' },
];

export function calculateLevelFromXp(xp: number): {
  level: number;
  title: string;
  icon: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  let tier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      tier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || {
        level: tier.level + 1,
        minXp: tier.minXp + 2000,
        title: 'Infinite Master',
        icon: '✨',
      };
      break;
    }
  }

  const range = nextTier.minXp - tier.minXp;
  const earnedInRange = Math.max(0, xp - tier.minXp);
  const progressPercent = Math.min(100, Math.round((earnedInRange / range) * 100));

  return {
    level: tier.level,
    title: tier.title,
    icon: tier.icon,
    currentLevelXp: earnedInRange,
    nextLevelXp: range,
    progressPercent,
  };
}

/** Pre-defined unlockable badges */
export const BADGES_CATALOG: Badge[] = [
  {
    id: 'first_spark',
    title: 'First Spark',
    description: 'Complete your first habit and ignite the fire.',
    icon: '⚡',
    category: 'first_step' as any,
    requiredCount: 1,
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'streak_3',
    title: 'Hat Trick',
    description: 'Reach a 3-day streak on any active habit.',
    icon: '🥉',
    category: 'streak',
    requiredCount: 3,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'streak_7',
    title: 'Week of Power',
    description: 'Maintain a 7-day streak. Habit formation is under way!',
    icon: '🔥',
    category: 'streak',
    requiredCount: 7,
    gradient: 'from-orange-500 to-rose-600',
  },
  {
    id: 'streak_14',
    title: 'Fortnight Fortress',
    description: 'Maintain a solid 14-day streak without missing a beat.',
    icon: '🛡️',
    category: 'streak',
    requiredCount: 14,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'streak_30',
    title: 'Monthly Legend',
    description: 'Reach a monumental 30-day streak. You are in the top 1%!',
    icon: '👑',
    category: 'streak',
    requiredCount: 30,
    gradient: 'from-amber-300 via-yellow-500 to-orange-500',
  },
  {
    id: 'freeze_savior',
    title: 'Ice In The Veins',
    description: 'Protect a streak from breaking using a Streak Freeze.',
    icon: '🧊',
    category: 'special',
    requiredCount: 1,
    gradient: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'century_club',
    title: 'Centurion',
    description: 'Log 100 total habit completions over all time.',
    icon: '💯',
    category: 'volume',
    requiredCount: 100,
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'perfect_day',
    title: 'Flawless Day',
    description: 'Complete all scheduled habits on a single day.',
    icon: '⭐',
    category: 'consistency',
    requiredCount: 1,
    gradient: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'habit_architect',
    title: 'Habit Architect',
    description: 'Create and maintain 4 or more active habits.',
    icon: '🏛️',
    category: 'mastery',
    requiredCount: 4,
    gradient: 'from-violet-500 to-purple-700',
  },
];

/** Curated vibrant color palettes */
export interface ColorTheme {
  id: string;
  name: string;
  hex: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  borderLight: string;
  borderDark: string;
  glowClass: string;
  gradient: string;
}

export const COLOR_PALETTES: ColorTheme[] = [
  {
    id: 'violet',
    name: 'Electric Violet',
    hex: '#8b5cf6',
    bgLight: 'bg-violet-100',
    bgDark: 'dark:bg-violet-950/60',
    textLight: 'text-violet-700',
    textDark: 'dark:text-violet-300',
    borderLight: 'border-violet-200',
    borderDark: 'dark:border-violet-800/50',
    glowClass: 'shadow-violet-500/30',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    hex: '#10b981',
    bgLight: 'bg-emerald-100',
    bgDark: 'dark:bg-emerald-950/60',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
    borderLight: 'border-emerald-200',
    borderDark: 'dark:border-emerald-800/50',
    glowClass: 'shadow-emerald-500/30',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    hex: '#f59e0b',
    bgLight: 'bg-amber-100',
    bgDark: 'dark:bg-amber-950/60',
    textLight: 'text-amber-800',
    textDark: 'dark:text-amber-300',
    borderLight: 'border-amber-200',
    borderDark: 'dark:border-amber-800/50',
    glowClass: 'shadow-amber-500/30',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'rose',
    name: 'Rose Coral',
    hex: '#f43f5e',
    bgLight: 'bg-rose-100',
    bgDark: 'dark:bg-rose-950/60',
    textLight: 'text-rose-700',
    textDark: 'dark:text-rose-300',
    borderLight: 'border-rose-200',
    borderDark: 'dark:border-rose-800/50',
    glowClass: 'shadow-rose-500/30',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'cyan',
    name: 'Ocean Cyan',
    hex: '#06b6d4',
    bgLight: 'bg-cyan-100',
    bgDark: 'dark:bg-cyan-950/60',
    textLight: 'text-cyan-800',
    textDark: 'dark:text-cyan-300',
    borderLight: 'border-cyan-200',
    borderDark: 'dark:border-cyan-800/50',
    glowClass: 'shadow-cyan-500/30',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'indigo',
    name: 'Cosmic Indigo',
    hex: '#6366f1',
    bgLight: 'bg-indigo-100',
    bgDark: 'dark:bg-indigo-950/60',
    textLight: 'text-indigo-800',
    textDark: 'dark:text-indigo-300',
    borderLight: 'border-indigo-200',
    borderDark: 'dark:border-indigo-800/50',
    glowClass: 'shadow-indigo-500/30',
    gradient: 'from-indigo-500 to-blue-600',
  },
];

export function getColorTheme(colorId: string): ColorTheme {
  return COLOR_PALETTES.find((c) => c.id === colorId) || COLOR_PALETTES[0];
}

/** Category options with default icons and labels */
export const CATEGORY_METADATA: Record<
  HabitCategory,
  { label: string; defaultEmoji: string; color: string }
> = {
  health: { label: 'Health & Wellness', defaultEmoji: '💧', color: 'cyan' },
  fitness: { label: 'Fitness & Workout', defaultEmoji: '🏃', color: 'emerald' },
  mindfulness: { label: 'Mindfulness & Mental', defaultEmoji: '🧘', color: 'violet' },
  productivity: { label: 'Productivity & Focus', defaultEmoji: '🎯', color: 'amber' },
  learning: { label: 'Reading & Learning', defaultEmoji: '📚', color: 'indigo' },
  creativity: { label: 'Creativity & Arts', defaultEmoji: '🎨', color: 'rose' },
  finance: { label: 'Wealth & Finance', defaultEmoji: '💰', color: 'emerald' },
  custom: { label: 'Personal & Other', defaultEmoji: '✨', color: 'violet' },
};

/** Quick-start starter habit templates for empty states */
export const STARTER_TEMPLATES = [
  {
    name: 'Drink 2L Water',
    description: 'Stay hydrated through the day for energy and focus',
    emoji: '💧',
    color: 'cyan',
    category: 'health' as HabitCategory,
    frequency: { type: 'daily' as const },
    reminderTime: '09:00',
  },
  {
    name: '15-Minute Morning Walk',
    description: 'Get daylight and brisk steps to wake up naturally',
    emoji: '👟',
    color: 'emerald',
    category: 'fitness' as HabitCategory,
    frequency: { type: 'daily' as const },
    reminderTime: '07:30',
  },
  {
    name: 'Read 15 Pages',
    description: 'Expand your knowledge one chapter every evening',
    emoji: '📖',
    color: 'indigo',
    category: 'learning' as HabitCategory,
    frequency: { type: 'daily' as const },
    reminderTime: '21:30',
  },
  {
    name: 'Deep Breath & Meditate',
    description: '5 minutes of box breathing to reset your nervous system',
    emoji: '🧘',
    color: 'violet',
    category: 'mindfulness' as HabitCategory,
    frequency: { type: 'daily' as const },
    reminderTime: '08:00',
  },
];
