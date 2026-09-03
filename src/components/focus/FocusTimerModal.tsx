import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  X,
  Clock,
  Music,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Habit } from '../../types';
import { AmbientSoundEngine, type SoundscapeType } from '../../services/ambientAudio';
import { SoundEngine } from '../../services/sound';
import { HapticsService } from '../../services/haptics';
import { ANIMATION_CONFIG } from '../../constants/config';
import { Button } from '../common/Button';
import { CURATED_CHANNELS } from '../music/FlocusMusicPlayer';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onCompleteHabit?: (habitId: string) => void;
  onAwardXp?: (xp: number) => void;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  habits,
  onCompleteHabit,
  onAwardXp,
  soundEnabled,
  hapticsEnabled,
}) => {
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>('off');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.35);
  const [audioMode, setAudioMode] = useState<'music' | 'ambience'>('music');
  const [musicChannelId, setMusicChannelId] = useState<string>('cas');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Set initial habit if changed
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
            handleTimerComplete();
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

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsFinished(true);

    SoundEngine.playFanfare(soundEnabled);
    HapticsService.celebration(hapticsEnabled);

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#8b5cf6', '#10b981', '#f59e0b', '#38bdf8'],
      });
    } catch {}

    // Award bonus focus XP
    if (onAwardXp) {
      onAwardXp(50);
    }
  };

  const handleSelectPreset = (minutes: number) => {
    setSelectedDurationMinutes(minutes);
    setTimeLeftSeconds(minutes * 60);
    setIsRunning(false);
    setIsFinished(false);
  };

  const toggleTimer = () => {
    if (isFinished) {
      handleSelectPreset(selectedDurationMinutes);
      return;
    }
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    HapticsService.light(hapticsEnabled);

    // If starting and soundscape is selected, start audio
    if (nextRunning && activeSoundscape !== 'off') {
      AmbientSoundEngine.play(activeSoundscape);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeftSeconds(selectedDurationMinutes * 60);
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

  const handleFinishAndCheckOff = () => {
    if (selectedHabitId && onCompleteHabit) {
      onCompleteHabit(selectedHabitId);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsRunning(false);
    AmbientSoundEngine.stop();
    setActiveSoundscape('off');
    onClose();
  };

  // Time calculations
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = selectedDurationMinutes * 60;
  const progressPercent = totalSeconds > 0 ? (timeLeftSeconds / totalSeconds) * 100 : 0;

  const circleRadius = 88;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop with Flocus glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={ANIMATION_CONFIG.spring.bounce}
            className="relative w-full max-w-md bg-slate-900/95 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 z-10 overflow-hidden flex flex-col items-center"
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-violet-500/20 text-violet-400">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
                  Focus Sanctuary
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Toggle Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-6 text-xs">
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
                    selectedDurationMinutes === preset.minutes
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Habit Association Selector */}
            {habits.length > 0 && (
              <div className="w-full mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-center">
                  Linking Focus Session To:
                </label>
                <select
                  value={selectedHabitId}
                  onChange={(e) => setSelectedHabitId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.emoji} {h.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Circular Countdown Display */}
            <div className="relative w-56 h-56 flex items-center justify-center mb-6 select-none">
              <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={circleRadius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={circleRadius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.5, ease: 'linear' }}
                  strokeLinecap="round"
                  className="text-brand-500"
                  fill="transparent"
                />
              </svg>

              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black font-mono tracking-tight tabular-nums">
                  {formattedTime}
                </span>
                <span className="text-xs text-slate-400 font-semibold mt-1">
                  {isFinished ? 'Session Finished! 🎉' : isRunning ? 'In Deep Flow...' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleTimer}
                className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/30 transition-all"
                title={isRunning ? 'Pause' : 'Start'}
              >
                {isRunning ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white ml-0.5" />
                )}
              </motion.button>
            </div>

            {/* Audio Companion (Flocus Ambience & Music Lounge) */}
            <div className="w-full p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              {/* Audio Mode Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-700/60 text-xs">
                  <button
                    onClick={() => setAudioMode('music')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      audioMode === 'music'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Music className="w-3 h-3" />
                    <span>Music Lounge</span>
                  </button>
                  <button
                    onClick={() => setAudioMode('ambience')}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      audioMode === 'ambience'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Ambience</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {audioMode === 'music'
                    ? CURATED_CHANNELS.find((c) => c.id === musicChannelId)?.artist
                    : activeSoundscape === 'off'
                    ? 'Muted'
                    : activeSoundscape}
                </span>
              </div>

              {audioMode === 'music' ? (
                /* Music Lounge Selector */
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {CURATED_CHANNELS.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setMusicChannelId(channel.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                          musicChannelId === channel.id
                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{channel.emoji}</span>
                        <span>{channel.artist}</span>
                      </button>
                    ))}
                  </div>

                  {/* Embedded Spotify Mini Player */}
                  <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-inner">
                    <iframe
                      title={`Spotify Focus - ${musicChannelId}`}
                      src={CURATED_CHANNELS.find((c) => c.id === musicChannelId)?.embedUrl}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="w-full bg-slate-950"
                    />
                  </div>
                </div>
              ) : (
                /* Ambient Soundscapes Selector */
                <div className="space-y-2.5">
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
                        className={`py-1.5 px-1 rounded-xl text-center font-bold flex flex-col items-center gap-0.5 transition-all ${
                          activeSoundscape === s.id
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{s.icon}</span>
                        <span className="text-[9px] truncate w-full">{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Volume Slider */}
                  {activeSoundscape !== 'off' && (
                    <div className="flex items-center gap-2 pt-1">
                      <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={ambientVolume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 accent-brand-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                      />
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Session Finished Action Callout */}
            {isFinished && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-4 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-center space-y-2"
              >
                <div className="text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>+50 Focus XP Earned!</span>
                </div>
                {selectedHabit && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleFinishAndCheckOff}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Mark "{selectedHabit.name}" Done!
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
