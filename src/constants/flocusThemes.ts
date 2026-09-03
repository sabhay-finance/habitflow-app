export interface AmbientTheme {
  id: string;
  name: string;
  emoji: string;
  backgroundClass: string;
  accentColor: string;
  glassClass: string;
}

export const AMBIENT_THEMES: AmbientTheme[] = [
  {
    id: 'lavender',
    name: 'Dreamy Lavender',
    emoji: '🪻',
    backgroundClass: 'bg-gradient-to-br from-violet-950/40 via-purple-900/10 to-slate-950',
    accentColor: '#8b5cf6',
    glassClass: 'bg-white/70 dark:bg-slate-900/60 border-violet-500/20 shadow-violet-500/5',
  },
  {
    id: 'sunset',
    name: 'Golden Hour',
    emoji: '🌅',
    backgroundClass: 'bg-gradient-to-br from-amber-950/40 via-rose-900/10 to-slate-950',
    accentColor: '#f59e0b',
    glassClass: 'bg-white/70 dark:bg-slate-900/60 border-amber-500/20 shadow-amber-500/5',
  },
  {
    id: 'zen',
    name: 'Forest Zen',
    emoji: '🍃',
    backgroundClass: 'bg-gradient-to-br from-emerald-950/40 via-teal-900/10 to-slate-950',
    accentColor: '#10b981',
    glassClass: 'bg-white/70 dark:bg-slate-900/60 border-emerald-500/20 shadow-emerald-500/5',
  },
  {
    id: 'midnight',
    name: 'Midnight Flow',
    emoji: '🌌',
    backgroundClass: 'bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950',
    accentColor: '#6366f1',
    glassClass: 'bg-white/70 dark:bg-slate-900/60 border-indigo-500/20 shadow-indigo-500/5',
  },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements.", author: "John C. Maxwell" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Focus is a muscle. The more you practice, the easier it flows.", author: "Flocus Wisdom" },
  { text: "One day or Day One. You decide.", author: "Unknown" },
  { text: "Action creates momentum. Momentum creates results.", author: "Daily Flow" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
];
