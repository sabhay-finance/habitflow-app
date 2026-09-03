import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Palette,
  Music,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Habit, StreakInfo } from '../../types';
import type { AestheticTheme } from '../../constants/flocusThemes';
import { MOTIVATIONAL_QUOTES } from '../../constants/flocusThemes';
import { AmbientSoundEngine, type SoundscapeType } from '../../services/ambientAudio';
import { SoundEngine } from '../../services/sound';
import { HapticsService } from '../../services/haptics';
import { CURATED_CHANNELS } from '../music/FlocusMusicPlayer';
import { Button } from '../common/Button';

interface FlocusHomeViewProps {
  habits: Habit[];
  streakMap: Map<string, StreakInfo>;
  activeTheme: AestheticTheme;
  onOpenThemeModal: () => void;
  onNavigateToHabits: () => void;
  onToggleHabit: (habitId: string, date?: string, coords?: { x: number; y: number }) => void;
  onAwardXp: (xp: number) => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export const FlocusHomeView: React.FC<FlocusHomeViewProps> = ({
  habits,
  streakMap,
  activeTheme,
  onOpenThemeModal,
  onNavigateToHabits,
  onToggleHabit,
  onAwardXp,
  soundEnabled,
  hapticsEnabled,
}) => {
  // Live clock & greeting state
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Welcome');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Focus Timer state
  const [selectedPresetMinutes, setSelectedPresetMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Audio center state
  const [audioCategory, setAudioCategory] = useState<'music' | 'ambience'>('music');
  const [selectedMusicId, setSelectedMusicId] = useState<string>('cas');
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>('off');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.35);

  const timerRef = useRef<any>(null);

  // Update clock every second
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${mins} ${ampm}`);

      setCurrentDate(
        now.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })
      );

      if (hours < 12) setGreeting('Good Morning');
      else if (hours < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Update selected habit when habits load
  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  // Handle countdown
  useEffect(() => {
    if (isRunning && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeftSeconds]);

  const handleFinishSession = () => {
    setIsRunning(false);
    setIsFinished(true);
    SoundEngine.playFanfare(soundEnabled);
    HapticsService.celebration(hapticsEnabled);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: [activeTheme.accentColor, '#ffffff', '#a855f7'],
      });
    } catch {}

    onAwardXp(50);
  };

  const handleSelectPreset = (mins: number) => {
    setSelectedPresetMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    setIsRunning(false);
    setIsFinished(false);
  };

  const toggleTimer = () => {
    if (isFinished) {
      handleSelectPreset(selectedPresetMinutes);
      return;
    }
    const next = !isRunning;
    setIsRunning(next);
    HapticsService.light(hapticsEnabled);

    if (next && activeSoundscape !== 'off' && audioCategory === 'ambience') {
      AmbientSoundEngine.play(activeSoundscape);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeftSeconds(selectedPresetMinutes * 60);
    setIsFinished(false);
    HapticsService.light(hapticsEnabled);
  };

  const handleSoundscapeChange = (type: SoundscapeType) => {
    setActiveSoundscape(type);
    if (type === 'off') {
      AmbientSoundEngine.stop();
    } else {
      AmbientSoundEngine.play(type);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    AmbientSoundEngine.setVolume(vol);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];
  const activeMusic = CURATED_CHANNELS.find((c) => c.id === selectedMusicId) || CURATED_CHANNELS[0];

  // Time calculations
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = selectedPresetMinutes * 60;
  const progressPercent = totalSeconds > 0 ? (timeLeftSeconds / totalSeconds) * 100 : 0;
  const circleRadius = 90;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  // Habits completed today count
  const completedTodayCount = habits.filter((h) => {
    const info = streakMap.get(h.id);
    return info?.isCompletedToday;
  }).length;

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header Atmosphere Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold opacity-75 uppercase tracking-widest">
            {currentDate}
          </span>
        </div>

        {/* Aesthetic Theme Switcher Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenThemeModal}
          className={`px-3.5 py-1.5 rounded-2xl ${activeTheme.cardClass} flex items-center gap-2 text-xs font-black shadow-sm transition-all border ${activeTheme.borderClass}`}
        >
          <span className="text-base">{activeTheme.emoji}</span>
          <span className="hidden sm:inline font-semibold">{activeTheme.name}</span>
          <Palette className="w-3.5 h-3.5 opacity-60" />
        </motion.button>
      </div>

      {/* 2. Giant Aesthetic Clock & Greeting */}
      <div className="text-center space-y-2 select-none relative">
        <div
          className={`absolute inset-x-0 -top-12 h-36 ${activeTheme.glowColor} blur-3xl rounded-full pointer-events-none opacity-40`}
        />

        <motion.h1
          key={currentTime}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className={`text-6xl sm:text-7xl md:text-8xl font-black ${activeTheme.clockFontClass} tracking-tight`}
        >
          {currentTime || '02:00 PM'}
        </motion.h1>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight opacity-90">
          {greeting} ✨
        </h2>

        {/* Aesthetic Quote Bar */}
        <div className="flex items-center justify-center gap-2 pt-1 max-w-xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              className="text-xs sm:text-sm opacity-70 italic"
            >
              "{currentQuote.text}" — <span className="font-semibold">{currentQuote.author}</span>
            </motion.p>
          </AnimatePresence>
          <button
            onClick={() => setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity shrink-0"
            title="Next Quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Centerpiece Focus Sanctuary & Pomodoro Ring */}
      <div
        className={`p-6 sm:p-8 rounded-3xl ${activeTheme.cardClass} border ${activeTheme.borderClass} max-w-xl mx-auto flex flex-col items-center relative overflow-hidden`}
      >
        {/* Presets Toggle Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 mb-6 text-xs">
          {[
            { label: '25m Focus', minutes: 25 },
            { label: '5m Break', minutes: 5 },
            { label: '15m Deep', minutes: 15 },
            { label: '45m Flow', minutes: 45 },
          ].map((preset) => (
            <button
              key={preset.minutes}
              onClick={() => handleSelectPreset(preset.minutes)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedPresetMinutes === preset.minutes
                  ? `bg-gradient-to-r ${activeTheme.accentGradient} text-white shadow-md`
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Habit Linker */}
        {habits.length > 0 && (
          <div className="w-full max-w-xs mb-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 text-center">
              Linking Focus To:
            </label>
            <select
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer text-center"
            >
              {habits.map((h) => (
                <option key={h.id} value={h.id} className="bg-zinc-900 text-white">
                  {h.emoji} {h.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Circular Countdown Ring */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-6 select-none">
          <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={circleRadius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-white/10"
              fill="transparent"
            />
            <motion.circle
              cx="100"
              cy="100"
              r={circleRadius}
              stroke={activeTheme.accentColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className={`text-5xl font-black ${activeTheme.clockFontClass} tracking-tight tabular-nums`}
            >
              {formattedTimer}
            </span>
            <span className="text-xs text-white/60 font-semibold mt-1">
              {isFinished ? 'Session Finished! 🎉' : isRunning ? 'In Deep Flow...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-colors border border-white/10"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${activeTheme.accentGradient} text-white flex items-center justify-center shadow-xl shadow-rose-900/30 transition-all`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-0.5" />
            )}
          </motion.button>
        </div>

        {/* Session Finished Action Callout */}
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 text-center space-y-2"
          >
            <div className="text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>+50 Focus XP Earned!</span>
            </div>
            {selectedHabit && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onToggleHabit(selectedHabit.id);
                  setIsFinished(false);
                }}
                icon={<CheckCircle2 className="w-4 h-4" />}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Mark "{selectedHabit.name}" Done!
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* 4. Flocus Audio Sanctuary (Cigarettes After Sex, Billie Eilish, Ambience) */}
      <div
        className={`p-5 sm:p-6 rounded-3xl ${activeTheme.cardClass} border ${activeTheme.borderClass} max-w-xl mx-auto space-y-4`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeTheme.accentGradient} flex items-center justify-center text-white`}>
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">Audio Companion</h3>
              <p className="text-[11px] opacity-60">Music Lounge &amp; Procedural Ambience</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/40 border border-white/10 text-xs">
            <button
              onClick={() => setAudioCategory('music')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                audioCategory === 'music'
                  ? `bg-gradient-to-r ${activeTheme.accentGradient} text-white shadow`
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => setAudioCategory('ambience')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                audioCategory === 'ambience'
                  ? `bg-gradient-to-r ${activeTheme.accentGradient} text-white shadow`
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Ambience
            </button>
          </div>
        </div>

        {audioCategory === 'music' ? (
          /* Music Lounge (Cigarettes After Sex & Billie Eilish) */
          <div className="space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {CURATED_CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedMusicId(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    selectedMusicId === ch.id
                      ? `bg-gradient-to-r ${activeTheme.accentGradient} text-white shadow`
                      : 'bg-black/40 text-white/60 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{ch.emoji}</span>
                  <span>{ch.artist}</span>
                </button>
              ))}
            </div>

            {/* Spotify Embed Player */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-inner">
              <iframe
                title={`Spotify Focus Player - ${activeMusic.artist}`}
                src={activeMusic.embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full bg-black"
              />
            </div>
          </div>
        ) : (
          /* Procedural Ambience Generator */
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-1.5 text-xs">
              {[
                { id: 'off' as SoundscapeType, label: 'Off', icon: '🔇' },
                { id: 'rain' as SoundscapeType, label: 'Rain', icon: '🌧️' },
                { id: 'waves' as SoundscapeType, label: 'Waves', icon: '🌊' },
                { id: 'fire' as SoundscapeType, label: 'Fire', icon: '🪵' },
                { id: 'brown_noise' as SoundscapeType, label: 'Zen', icon: '🌫️' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSoundscapeChange(s.id)}
                  className={`py-2 px-1 rounded-xl text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                    activeSoundscape === s.id
                      ? `bg-gradient-to-r ${activeTheme.accentGradient} text-white shadow`
                      : 'bg-black/40 text-white/60 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="text-[9px] truncate w-full">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Volume slider */}
            {activeSoundscape !== 'off' && (
              <div className="flex items-center gap-2 pt-1">
                <VolumeX className="w-3.5 h-3.5 opacity-50" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 accent-rose-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
                <Volume2 className="w-3.5 h-3.5 opacity-80" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Quick Habit Pulse Snapshot Widget */}
      <div
        className={`p-5 rounded-3xl ${activeTheme.cardClass} border ${activeTheme.borderClass} max-w-xl mx-auto flex items-center justify-between gap-4`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm tracking-tight">Daily Habit Tracker</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTheme.badgeClass}`}>
              {completedTodayCount} / {habits.length} Done Today
            </span>
          </div>
          <p className="text-xs opacity-60">
            Check off routines, view streaks &amp; heatmaps on your dedicated habits board
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateToHabits}
          className={`px-4 py-2.5 rounded-2xl bg-gradient-to-tr ${activeTheme.accentGradient} text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all`}
        >
          <span>Open Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
};
