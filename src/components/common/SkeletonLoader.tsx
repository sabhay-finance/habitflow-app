import React from 'react';

export const HabitCardSkeleton: React.FC = () => {
  return (
    <div className="w-full p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm animate-pulse flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4" />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-16 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="p-6 rounded-3xl bg-slate-200 dark:bg-slate-800 h-44 w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <HabitCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
