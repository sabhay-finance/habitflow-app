import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import { useAestheticTheme } from './hooks/useAestheticTheme';
import type { ActiveTab, Habit } from './types';
import { ANIMATION_CONFIG } from './constants/config';
import { Header } from './components/navigation/Header';
import { MobileTabBar } from './components/navigation/MobileTabBar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { HabitsPageView } from './components/habits/HabitsPageView';
import { CalendarHistoryView } from './components/calendar/CalendarHistoryView';
import { AnalyticsView } from './components/heatmap/AnalyticsView';
import { BadgesView } from './components/gamification/BadgesView';
import { SettingsView } from './components/settings/SettingsView';
import { HabitModal } from './components/habits/HabitModal';
import { StreakFreezeModal } from './components/habits/StreakFreezeModal';
import { LevelUpModal } from './components/gamification/LevelUpModal';
import { BadgeUnlockedModal } from './components/gamification/BadgeUnlockedModal';
import { DashboardSkeleton } from './components/common/SkeletonLoader';
import { FocusTimerModal } from './components/focus/FocusTimerModal';
import { ThemeSelectorModal } from './components/flocus/ThemeSelectorModal';
import { FeedbackToast } from './components/common/FeedbackToast';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [freezingHabit, setFreezingHabit] = useState<Habit | null>(null);

  const {
    habits,
    logs,
    freezes,
    streakMap,
    overallMaxStreak,
    isLoading,
    feedbackToast,
    dismissFeedbackToast,
    gamification,
    levelInfo,
    levelUpData,
    dismissLevelUp,
    newlyUnlockedBadge,
    dismissBadgeModal,
    awardXp,
    toggleCompletion,
    applyFreeze,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    settings,
    updateSettings,
    resetToDemoData,
    clearAllData,
  } = useHabits();

  const { isDark, toggleTheme } = useTheme(settings, updateSettings);
  const { themeId, activeTheme, setTheme } = useAestheticTheme(settings, updateSettings);

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = (formData: any) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, formData);
    } else {
      addHabit(formData);
    }
  };

  const handleSelectStarterTemplate = (template: any) => {
    addHabit({
      name: template.name,
      description: template.description,
      emoji: template.emoji,
      color: template.color,
      category: template.category,
      frequency: template.frequency,
      reminderTime: template.reminderTime,
    });
  };

  return (
    <div className={`min-h-screen ${activeTheme.backgroundClass} transition-colors duration-500 flex flex-col`}>
      {/* Top Header */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenBadges={() => setActiveTab('badges')}
        onOpenFocus={() => setIsFocusModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        activeTheme={activeTheme}
        overallMaxStreak={overallMaxStreak}
        level={levelInfo.level}
        xp={gamification.xp}
      />

      {/* Main Content Area with Smooth Page Transitions */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 sm:pt-6">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: ANIMATION_CONFIG.tabTransitionDuration, ease: 'easeInOut' }}
            >
              {activeTab === 'today' && (
                <DashboardOverview
                  habits={habits}
                  logs={logs}
                  freezes={freezes}
                  streakMap={streakMap}
                  overallMaxStreak={overallMaxStreak}
                  levelInfo={levelInfo}
                  totalXp={gamification.xp}
                  onOpenFocusModal={() => setIsFocusModalOpen(true)}
                  onToggle={toggleCompletion}
                  onEdit={handleOpenEditModal}
                  onDelete={deleteHabit}
                  onOpenFreezeModal={(h) => setFreezingHabit(h)}
                  onReorder={reorderHabits}
                  onAddNewHabit={handleOpenAddModal}
                  onSelectTemplate={handleSelectStarterTemplate}
                />
              )}

              {activeTab === 'habits' && (
                <HabitsPageView
                  habits={habits}
                  streakMap={streakMap}
                  levelInfo={levelInfo}
                  totalXp={gamification.xp}
                  onToggle={toggleCompletion}
                  onEdit={handleOpenEditModal}
                  onDelete={deleteHabit}
                  onOpenFreezeModal={(h) => setFreezingHabit(h)}
                  onReorder={reorderHabits}
                  onAddNewHabit={handleOpenAddModal}
                  onSelectTemplate={handleSelectStarterTemplate}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarHistoryView
                  habits={habits}
                  logs={logs}
                  freezes={freezes}
                  onToggleHabit={toggleCompletion}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  habits={habits}
                  logs={logs}
                  freezes={freezes}
                  streakMap={streakMap}
                  overallMaxStreak={overallMaxStreak}
                />
              )}

              {activeTab === 'badges' && (
                <BadgesView gamification={gamification} levelInfo={levelInfo} />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  onResetDemoData={resetToDemoData}
                  onClearAllData={clearAllData}
                  activeAestheticThemeId={themeId}
                  onSelectAestheticTheme={setTheme}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Bottom Mobile Tab Bar & Floating Action Button */}
      <MobileTabBar
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onAddNewHabit={handleOpenAddModal}
      />

      {/* Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSave={handleSaveHabit}
        initialHabit={editingHabit}
      />

      {/* Streak Freeze Modal */}
      <StreakFreezeModal
        isOpen={!!freezingHabit}
        onClose={() => setFreezingHabit(null)}
        habit={freezingHabit}
        freezesAvailable={gamification.streakFreezesAvailable}
        onApplyFreeze={(habitId, date) => applyFreeze(habitId, date)}
      />

      {/* Flocus-Inspired Focus Sanctuary Modal */}
      <FocusTimerModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        habits={habits}
        onCompleteHabit={(habitId) => toggleCompletion(habitId)}
        onAwardXp={(xp) => awardXp(xp)}
        soundEnabled={settings.soundEnabled}
        hapticsEnabled={settings.hapticsEnabled}
      />

      {/* Aesthetic & Gothic Themes Gallery Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={themeId}
        onSelectTheme={setTheme}
      />

      {/* Subtle Addictive Habit Completion Feedback Toast */}
      <FeedbackToast toast={feedbackToast} onDismiss={dismissFeedbackToast} />

      {/* Gamification Celebrations */}
      <LevelUpModal data={levelUpData} onClose={dismissLevelUp} />
      <BadgeUnlockedModal badge={newlyUnlockedBadge} onClose={dismissBadgeModal} />
    </div>
  );
};

export default App;
