import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react';
import type { ActiveTab } from '../../types';
import { ANIMATION_CONFIG } from '../../constants/config';

interface MobileTabBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onAddNewHabit: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onChangeTab,
  onAddNewHabit,
}) => {
  const tabs = [
    { id: 'today' as ActiveTab, label: 'Today', icon: LayoutDashboard },
    { id: 'habits' as ActiveTab, label: 'Habits', icon: ListTodo },
    { id: 'calendar' as ActiveTab, label: 'Calendar', icon: Calendar },
    { id: 'analytics' as ActiveTab, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Floating Action Button (Mobile & Desktop) */}
      <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92, rotate: 90 }}
          transition={ANIMATION_CONFIG.spring.bounce}
          onClick={onAddNewHabit}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-brand-400/40 cursor-pointer"
          aria-label="Add new habit"
        >
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
        </motion.button>
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 pb-safe transition-colors">
        <div className="max-w-md mx-auto px-3 h-16 flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className="relative flex flex-col items-center justify-center w-14 h-12 rounded-xl text-slate-500 dark:text-slate-400 focus:outline-none transition-colors select-none cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={ANIMATION_CONFIG.spring.snappy}
                    className="absolute inset-0 bg-brand-50 dark:bg-brand-950/60 rounded-xl"
                  />
                )}
                <div
                  className={`relative z-10 flex flex-col items-center gap-0.5 transition-colors ${
                    isActive ? 'text-brand-600 dark:text-brand-400' : 'hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
