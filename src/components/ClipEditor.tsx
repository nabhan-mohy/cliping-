import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Copy, Check, Sliders, Scissors, 
  Send, ExternalLink, ShieldCheck, Flame, Type, MoveHorizontal, Download,
  Film, Users, User, Monitor, FileText, Share2, Plus, Trash2, CheckCircle2, Clock
} from 'lucide-react';
import { ClipMoment, CaptionStyleConfig, Campaign, BRollCutaway } from '../types';
import { VerticalVideoPlayer } from './VerticalVideoPlayer';

interface ClipEditorProps {
  clip: ClipMoment;
  onUpdateClip: (updated: ClipMoment) => void;
  campaign?: Campaign;
  captionStyle: CaptionStyleConfig;
  onUpdateCaptionStyle: (style: CaptionStyleConfig) => void;
  onSubmitToCampaign: (clip: ClipMoment) => void;
}

export const ClipEditor: React.FC<ClipEditorProps> = ({
  clip,
  onUpdateClip,
  campaign,
  captionStyle,
  onUpdateCaptionStyle,
  onSubmitToCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'captions' | 'broll' | 'layout' | 'export'>('captions');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [copiedMetadata, setCopiedMetadata] = useState<boolean>(false);
  const [copiedSocialKit, setCopiedSocialKit] = useState<boolean>(false);
  const [showHookBanner, setShowHookBanner] = useState<boolean>(true);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(true);
  const [showDisclosure, setShowDisclosure] = useState<boolean>(true);
  const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);

  // B-Roll stock library state
  const [bRollLibrary, setBRollLibrary] = useState<any[]>([]);
  const [isExportingSubtitles, setIsExportingSubtitles] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/b-roll/library')
      .then(res => res.json())
      .then(data => {
        if (data.library) setBRollLibrary(data.library);
      })
      .catch(() => {});
  }, []);

  const handleCopyMetadata = () => {
    const disclosure = campaign?.requiredDisclosure || '#ad';
    const text = `${clip.title}\n\n${clip.caption}\n\n${clip.hashtags.join(' ')} ${disclosure}`;
    navigator.clipboard.writeText(text);
    setCopiedMetadata(true);
    setTimeout(() => setCopiedMetadata(false), 2000);
  };

  const handleExportSRT = async () => {
    try {
      setIsExportingSubtitles(true);
      const res = await fetch('/api/export-srt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: clip.words, clipTitle: clip.title })
      });
      const data = await res.json();
      if (data.srtContent) {
        const blob = new Blob([data.srtContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename || 'subtitles.srt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Failed to export SRT', e);
    } finally {
      setIsExportingSubtitles(false);
    }
  };

  const handleExportVTT = async () => {
    try {
      setIsExportingSubtitles(true);
      const res = await fetch('/api/export-vtt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: clip.words, clipTitle: clip.title })
      });
      const data = await res.json();
      if (data.vttContent) {
        const blob = new Blob([data.vttContent], { type: 'text/vtt;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename || 'subtitles.vtt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Failed to export VTT', e);
    } finally {
      setIsExportingSubtitles(false);
    }
  };

  const handleCopySocialKit = async () => {
    try {
      const res = await fetch('/api/export-social-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clip })
      });
      const data = await res.json();
      if (data.socialKit) {
        const kitText = `🎯 VIRAL TITLE: ${data.socialKit.title}
🚨 HOOK BANNER: ${data.socialKit.hookBanner}
📝 CAPTION: ${data.socialKit.caption}
🏷️ HASHTAGS: ${data.socialKit.hashtags.join(' ')}

📅 OPTIMAL POSTING TIMES:
• TikTok: 6:30 PM - 9:00 PM EST (Sound: Trending Atmospheric Ambient)
• Reels: 12:00 PM - 2:00 PM EST (Sound: Original Audio)
• Shorts: 3:00 PM - 5:00 PM EST (Sound: Direct Mic Voiceover)`;

        navigator.clipboard.writeText(kitText);
        setCopiedSocialKit(true);
        setTimeout(() => setCopiedSocialKit(false), 2500);
      }
    } catch (e) {
      console.error('Failed to generate social kit', e);
    }
  };

  const handleHookTextChange = (newHook: string) => {
    onUpdateClip({
      ...clip,
      hookText: newHook.toUpperCase()
    });
  };

  const handleWordEdit = (index: number, newWord: string) => {
    const updatedWords = [...clip.words];
    updatedWords[index] = {
      ...updatedWords[index],
      word: newWord
    };
    onUpdateClip({
      ...clip,
      words: updatedWords
    });
    setEditingWordIndex(null);
  };

  const handleSpeakerOffsetChange = (offset: number) => {
    onUpdateClip({
      ...clip,
      speakerOffset: offset
    });
  };

  const handleLayoutChange = (layout: 'single_speaker' | 'two_speaker_split' | 'auto_reframe' | 'screen_pip') => {
    onUpdateClip({
      ...clip,
      layout
    });
  };

  const handleTrimChange = (start: number, end: number) => {
    if (end <= start + 5) return;
    onUpdateClip({
      ...clip,
      startTime: Number(start.toFixed(1)),
      endTime: Number(end.toFixed(1)),
      duration: Number((end - start).toFixed(1))
    });
  };

  const handleAddBRollCutaway = (stockItem: any) => {
    const currentCutaways = clip.bRollCutaways || [];
    const newCutaway: BRollCutaway = {
      id: 'cutaway-' + Math.random().toString(36).substring(2, 7),
      startTime: Number((clip.startTime + 4).toFixed(1)),
      endTime: Number((clip.startTime + 9).toFixed(1)),
      label: stockItem.label,
      videoUrl: stockItem.videoUrl
    };

    onUpdateClip({
      ...clip,
      bRollEnabled: true,
      bRollKeyword: stockItem.tags[0],
      bRollCutaways: [...currentCutaways, newCutaway]
    });
  };

  const handleRemoveCutaway = (cutawayId: string) => {
    const currentCutaways = clip.bRollCutaways || [];
    onUpdateClip({
      ...clip,
      bRollCutaways: currentCutaways.filter(c => c.id !== cutawayId)
    });
  };

  // Caption Presets
  const applyPreset = (preset: 'hormozi' | 'beast' | 'ali_abdaal' | 'karaoke' | 'boxed') => {
    if (preset === 'hormozi') {
      onUpdateCaptionStyle({
        ...captionStyle,
        preset: 'bold_pop',
        fontColor: '#FFFFFF',
        highlightColor: '#FACC15', // Signature Viral Yellow
        strokeColor: '#000000',
        fontFamily: 'Impact, sans-serif',
        uppercase: true,
        wordsPerChunk: 3
      });
    } else if (preset === 'beast') {
      onUpdateCaptionStyle({
        ...captionStyle,
        preset: 'bold_pop',
        fontColor: '#FFFFFF',
        highlightColor: '#22D3EE', // Neon Beast Cyan
        strokeColor: '#000000',
        fontFamily: 'Impact, sans-serif',
        uppercase: true,
        wordsPerChunk: 2
      });
    } else if (preset === 'ali_abdaal') {
      onUpdateCaptionStyle({
        ...captionStyle,
        preset: 'minimal',
        fontColor: '#F8FAFC',
        highlightColor: '#34D399', // Mint Green Pastel
        strokeColor: '#0f172a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        uppercase: false,
        wordsPerChunk: 4
      });
    } else if (preset === 'karaoke') {
      onUpdateCaptionStyle({
        ...captionStyle,
        preset: 'karaoke',
        fontColor: '#CBD5E1',
        highlightColor: '#F59E0B',
        strokeColor: '#000000',
        fontFamily: 'Impact, sans-serif',
        uppercase: true,
        wordsPerChunk: 4
      });
    } else if (preset === 'boxed') {
      onUpdateCaptionStyle({
        ...captionStyle,
        preset: 'boxed',
        fontColor: '#FFFFFF',
        highlightColor: '#EF4444', // Red Alert Box
        strokeColor: '#000000',
        fontFamily: 'Impact, sans-serif',
        uppercase: true,
        wordsPerChunk: 3
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Responsive Video Player with Aspect Ratio & Multi-Layout */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center">
        <VerticalVideoPlayer
          clip={clip}
          captionStyle={captionStyle}
          speakerOffset={clip.speakerOffset}
          campaign={campaign}
          showHookBanner={showHookBanner}
          showProgressBar={showProgressBar}
          showDisclosure={showDisclosure}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          layout={clip.layout || 'two_speaker_split'}
          onLayoutChange={handleLayoutChange}
        />
      </div>

      {/* Right Column: Opus Clip Advanced Controls Suite */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Virality Header Pill */}
        <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-amber-400 font-mono">
                {clip.viralityScore}/100
              </span>
              <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {clip.hookType.replace('_', ' ')} Hook
              </span>
              {clip.layout && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {clip.layout === 'two_speaker_split' ? '2-Speaker Split' : clip.layout === 'auto_reframe' ? 'AI Face Track' : 'Single Cam'}
                </span>
              )}
            </div>

            {campaign && (
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>${campaign.cpmRate.toFixed(2)} CPM Target</span>
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-300 font-medium leading-relaxed">
            {clip.viralityReason}
          </p>
        </div>

        {/* Studio Navigation Tabs (Opus Clip Layout) */}
        <div className="flex items-center space-x-1 border-b border-zinc-800 pb-1">
          <button
            onClick={() => setActiveTab('captions')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'captions'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Captions & Styling</span>
          </button>

          <button
            onClick={() => setActiveTab('broll')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'broll'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>AI B-Roll Cutaways</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'layout'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Layout & Auto-Reframe</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'export'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Publish</span>
          </button>
        </div>

        {/* TAB 1: CAPTIONS & STYLING */}
        {activeTab === 'captions' && (
          <div className="space-y-4">
            {/* Signature Caption Presets */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Viral Caption Style Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'hormozi', name: 'Hormozi', desc: 'Yellow Pop', color: '#FACC15' },
                  { id: 'beast', name: 'MrBeast', desc: 'Neon Cyan', color: '#22D3EE' },
                  { id: 'ali_abdaal', name: 'Ali Abdaal', desc: 'Mint Minimal', color: '#34D399' },
                  { id: 'karaoke', name: 'Karaoke', desc: 'Gold Flow', color: '#F59E0B' },
                  { id: 'boxed', name: 'Red Alert', desc: 'Boxed Pill', color: '#EF4444' }
                ].map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id as any)}
                    className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-amber-500/60 transition text-left group"
                  >
                    <div className="w-full h-2 rounded-full mb-1.5" style={{ backgroundColor: preset.color }} />
                    <div className="text-xs font-bold text-white group-hover:text-amber-300">{preset.name}</div>
                    <div className="text-[10px] text-zinc-500">{preset.desc}</div>
                  </button>
                ))}
              </div>

              {/* Position & Size Adjuster */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-zinc-800/80">
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1 font-bold">
                    <span>Vertical Position</span>
                    <span className="font-mono text-amber-400">{captionStyle.yPositionPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="88"
                    value={captionStyle.yPositionPercent}
                    onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, yPositionPercent: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1 font-bold">
                    <span>Font Size</span>
                    <span className="font-mono text-amber-400">{captionStyle.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="40"
                    value={captionStyle.fontSize}
                    onChange={(e) => onUpdateCaptionStyle({ ...captionStyle, fontSize: Number(e.target.value) })}
                    className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Hook Headline Banner Editor */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Top Hook Headline Banner
                </label>
                <label className="flex items-center space-x-1 text-xs text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHookBanner}
                    onChange={(e) => setShowHookBanner(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 bg-zinc-950"
                  />
                  <span>Show Banner</span>
                </label>
              </div>
              <input
                type="text"
                value={clip.hookText}
                onChange={(e) => handleHookTextChange(e.target.value)}
                placeholder="e.g. STOP DOING THIS IF YOU WANT TO SCALE 🚨"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-black text-amber-300 tracking-wide focus:outline-none focus:border-amber-500 uppercase font-mono"
              />
            </div>

            {/* Word-by-Word Caption Editor */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-400" />
                  Word-by-Word Caption Timing & Spelling
                </label>
                <span className="text-[10px] text-zinc-400">
                  Click any word to edit
                </span>
              </div>

              <div className="max-h-36 overflow-y-auto p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 flex flex-wrap gap-1.5 text-xs">
                {clip.words.map((token, index) => {
                  const isEditing = editingWordIndex === index;

                  if (isEditing) {
                    return (
                      <input
                        key={index}
                        autoFocus
                        type="text"
                        defaultValue={token.word}
                        onBlur={(e) => handleWordEdit(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleWordEdit(index, (e.target as any).value);
                        }}
                        className="w-20 px-1.5 py-0.5 bg-amber-500 text-zinc-950 rounded font-bold text-xs"
                      />
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => setEditingWordIndex(index)}
                      className={`px-2 py-1 rounded-md transition font-medium text-xs flex items-center gap-1 ${
                        token.highlight
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                      title={`Start: ${token.start}s - End: ${token.end}s`}
                    >
                      <span>{token.word}</span>
                      {token.emoji && <span className="text-[10px]">{token.emoji}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI B-ROLL OVERLAYS */}
        {activeTab === 'broll' && (
          <div className="space-y-4">
            {/* Active B-Roll Cutaways List */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-indigo-400" />
                    Assigned B-Roll Cutaways ({clip.bRollCutaways?.length || 0})
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    B-Roll automatically overlays at high-emotion moments to maintain visual dopamine & retention.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {(!clip.bRollCutaways || clip.bRollCutaways.length === 0) ? (
                  <div className="p-4 bg-zinc-950 rounded-xl border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                    No B-Roll cutaways yet. Select a stock asset below to insert!
                  </div>
                ) : (
                  clip.bRollCutaways.map((cutaway) => (
                    <div
                      key={cutaway.id}
                      className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{cutaway.label}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Timestamps: {cutaway.startTime}s - {cutaway.endTime}s (Duration: {(cutaway.endTime - cutaway.startTime).toFixed(1)}s)
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveCutaway(cutaway.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition"
                        title="Remove Cutaway"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* B-Roll Stock Asset Library Picker */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Insert Stock B-Roll from Opus Library
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bRollLibrary.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between group hover:border-indigo-500/50 transition"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h5 className="text-xs font-bold text-white mt-1 line-clamp-1">{item.label}</h5>
                      <div className="text-[10px] text-zinc-500">
                        {item.tags.slice(0, 3).join(', ')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddBRollCutaway(item)}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-indigo-600 hover:text-white transition"
                      title="Insert Cutaway"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LAYOUT & REFRAMING */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Multi-Layout Selector */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Smart Video Layout (Opus Clip Engine)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleLayoutChange('two_speaker_split')}
                  className={`p-3 rounded-xl border text-left transition ${
                    clip.layout === 'two_speaker_split'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Users className="w-5 h-5 text-blue-400 mb-1.5" />
                  <div className="text-xs font-bold">2-Speaker Split</div>
                  <div className="text-[10px] text-zinc-500">Top host & bottom guest podcast view</div>
                </button>

                <button
                  onClick={() => handleLayoutChange('auto_reframe')}
                  className={`p-3 rounded-xl border text-left transition ${
                    clip.layout === 'auto_reframe'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <User className="w-5 h-5 text-emerald-400 mb-1.5" />
                  <div className="text-xs font-bold">Auto-Reframe Face Track</div>
                  <div className="text-[10px] text-zinc-500">AI locks onto active speaker's eyes</div>
                </button>

                <button
                  onClick={() => handleLayoutChange('screen_pip')}
                  className={`p-3 rounded-xl border text-left transition ${
                    clip.layout === 'screen_pip'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-5 h-5 text-indigo-400 mb-1.5" />
                  <div className="text-xs font-bold">Screen Share + PiP</div>
                  <div className="text-[10px] text-zinc-500">Presentation canvas with webcam corner</div>
                </button>
              </div>
            </div>

            {/* Manual Camera Pan Slider */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <MoveHorizontal className="w-4 h-4 text-amber-400" />
                  Manual Speaker Pan Adjustment
                </label>
                <span className="text-xs font-mono text-amber-400">
                  {clip.speakerOffset > 0 ? `+${clip.speakerOffset}% Right` : clip.speakerOffset < 0 ? `${clip.speakerOffset}% Left` : 'Centered'}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={clip.speakerOffset}
                onChange={(e) => handleSpeakerOffsetChange(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                <span>Left (-50%)</span>
                <span>Center (0%)</span>
                <span>Right (+50%)</span>
              </div>
            </div>

            {/* Clip Boundaries Trimmer */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  Clip Duration & Trimming
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {(clip.endTime - clip.startTime).toFixed(1)}s Duration
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Start Time (s)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={clip.startTime}
                    onChange={(e) => handleTrimChange(Number(e.target.value), clip.endTime)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">End Time (s)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={clip.endTime}
                    onChange={(e) => handleTrimChange(clip.startTime, Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXPORT & PUBLISH SUITE */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            {/* Subtitle & SRT / VTT Download Station */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                Export Subtitles & Closed Captions
              </h4>
              <p className="text-[11px] text-zinc-400 mb-3">
                Download frame-accurate timecoded subtitles formatted specifically for Premiere, Final Cut, CapCut, DaVinci Resolve, or native social uploads.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleExportSRT}
                  disabled={isExportingSubtitles}
                  className="flex-1 flex items-center justify-center space-x-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-zinc-800 transition"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download .SRT</span>
                </button>

                <button
                  onClick={handleExportVTT}
                  disabled={isExportingSubtitles}
                  className="flex-1 flex items-center justify-center space-x-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-zinc-800 transition"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Download WebVTT (.VTT)</span>
                </button>
              </div>
            </div>

            {/* Social Publishing Kit (Opus Clip Publisher) */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  Social Publishing Kit & Optimal Post Schedule
                </h4>
                <button
                  onClick={handleCopySocialKit}
                  className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  {copiedSocialKit ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSocialKit ? 'Copied Kit!' : 'Copy Entire Kit'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <div className="text-[10px] uppercase font-bold text-rose-400">TikTok Peak Window</div>
                  <div className="text-xs font-black text-white mt-0.5">6:30 PM - 9:00 PM EST</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Trending Ambient Audio</div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <div className="text-[10px] uppercase font-bold text-indigo-400">Instagram Reels Peak</div>
                  <div className="text-xs font-black text-white mt-0.5">12:00 PM - 2:00 PM EST</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Original Audio (Max Reach)</div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <div className="text-[10px] uppercase font-bold text-red-400">YouTube Shorts Peak</div>
                  <div className="text-xs font-black text-white mt-0.5">3:00 PM - 5:00 PM EST</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Direct Mic Voiceover</div>
                </div>
              </div>
            </div>

            {/* Content Rewards Submit Station */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Submit to Content Rewards Bounty
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Post to TikTok / Reels / Shorts with required tags, then submit your link to claim rewards.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Est. Payout (100k views)</span>
                  <div className="text-base font-black text-emerald-400 font-mono">
                    ${((100000 / 1000) * (campaign?.cpmRate || 1.50)).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleCopyMetadata}
                  className="flex-1 flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-zinc-700 transition active:scale-95"
                >
                  {copiedMetadata ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Metadata & Tags</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSubmitToCampaign(clip)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black py-2.5 px-4 rounded-xl text-xs hover:brightness-110 active:scale-95 transition shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Live Link for Payout</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

