export interface AestheticTheme {
  id: string;
  name: string;
  emoji: string;
  category: 'gothic' | 'nature' | 'dreamy' | 'minimal' | 'cyber';
  description: string;
  backgroundClass: string;
  accentColor: string;
  accentGradient: string;
  badgeClass: string;
  cardClass: string;
  borderClass: string;
  glowColor: string;
  clockFontClass: string;
}

export const AESTHETIC_THEMES: AestheticTheme[] = [
  // 1. Gothic & Dark Romance Themes
  {
    id: 'gothic_cathedral',
    name: 'Gothic Cathedral',
    emoji: '🦇',
    category: 'gothic',
    description: 'Obsidian stone, crimson wine accents, and deep midnight shadows',
    backgroundClass: 'bg-gradient-to-br from-black via-zinc-950 to-rose-950/40 text-rose-50',
    accentColor: '#e11d48',
    accentGradient: 'from-rose-600 via-rose-700 to-red-900',
    badgeClass: 'bg-rose-950/80 text-rose-300 border border-rose-800/60',
    cardClass: 'bg-zinc-950/80 backdrop-blur-2xl border-rose-950/60 shadow-xl shadow-black/80',
    borderClass: 'border-rose-900/40',
    glowColor: 'bg-rose-600/15',
    clockFontClass: 'font-serif tracking-widest',
  },
  {
    id: 'dark_academia',
    name: 'Dark Academia',
    emoji: '🕯️',
    category: 'gothic',
    description: 'Aged parchment, vintage leather, espresso, and warm candlelight',
    backgroundClass: 'bg-gradient-to-br from-stone-950 via-amber-950/30 to-stone-900 text-stone-100',
    accentColor: '#d97706',
    accentGradient: 'from-amber-600 to-yellow-800',
    badgeClass: 'bg-amber-950/70 text-amber-200 border border-amber-800/50',
    cardClass: 'bg-stone-950/80 backdrop-blur-2xl border-amber-900/30 shadow-xl shadow-stone-950/80',
    borderClass: 'border-amber-900/30',
    glowColor: 'bg-amber-600/15',
    clockFontClass: 'font-serif tracking-wider',
  },
  {
    id: 'gothic_velvet',
    name: 'Gothic Velvet',
    emoji: '🥀',
    category: 'gothic',
    description: 'Midnight plum, crushed velvet burgundy, and silver moonlight',
    backgroundClass: 'bg-gradient-to-br from-black via-purple-950/40 to-fuchsia-950/30 text-purple-100',
    accentColor: '#c026d3',
    accentGradient: 'from-fuchsia-600 to-purple-900',
    badgeClass: 'bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-800/50',
    cardClass: 'bg-black/80 backdrop-blur-2xl border-purple-900/40 shadow-2xl shadow-purple-950/40',
    borderClass: 'border-fuchsia-900/40',
    glowColor: 'bg-fuchsia-600/15',
    clockFontClass: 'font-serif tracking-widest',
  },

  // 2. Dreamy & Ambient Flocus Themes
  {
    id: 'dreamy_lavender',
    name: 'Dreamy Lavender',
    emoji: '🪻',
    category: 'dreamy',
    description: 'Soft pastel violet, floating hazy clouds, and ethereal calm',
    backgroundClass: 'bg-gradient-to-br from-slate-950 via-purple-950/40 to-indigo-950/30 text-slate-100',
    accentColor: '#8b5cf6',
    accentGradient: 'from-violet-600 to-indigo-600',
    badgeClass: 'bg-violet-950/60 text-violet-300 border border-violet-800/50',
    cardClass: 'bg-slate-900/70 backdrop-blur-2xl border-violet-800/30 shadow-xl shadow-violet-950/20',
    borderClass: 'border-violet-800/30',
    glowColor: 'bg-violet-500/20',
    clockFontClass: 'font-sans tracking-tight',
  },
  {
    id: 'golden_sunset',
    name: 'Golden Hour',
    emoji: '🌅',
    category: 'dreamy',
    description: 'Warm honey, desert horizon, and gentle sunset dusk glow',
    backgroundClass: 'bg-gradient-to-br from-stone-950 via-orange-950/30 to-amber-950/30 text-stone-100',
    accentColor: '#f97316',
    accentGradient: 'from-orange-500 to-amber-600',
    badgeClass: 'bg-orange-950/70 text-orange-200 border border-orange-800/50',
    cardClass: 'bg-stone-900/70 backdrop-blur-2xl border-orange-800/30 shadow-xl shadow-orange-950/20',
    borderClass: 'border-orange-800/30',
    glowColor: 'bg-orange-500/20',
    clockFontClass: 'font-sans tracking-tight',
  },

  // 3. Nature & Serenity Themes
  {
    id: 'forest_zen',
    name: 'Forest Zen',
    emoji: '🍃',
    category: 'nature',
    description: 'Deep moss pine, foggy morning eucalyptus, and tranquil rain',
    backgroundClass: 'bg-gradient-to-br from-slate-950 via-emerald-950/40 to-teal-950/30 text-emerald-100',
    accentColor: '#10b981',
    accentGradient: 'from-emerald-500 to-teal-700',
    badgeClass: 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50',
    cardClass: 'bg-slate-900/70 backdrop-blur-2xl border-emerald-800/30 shadow-xl shadow-emerald-950/20',
    borderClass: 'border-emerald-800/30',
    glowColor: 'bg-emerald-500/20',
    clockFontClass: 'font-sans tracking-tight',
  },
  {
    id: 'abyssal_ocean',
    name: 'Abyssal Ocean',
    emoji: '🌊',
    category: 'nature',
    description: 'Deep midnight oceanic trench with bioluminescent turquoise',
    backgroundClass: 'bg-gradient-to-br from-slate-950 via-cyan-950/40 to-blue-950/40 text-cyan-100',
    accentColor: '#06b6d4',
    accentGradient: 'from-cyan-500 to-blue-700',
    badgeClass: 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/50',
    cardClass: 'bg-slate-900/70 backdrop-blur-2xl border-cyan-800/30 shadow-xl shadow-cyan-950/20',
    borderClass: 'border-cyan-800/30',
    glowColor: 'bg-cyan-500/20',
    clockFontClass: 'font-sans tracking-tight',
  },

  // 4. Cyber & Minimal Themes
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Neon',
    emoji: '⚡',
    category: 'cyber',
    description: 'High-tech pitch dark with electric ultraviolet and cyan lasers',
    backgroundClass: 'bg-gradient-to-br from-slate-950 via-violet-950/50 to-slate-950 text-cyan-100',
    accentColor: '#a855f7',
    accentGradient: 'from-fuchsia-500 via-violet-600 to-cyan-500',
    badgeClass: 'bg-fuchsia-950/80 text-cyan-300 border border-fuchsia-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    cardClass: 'bg-slate-950/85 backdrop-blur-2xl border-violet-600/40 shadow-2xl shadow-violet-950/50',
    borderClass: 'border-violet-500/40',
    glowColor: 'bg-violet-600/25',
    clockFontClass: 'font-mono tracking-wider',
  },
  {
    id: 'pure_minimal',
    name: 'Pure Minimal',
    emoji: '☁️',
    category: 'minimal',
    description: 'Clean architectural monochromes with crisp high-contrast focus',
    backgroundClass: 'bg-slate-950 text-slate-100',
    accentColor: '#f8fafc',
    accentGradient: 'from-slate-100 to-slate-400',
    badgeClass: 'bg-slate-800 text-white border border-slate-700',
    cardClass: 'bg-slate-900/90 backdrop-blur-xl border-slate-800 shadow-xl',
    borderClass: 'border-slate-800',
    glowColor: 'bg-slate-500/10',
    clockFontClass: 'font-mono tracking-tight',
  },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements.", author: "John C. Maxwell" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "Focus is a muscle. The more you practice, the easier it flows.", author: "Flocus Wisdom" },
  { text: "Action creates momentum. Momentum creates results.", author: "Daily Flow" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
];
