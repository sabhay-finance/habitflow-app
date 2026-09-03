import React, { useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Vibrate,
  Bell,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import type { UserSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { NotificationService } from '../../services/notifications';
import { Button } from '../common/Button';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importAllData(content);
        if (success) {
          window.location.reload();
        } else {
          alert('Failed to import backup file. Please make sure the JSON format is valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleNotificationToggle = async () => {
    if (!settings.notificationsEnabled) {
      const granted = await NotificationService.requestPermission();
      if (granted) {
        onUpdateSettings({ notificationsEnabled: true });
        await NotificationService.scheduleDailyReminder(settings.dailyReminderTime);
      } else {
        alert('Notification permission was not granted by your device/browser.');
      }
    } else {
      onUpdateSettings({ notificationsEnabled: false });
      await NotificationService.cancelAll();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Preferences & Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Customize sound, haptics, theme, and data backups.
        </p>
      </div>

      {/* Experience & Feedback */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Sensory Feedback
        </h3>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Satisfying Sound Effects</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Play synthesized bubble pops, chimes, and fanfare
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
              settings.soundEnabled ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Haptics Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Vibrate className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Haptic Vibration</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tactile micro-vibrations on mobile taps and completions
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
              settings.hapticsEnabled ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                settings.hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Daily Reminders</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Local push notification to protect your streak
              </p>
            </div>
          </div>
          <button
            onClick={handleNotificationToggle}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
              settings.notificationsEnabled ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Theme Appearance */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Appearance Theme
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = settings.theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onUpdateSettings({ theme: item.id as any })}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Management */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Data & Local Storage
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your habits, completion history, streaks, and badges are stored safely in your device's
          localStorage with a clean JSON structure ready for database syncing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
            className="w-full"
          >
            Export JSON Backup
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-4 h-4" />}
            className="w-full"
          >
            Restore JSON Backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (confirm('Reset your habit tracker with rich sample data? This is great for exploring heatmaps and streaks!')) {
                onResetDemoData();
              }
            }}
            icon={<RefreshCw className="w-4 h-4" />}
            className="w-full sm:w-auto text-xs"
          >
            Load Rich Demo Data
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to erase all habits and history? This cannot be undone.')) {
                onClearAllData();
              }
            }}
            icon={<Trash2 className="w-4 h-4 text-rose-500" />}
            className="w-full sm:w-auto text-rose-600 dark:text-rose-400 text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
};
