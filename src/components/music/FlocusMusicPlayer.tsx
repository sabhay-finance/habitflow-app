import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Disc3, Radio } from 'lucide-react';
import { ANIMATION_CONFIG } from '../../constants/config';

export interface MusicChannel {
  id: string;
  artist: string;
  title: string;
  tagline: string;
  emoji: string;
  color: string;
  embedUrl: string;
  topTracks: string[];
}

export const CURATED_CHANNELS: MusicChannel[] = [
  {
    id: 'cas',
    artist: 'Cigarettes After Sex',
    title: 'This Is Cigarettes After Sex',
    tagline: 'Dream pop, slowcore & hypnotic nighttime calm',
    emoji: '🚬',
    color: 'from-zinc-800 to-slate-950',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXaImRpG7HXqp?utm_source=generator&theme=0',
    topTracks: ['Apocalypse', 'K.', 'Sunsetz', 'Sweet', 'Cry', 'Heavenly'],
  },
  {
    id: 'billie',
    artist: 'Billie Eilish',
    title: 'This Is Billie Eilish',
    tagline: 'Intimate vocals, melancholic beats & acoustic warmth',
    emoji: '🥑',
    color: 'from-emerald-950 to-slate-950',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX6XceWZJ1znY?utm_source=generator&theme=0',
    topTracks: ['BIRDS OF A FEATHER', 'Ocean Eyes', 'Lovely', 'Wildflower', 'Happier Than Ever'],
  },
  {
    id: 'lofi',
    artist: 'Lofi Girl',
    title: 'Lofi Sleep & Study Beats',
    tagline: 'Chill instrumental beats for deep flow & relaxation',
    emoji: '🎧',
    color: 'from-indigo-950 to-slate-950',
    embedUrl: 'https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0',
    topTracks: ['Midnight Warmth', 'Coffee Cup', 'Rainy Window', 'Late Night Reading'],
  },
];

interface FlocusMusicPlayerProps {
  initialChannelId?: string;
  className?: string;
}

export const FlocusMusicPlayer: React.FC<FlocusMusicPlayerProps> = ({
  initialChannelId = 'cas',
  className = '',
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>(initialChannelId);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const currentChannel =
    CURATED_CHANNELS.find((c) => c.id === selectedChannelId) || CURATED_CHANNELS[0];

  return (
    <div
      className={`relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                Focus Lounge
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-[10px] font-black uppercase tracking-wider">
                Flocus Audio
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated playlists for deep flow &amp; relaxation
            </p>
          </div>
        </div>

        {/* Toggle Minimize/Expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isExpanded ? 'Collapse Player' : 'Expand Player'}
          aria-label="Toggle Player"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Channel Switcher Pills */}
      <div className="p-3 sm:px-5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
        {CURATED_CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => {
              setSelectedChannelId(channel.id);
              setIsExpanded(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedChannelId === channel.id
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
            }`}
          >
            <span>{channel.emoji}</span>
            <span>{channel.artist}</span>
          </button>
        ))}
      </div>

      {/* Player Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={ANIMATION_CONFIG.spring.gentle}
            className="p-4 sm:p-5 space-y-4 overflow-hidden"
          >
            {/* Active Channel Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Disc3 className="w-3.5 h-3.5 text-brand-500 animate-spin" style={{ animationDuration: '8s' }} />
                  {currentChannel.title}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {currentChannel.tagline}
                </span>
              </div>

              {/* Popular tracks preview */}
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium overflow-x-auto no-scrollbar py-0.5">
                <span className="font-bold text-slate-500 shrink-0">Featured:</span>
                {currentChannel.topTracks.slice(0, 3).map((track) => (
                  <span
                    key={track}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0"
                  >
                    {track}
                  </span>
                ))}
              </div>
            </div>

            {/* Official Spotify Embed Player */}
            <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200/80 dark:border-slate-800">
              <iframe
                title={`Spotify player - ${currentChannel.artist}`}
                src={currentChannel.embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full bg-slate-900"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
