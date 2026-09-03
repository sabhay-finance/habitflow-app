import React, { useState, useEffect } from 'react';
import type { Habit, HabitFormData, FrequencyType, HabitCategory } from '../../types';
import { COLOR_PALETTES, CATEGORY_METADATA } from '../../constants/config';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Clock, Check } from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HabitFormData) => void;
  initialHabit?: Habit | null;
}

const COMMON_EMOJIS = [
  '⚡', '💧', '🏃', '📚', '🧘', '🍎', '🏋️', '🎯',
  '🎨', '💡', '🌱', '☀️', '🌙', '💻', '✍️', '🥑',
  '🚲', '🚶', '🎧', '🎸', '💰', '🧠', '🏊', '🔥',
];

const DAYS_OF_WEEK = [
  { day: 1, label: 'M' },
  { day: 2, label: 'T' },
  { day: 3, label: 'W' },
  { day: 4, label: 'T' },
  { day: 5, label: 'F' },
  { day: 6, label: 'S' },
  { day: 0, label: 'S' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHabit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('⚡');
  const [color, setColor] = useState('violet');
  const [category, setCategory] = useState<HabitCategory>('custom');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]); // Default Mon-Fri
  const [timesPerWeek, setTimesPerWeek] = useState<number>(3);
  const [reminderTime, setReminderTime] = useState<string>('08:00');

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description || '');
      setEmoji(initialHabit.emoji);
      setColor(initialHabit.color);
      setCategory(initialHabit.category);
      setFrequencyType(initialHabit.frequency.type);
      setDaysOfWeek(initialHabit.frequency.daysOfWeek || [1, 2, 3, 4, 5]);
      setTimesPerWeek(initialHabit.frequency.timesPerWeek || 3);
      setReminderTime(initialHabit.reminderTime || '08:00');
    } else {
      // Reset form
      setName('');
      setDescription('');
      setEmoji('⚡');
      setColor('violet');
      setCategory('custom');
      setFrequencyType('daily');
      setDaysOfWeek([1, 2, 3, 4, 5]);
      setTimesPerWeek(3);
      setReminderTime('08:00');
    }
  }, [initialHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name,
      description,
      emoji,
      color,
      category,
      frequency: {
        type: frequencyType,
        daysOfWeek: frequencyType === 'specific_days' ? daysOfWeek : undefined,
        timesPerWeek: frequencyType === 'times_per_week' ? timesPerWeek : undefined,
      },
      reminderTime,
    });
    onClose();
  };

  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      if (daysOfWeek.length > 1) {
        setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
      }
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialHabit ? 'Edit Habit' : 'Create New Habit'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name and Emoji */}
        <div className="flex gap-3">
          {/* Emoji display / picker */}
          <div className="flex flex-col items-center">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Icon
            </label>
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner border border-slate-200 dark:border-slate-700">
              {emoji}
            </div>
          </div>

          {/* Name input */}
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Habit Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read 20 pages, Morning Run"
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-sm transition-all"
            />
          </div>
        </div>

        {/* Emoji Selector grid */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Choose Emoji
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 max-h-28 overflow-y-auto">
            {COMMON_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform ${
                  emoji === e
                    ? 'bg-brand-500 text-white scale-110 shadow-sm'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Description / Motivation */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Why is this important? (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Clears my mind and sets a productive tone"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs transition-all"
          />
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Color Accent
          </label>
          <div className="flex items-center gap-3">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.id}
                type="button"
                onClick={() => setColor(palette.id)}
                style={{ backgroundColor: palette.hex }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${
                  color === palette.id ? 'ring-4 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-105'
                }`}
                title={palette.name}
              >
                {color === palette.id && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(CATEGORY_METADATA) as HabitCategory[]).map((cat) => {
              const meta = CATEGORY_METADATA[cat];
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all truncate ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span>{meta.defaultEmoji}</span>
                  <span className="truncate">{meta.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(
              [
                { type: 'daily', label: 'Every Day' },
                { type: 'specific_days', label: 'Specific Days' },
                { type: 'times_per_week', label: 'X Times / Week' },
              ] as const
            ).map((freq) => (
              <button
                key={freq.type}
                type="button"
                onClick={() => setFrequencyType(freq.type)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                  frequencyType === freq.type
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>

          {/* Conditional Days of Week Selector */}
          {frequencyType === 'specific_days' && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Choose Scheduled Days:
              </p>
              <div className="flex justify-between gap-1">
                {DAYS_OF_WEEK.map(({ day, label }, idx) => {
                  const isSelected = daysOfWeek.includes(day);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conditional Times per week slider */}
          {frequencyType === 'times_per_week' && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Days / Week:
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTimesPerWeek(num)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                      timesPerWeek === num
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reminder Time */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            Preferred Daily Reminder Time
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialHabit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
