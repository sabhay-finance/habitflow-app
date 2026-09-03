import React, { useState } from 'react';
import { BADGES_CATALOG } from '../../constants/config';
import type { GamificationState, Badge } from '../../types';
import { LevelProgressCard } from './LevelProgressCard';
import { BadgeCard } from './BadgeCard';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface BadgesViewProps {
  gamification: GamificationState;
  levelInfo: any;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  gamification,
  levelInfo,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedMap = new Map(
    gamification.unlockedBadges.map((b) => [b.badgeId, b])
  );

  const unlockedCount = gamification.unlockedBadges.length;
  const totalCount = BADGES_CATALOG.length;

  return (
    <div className="space-y-6 pb-24">
      {/* Level Summary */}
      <LevelProgressCard levelInfo={levelInfo} totalXp={gamification.xp} />

      {/* Streak Freeze Inventory */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-teal-500/10 border border-cyan-300/40 dark:border-cyan-800/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-2xl shrink-0">
            🧊
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Weekly Streak Freeze</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-[10px] font-bold">
                {gamification.streakFreezesAvailable}/1
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Protects any broken streak once a week. Replenishes every Monday.
            </p>
          </div>
        </div>
      </div>

      {/* Badges Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Milestone Badges
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {unlockedCount} of {totalCount} badges unlocked
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
          {Math.round((unlockedCount / totalCount) * 100)}% Complete
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BADGES_CATALOG.map((badge) => {
          const unlockedInfo = unlockedMap.get(badge.id);
          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              unlockedInfo={unlockedInfo}
              onClick={() => setSelectedBadge(badge)}
            />
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      <Modal
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
        title="Badge Details"
        maxWidth="sm"
      >
        {selectedBadge && (
          <div className="text-center space-y-4">
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-lg ${
                unlockedMap.has(selectedBadge.id)
                  ? `bg-gradient-to-tr ${selectedBadge.gradient} text-white`
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {selectedBadge.icon}
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {selectedBadge.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {unlockedMap.has(selectedBadge.id) ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Unlocked and Earned!
                  </span>
                ) : (
                  <span>Goal: Reach milestone requirement</span>
                )}
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedBadge(null)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
