import React, { useState } from 'react';
import { 
  X, Sparkles, Sliders, Smartphone, Check, 
  VolumeX, ShieldCheck, Flame, Scissors, Zap, AlertCircle
} from 'lucide-react';
import { ProcessingWizardOptions, Campaign } from '../types';

interface SetupWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: ProcessingWizardOptions) => void;
  campaigns: Campaign[];
  selectedCampaignId?: string;
  videoTitle?: string;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  campaigns,
  selectedCampaignId,
  videoTitle,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4K'>('1080p');
  const [minDuration, setMinDuration] = useState<number>(15);
  const [maxDuration, setMaxDuration] = useState<number>(60);
  const [clipCountMode, setClipCountMode] = useState<'auto' | 'custom'>('auto');
  const [customClipCount, setCustomClipCount] = useState<number>(5);

  // Caption Styling: User requested Bold word-by-word pop with white text, black stroke, and yellow highlight
  const [captionPreset, setCaptionPreset] = useState<'bold_pop' | 'karaoke' | 'minimal' | 'boxed'>('bold_pop');
  const [highlightColor, setHighlightColor] = useState<string>('#FACC15'); // Energetic Yellow
  const [fontColor, setFontColor] = useState<string>('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [fontSize, setFontSize] = useState<number>(28);
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [yPositionPercent, setYPositionPercent] = useState<number>(72);
  const [autoEmoji, setAutoEmoji] = useState<boolean>(true);

  // Editing switches
  const [removeSilences, setRemoveSilences] = useState<boolean>(true);
  const [removeFillerWords, setRemoveFillerWords] = useState<boolean>(true);
  const [autoReframe, setAutoReframe] = useState<boolean>(true);
  const [addProgressBar, setAddProgressBar] = useState<boolean>(true);
  const [addHookBanner, setAddHookBanner] = useState<boolean>(true);
  const [addCampaignDisclosure, setAddCampaignDisclosure] = useState<boolean>(true);

  // Campaign selection
  const [campaignId, setCampaignId] = useState<string>(selectedCampaignId || campaigns[0]?.id || '');
  const activeCampaign = campaigns.find(c => c.id === campaignId) || campaigns[0];

  const handleStartGeneration = () => {
    const options: ProcessingWizardOptions = {
      aspectRatio,
      resolution,
      minDuration,
      maxDuration,
      clipCountMode,
      customClipCount,
      captionStyle: {
        preset: captionPreset,
        fontColor,
        highlightColor,
        strokeColor,
        fontSize,
        fontFamily: 'Impact, sans-serif',
        uppercase,
        yPositionPercent,
        autoEmoji,
        wordsPerChunk: 3
      },
      editing: {
        removeSilences,
        removeFillerWords,
        autoReframe,
        addProgressBar,
        addHookBanner,
        addCampaignDisclosure
      },
      targetPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
      campaignId
    };

    onGenerate(options);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Clip Preferences & Setup Wizard</h2>
              <p className="text-xs text-zinc-400 truncate max-w-md">
                {videoTitle ? `Source: ${videoTitle}` : 'Configure virality model, 9:16 reframe & Content Rewards'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Campaign Link Section (Content Rewards) */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Target Content Rewards Campaign
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ${activeCampaign?.cpmRate?.toFixed(2)} CPM Rate
              </span>
            </div>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 font-medium"
            >
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name} ({camp.hostBrand}) — ${camp.cpmRate.toFixed(2)} CPM • Budget Left: ${camp.budgetRemaining.toLocaleString()}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-400 mt-2">
              Required disclosure will be auto-inserted: <span className="text-amber-300 font-mono">{activeCampaign?.requiredDisclosure || '#ad'}</span>. Allowed: TikTok, Reels, Shorts.
            </p>
          </div>

          {/* Aspect Ratio & Resolution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    aspectRatio === '9:16'
                      ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-1 text-amber-400" />
                  <span className="text-xs">9:16 Vertical</span>
                  <span className="text-[10px] text-amber-300">TikTok / Reels / Shorts</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    aspectRatio === '1:1'
                      ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-4 h-4 border border-zinc-400 rounded-sm mb-1.5" />
                  <span className="text-xs">1:1 Square</span>
                  <span className="text-[10px] text-zinc-500">Instagram Feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                    aspectRatio === '16:9'
                      ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-5 h-3 border border-zinc-400 rounded-sm mb-2" />
                  <span className="text-xs">16:9 Wide</span>
                  <span className="text-[10px] text-zinc-500">YouTube Long</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Export Resolution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['720p', '1080p', '4K'] as const).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-3 px-2 rounded-xl border text-center transition ${
                      resolution === res
                        ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{res}</div>
                    <div className="text-[10px] text-zinc-500">
                      {res === '1080p' ? 'Recommended (Crisp)' : res === '4K' ? 'Ultra HQ' : 'Fast Render'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clip Duration Range (15-60s) & Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Clip Duration Range
                </label>
                <span className="text-xs font-bold text-amber-400">
                  {minDuration}s – {maxDuration}s
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Min Duration ({minDuration}s)</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    value={minDuration}
                    onChange={(e) => setMinDuration(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Max Duration ({maxDuration}s)</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">
                15-60s satisfies Content Rewards rules for full view qualification.
              </p>
            </div>

            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Number of Clips
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setClipCountMode('auto')}
                  className={`p-2.5 rounded-lg border text-center transition ${
                    clipCountMode === 'auto'
                      ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Auto-Detect
                  </div>
                  <div className="text-[10px] text-zinc-400">Score &gt;85 Virality</div>
                </button>

                <button
                  type="button"
                  onClick={() => setClipCountMode('custom')}
                  className={`p-2.5 rounded-lg border text-center transition ${
                    clipCountMode === 'custom'
                      ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-bold">Exact Count</div>
                  <div className="text-[10px] text-zinc-400">{customClipCount} Clips</div>
                </button>
              </div>

              {clipCountMode === 'custom' && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-zinc-400">Target count:</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={customClipCount}
                    onChange={(e) => setCustomClipCount(Number(e.target.value))}
                    className="w-20 bg-zinc-900 border border-zinc-700 text-white rounded px-2 py-1 text-xs text-center"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Caption Style Settings: Bold word-by-word pop with yellow highlight */}
          <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Caption Style: Bold Word-by-Word Pop
              </label>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Highest Viral Retention
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Highlight Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => setHighlightColor(e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs text-amber-400 font-mono font-bold">{highlightColor} (Viral Yellow)</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Text Size</label>
                <input
                  type="range"
                  min="20"
                  max="44"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
                />
                <div className="text-[10px] text-zinc-400 text-right">{fontSize}px</div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Vertical Y-Pos</label>
                <input
                  type="range"
                  min="30"
                  max="85"
                  value={yPositionPercent}
                  onChange={(e) => setYPositionPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded cursor-pointer"
                />
                <div className="text-[10px] text-zinc-400 text-right">{yPositionPercent}% (Lower Third)</div>
              </div>
            </div>

            {/* Live Caption Style Preview Box */}
            <div className="h-20 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] font-mono text-zinc-500 uppercase">
                Style Preview:
              </div>
              <div 
                className="font-black text-center tracking-tight select-none"
                style={{
                  fontSize: `${fontSize * 0.75}px`,
                  color: fontColor,
                  textShadow: `-2px -2px 0 ${strokeColor}, 2px -2px 0 ${strokeColor}, -2px 2px 0 ${strokeColor}, 2px 2px 0 ${strokeColor}, 0 4px 12px rgba(0,0,0,0.8)`
                }}
              >
                <span>STOP </span>
                <span 
                  className="px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: highlightColor,
                    color: '#000000',
                    textShadow: 'none'
                  }}
                >
                  DOING
                </span>
                <span> THIS {autoEmoji ? '🚨' : ''}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900"
                />
                <span>Force All-Caps (Impact look)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEmoji}
                  onChange={(e) => setAutoEmoji(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900"
                />
                <span>Auto-Insert Keyword Emojis (💰, 🚀, ⏱️)</span>
              </label>
            </div>
          </div>

          {/* Editing & Polish Switches */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Automated AI Polish
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition">
                <div className="flex items-center space-x-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-zinc-200 font-medium">Remove Silences & Pauses</span>
                </div>
                <input
                  type="checkbox"
                  checked={removeSilences}
                  onChange={(e) => setRemoveSilences(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition">
                <div className="flex items-center space-x-2">
                  <VolumeX className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-zinc-200 font-medium">Remove Filler Words (um, uh)</span>
                </div>
                <input
                  type="checkbox"
                  checked={removeFillerWords}
                  onChange={(e) => setRemoveFillerWords(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-zinc-200 font-medium">Auto-Reframe Active Speaker</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoReframe}
                  onChange={(e) => setAutoReframe(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950 cursor-pointer transition">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-zinc-200 font-medium">Burn Top Hook Headline Banner</span>
                </div>
                <input
                  type="checkbox"
                  checked={addHookBanner}
                  onChange={(e) => setAddHookBanner(e.target.checked)}
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleStartGeneration}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-zinc-950 font-extrabold px-6 py-2.5 rounded-xl text-xs hover:brightness-110 active:scale-95 transition shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate 9:16 Viral Clips</span>
          </button>
        </div>

      </div>
    </div>
  );
};
