import React, { useState } from 'react';
import { 
  Sparkles, Play, Flame, Clock, Smartphone, ChevronRight, CheckCircle2,
  Users, User, Film, ChevronDown, ChevronUp, Zap, TrendingUp, HeartHandshake, Eye
} from 'lucide-react';
import { ClipMoment, Campaign } from '../types';

interface ClipGalleryProps {
  clips: ClipMoment[];
  selectedClipId: string;
  onSelectClip: (clip: ClipMoment) => void;
  campaign?: Campaign;
}

export const ClipGallery: React.FC<ClipGalleryProps> = ({
  clips,
  selectedClipId,
  onSelectClip,
  campaign,
}) => {
  const [expandedReasonId, setExpandedReasonId] = useState<string | null>(null);

  const toggleExpandReason = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReasonId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Virality Scored Clips ({clips.length})
          </h3>
          <p className="text-xs text-zinc-400">
            Ranked by Opus-style Virality Score, retention curve, and Content Rewards CPM potential.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-400 font-mono font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            9:16 Vertical • 1080p
          </span>
          <span className="text-[11px] text-indigo-400 font-mono font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1">
            <Film className="w-3 h-3" /> Auto B-Roll Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {clips.map((clip) => {
          const isSelected = clip.id === selectedClipId;
          const isExpanded = expandedReasonId === clip.id;
          const duration = (clip.endTime - clip.startTime).toFixed(1);

          // Default Opus scoring if not set
          const hook = clip.hookScore || Math.min(clip.viralityScore + 2, 99);
          const flow = clip.flowScore || Math.max(clip.viralityScore - 2, 85);
          const engagement = clip.engagementScore || Math.min(clip.viralityScore - 1, 95);
          const trend = clip.trendScore || Math.max(clip.viralityScore - 3, 86);

          return (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip)}
              className={`group relative rounded-2xl p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/95'
              }`}
            >
              <div>
                {/* Top Row: Opus Clip Virality Score Badge & Badges */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl font-mono font-black text-xs ${
                      clip.viralityScore >= 90
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/20'
                        : 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                    }`}>
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{clip.viralityScore}</span>
                      <span className="text-[10px] opacity-80">/100</span>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                      {clip.hookType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {clip.layout === 'two_speaker_split' && (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1" title="2-Speaker Split Screen">
                        <Users className="w-3 h-3" /> Split
                      </span>
                    )}
                    {clip.layout === 'auto_reframe' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1" title="AI Face Track">
                        <User className="w-3 h-3" /> Reframe
                      </span>
                    )}
                    <div className="flex items-center space-x-1 text-[11px] text-zinc-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{duration}s</span>
                    </div>
                  </div>
                </div>

                {/* Virality Score Breakdown (Opus Clip Feature) */}
                <div className="grid grid-cols-4 gap-1.5 mb-3 bg-zinc-950/80 rounded-xl p-2 border border-zinc-800/80 text-center">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-zinc-400">Hook</div>
                    <div className="text-xs font-mono font-black text-amber-400">{hook}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-zinc-400">Flow</div>
                    <div className="text-xs font-mono font-black text-emerald-400">{flow}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-zinc-400">Engage</div>
                    <div className="text-xs font-mono font-black text-indigo-400">{engagement}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-zinc-400">Trend</div>
                    <div className="text-xs font-mono font-black text-rose-400">{trend}%</div>
                  </div>
                </div>

                {/* Title & Hook Headline */}
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5">
                  {clip.title}
                </h4>

                <div className="bg-zinc-950 rounded-xl px-3 py-2 border border-zinc-800 mb-3">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 mb-0.5">
                    <Zap className="w-3 h-3" /> Hook Headline Banner:
                  </div>
                  <div className="text-xs font-black text-white font-mono truncate">
                    {clip.hookText}
                  </div>
                </div>

                {/* Speech Words Preview */}
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                  "{clip.words.slice(0, 15).map(w => w.word).join(' ')}..."
                </p>

                {/* B-Roll & Filler Word Metadata Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {clip.bRollEnabled && (
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <Film className="w-3 h-3" /> B-Roll: {clip.bRollKeyword || 'Dynamic'}
                    </span>
                  )}
                  {clip.fillerWordsRemoved && (
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      ✂️ {clip.fillerWordsRemoved} fillers cut
                    </span>
                  )}
                </div>

                {/* Expandable Why It Will Go Viral Dropdown */}
                <div className="mb-3">
                  <button
                    onClick={(e) => toggleExpandReason(clip.id, e)}
                    className="w-full flex items-center justify-between text-[11px] font-bold text-zinc-400 hover:text-amber-400 transition py-1"
                  >
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-amber-400" />
                      Why it will go viral
                    </span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5 text-[11px] text-zinc-300 leading-relaxed">
                      <p className="text-zinc-200 font-medium">{clip.viralityReason}</p>
                      {clip.viralityHighlights && clip.viralityHighlights.length > 0 && (
                        <div className="pt-1 space-y-1 border-t border-zinc-900">
                          {clip.viralityHighlights.map((highlight, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-1.5 text-zinc-400 text-[10.5px]">
                              <span>•</span>
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800 text-xs">
                <div className="flex items-center space-x-1.5 text-zinc-400">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">TikTok • Reels • Shorts</span>
                </div>

                <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  <span>{isSelected ? 'Editing in Canvas' : 'Customize Clip'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

