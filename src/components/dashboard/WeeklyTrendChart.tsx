import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { Habit, CompletionLog } from '../../types';
import { getPastDates, parseDateString, isHabitScheduledForDate } from '../../utils/date';

interface WeeklyTrendChartProps {
  habits: Habit[];
  logs: CompletionLog[];
  days?: number; // default 7 days
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({
  habits,
  logs,
  days = 7,
}) => {
  const pastDates = getPastDates(days);

  // Group logs by date
  const logsByDate = new Map<string, Set<string>>();
  for (const log of logs) {
    if (!logsByDate.has(log.date)) {
      logsByDate.set(log.date, new Set());
    }
    logsByDate.get(log.date)!.add(log.habitId);
  }

  // Generate chart datapoints
  const data = pastDates.map((dateStr) => {
    const d = parseDateString(dateStr);
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });

    let scheduledCount = 0;
    let completedCount = 0;
    const completedSet = logsByDate.get(dateStr) || new Set();

    for (const h of habits) {
      if (isHabitScheduledForDate(h.frequency, dateStr)) {
        scheduledCount++;
        if (completedSet.has(h.id)) {
          completedCount++;
        }
      }
    }

    const rate = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;

    return {
      date: dateStr,
      label: dayLabel,
      completed: completedCount,
      scheduled: scheduledCount,
      rate,
    };
  });

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="p-2.5 rounded-xl bg-slate-900/95 dark:bg-slate-800 text-white text-xs shadow-xl border border-slate-700 backdrop-blur-sm">
                    <p className="font-bold text-slate-200">{item.label} ({item.date})</p>
                    <p className="text-brand-400 font-semibold mt-1">
                      {item.completed} / {item.scheduled} habits ({item.rate}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#8b5cf6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#trendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
