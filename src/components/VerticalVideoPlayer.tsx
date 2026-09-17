import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Download, 
  Sparkles, Check, Flame, ShieldAlert, Maximize2,
  Users, User, Monitor, Film, Ratio, CheckCircle2
} from 'lucide-react';
import { ClipMoment, CaptionStyleConfig, Campaign } from '../types';
import confetti from 'canvas-confetti';

interface VerticalVideoPlayerProps {
  clip: ClipMoment;
  captionStyle: CaptionStyleConfig;
  speakerOffset: number; // -50 to 50 percent
  campaign?: Campaign;
  showHookBanner: boolean;
  showProgressBar: boolean;
  showDisclosure: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  aspectRatio?: '9:16' | '1:1' | '16:9';
  onAspectRatioChange?: (ratio: '9:16' | '1:1' | '16:9') => void;
  layout?: 'single_speaker' | 'two_speaker_split' | 'auto_reframe' | 'screen_pip';
  onLayoutChange?: (layout: 'single_speaker' | 'two_speaker_split' | 'auto_reframe' | 'screen_pip') => void;
}

export const VerticalVideoPlayer: React.FC<VerticalVideoPlayerProps> = ({
  clip,
  captionStyle,
  speakerOffset,
  campaign,
  showHookBanner,
  showProgressBar,
  showDisclosure,
  onTimeUpdate,
  aspectRatio = '9:16',
  onAspectRatioChange,
  layout = clip.layout || 'two_speaker_split',
  onLayoutChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(clip.startTime);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [bRollActive, setBRollActive] = useState<boolean>(clip.bRollEnabled !== false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const bRollVideoRef = useRef<HTMLVideoElement | null>(null);

  // Reset to clip start when clip changes
  useEffect(() => {
    setCurrentTime(clip.startTime);
    setIsPlaying(false);
  }, [clip.id, clip.startTime]);

  // Audio synthesizer / tick for immersive voice simulation
  const audioContextRef = useRef<AudioContext | null>(null);

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= clip.endTime) {
          // Loop back to clip start
          return clip.startTime;
        }
        if (onTimeUpdate) onTimeUpdate(next);
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, clip.startTime, clip.endTime, onTimeUpdate]);

  // Find active words at currentTime
  const currentWords = clip.words.filter(
    (w) => currentTime >= w.start - 0.2 && currentTime <= w.end + 0.35
  );

  // Fallback to active word in broader window if speech pauses
  const activeWord = clip.words.find(
    (w) => currentTime >= w.start && currentTime <= w.end
  ) || currentWords[0] || clip.words[0];

  // Active B-Roll check
  const activeBRoll = bRollActive && clip.bRollCutaways?.find(
    b => currentTime >= b.startTime && currentTime <= b.endTime
  );

  // Canvas Dimensions based on Aspect Ratio
  const canvasWidth = aspectRatio === '9:16' ? 1080 : aspectRatio === '1:1' ? 1080 : 1920;
  const canvasHeight = aspectRatio === '9:16' ? 1920 : aspectRatio === '1:1' ? 1080 : 1080;

  // Draw Canvas Frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const width = canvasWidth;
    const height = canvasHeight;

    // 1. Dark Studio Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // If B-Roll cutaway is active at this timestamp
    if (activeBRoll) {
      // Draw B-Roll Background Graphic
      const brollGrad = ctx.createLinearGradient(0, 0, width, height);
      brollGrad.addColorStop(0, '#1e1b4b');
      brollGrad.addColorStop(0.5, '#0f172a');
      brollGrad.addColorStop(1, '#020617');
      ctx.fillStyle = brollGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Dynamic Motion Grid / Stock Simulation
      ctx.save();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 2;
      const timeOffset = (currentTime * 40) % 80;
      for (let x = -80; x < width + 80; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x + timeOffset, 0);
        ctx.lineTo(x + timeOffset, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // B-Roll Visual Center Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.roundRect(width * 0.1, height * 0.25, width * 0.8, height * 0.35, 32);
      ctx.fill();
      ctx.strokeStyle = '#6366F1';
      ctx.lineWidth = 4;
      ctx.roundRect(width * 0.1, height * 0.25, width * 0.8, height * 0.35, 32);
      ctx.stroke();

      // B-Roll Label
      ctx.fillStyle = '#818CF8';
      ctx.font = 'bold 36px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ AI B-ROLL OVERLAY', width / 2, height * 0.35);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 48px Impact, -apple-system, sans-serif';
      ctx.fillText(activeBRoll.label.toUpperCase(), width / 2, height * 0.44);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '32px -apple-system, sans-serif';
      ctx.fillText(`Keyword: ${clip.bRollKeyword || 'Growth & Revenue'}`, width / 2, height * 0.51);

      ctx.restore();

    } else if (layout === 'two_speaker_split') {
      // 2-Speaker Split Screen (OpusClip's Podcast Mode)
      const splitY = height / 2;

      // TOP SPEAKER: Host
      ctx.save();
      const gradTop = ctx.createRadialGradient(width / 2, splitY / 2, 80, width / 2, splitY / 2, 500);
      gradTop.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
      gradTop.addColorStop(1, '#09090b');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, width, splitY);

      // Top Speaker Avatar / Figure
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(width / 2, splitY - 40, 260, 180, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(width / 2, splitY - 260, 120, 0, Math.PI * 2);
      ctx.fill();

      // Host Badge
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.roundRect(60, 60, 220, 56, 14);
      ctx.fill();
      ctx.fillStyle = '#60A5FA';
      ctx.font = 'bold 26px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎙️ HOST (Oz Ali)', 170, 96);
      ctx.restore();

      // Horizontal Split Divider Line
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, splitY - 3, width, 6);

      // BOTTOM SPEAKER: Guest
      ctx.save();
      const gradBottom = ctx.createRadialGradient(width / 2 + (speakerOffset * 5), splitY + (splitY / 2), 80, width / 2, splitY + (splitY / 2), 500);
      gradBottom.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      gradBottom.addColorStop(1, '#09090b');
      ctx.fillStyle = gradBottom;
      ctx.fillRect(0, splitY, width, splitY);

      const speakerX = width / 2 + (speakerOffset * 5);
      const guestBaseY = splitY + (splitY / 2);

      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.ellipse(speakerX, guestBaseY + 180, 280, 200, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3f3f46';
      ctx.beginPath();
      ctx.arc(speakerX, guestBaseY - 40, 130, 0, Math.PI * 2);
      ctx.fill();

      // Active Speaker Green Audio Pulse
      if (isPlaying) {
        const pulse = (Math.sin(currentTime * 12) + 1) * 16;
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(speakerX, guestBaseY - 40, 145 + pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Guest Badge
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.roundRect(60, splitY + 40, 240, 56, 14);
      ctx.fill();
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 26px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔥 SPEAKER (Active)', 180, splitY + 76);
      ctx.restore();

    } else if (layout === 'screen_pip') {
      // Screen Share + PiP
      // Background screen presentation
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 120, width - 120, height * 0.55);

      ctx.fillStyle = '#a5b4fc';
      ctx.font = 'bold 36px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💻 PRESENTATION / SCREEN DEMO', width / 2, height * 0.38);

      // Picture in picture webcam box
      const pipW = width * 0.42;
      const pipH = pipW * (9 / 16);
      const pipX = width - pipW - 60;
      const pipY = height * 0.45;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#18181b';
      ctx.roundRect(pipX, pipY, pipW, pipH, 20);
      ctx.fill();
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 4;
      ctx.roundRect(pipX, pipY, pipW, pipH, 20);
      ctx.stroke();

      // Speaker inside PiP
      ctx.fillStyle = '#3f3f46';
      ctx.beginPath();
      ctx.arc(pipX + pipW / 2, pipY + pipH / 2, pipH * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else {
      // Single Speaker / Auto Reframe (Face Tracking Mode)
      const speakerX = width / 2 + (speakerOffset * 6);
      const speakerY = height / 2 - 40;

      // Studio Warm Radial Gradient
      const gradient = ctx.createRadialGradient(speakerX, speakerY, 100, speakerX, speakerY, 700);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      gradient.addColorStop(0.6, 'rgba(180, 83, 9, 0.08)');
      gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Body / Shoulders
      ctx.save();
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.ellipse(speakerX, speakerY + 380, 360, 240, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.arc(speakerX, speakerY + 60, 160, 0, Math.PI * 2);
      ctx.fill();

      // Animated Sound Energy Rings
      if (isPlaying) {
        const ringPulse = (Math.sin(currentTime * 10) + 1) * 20;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(speakerX, speakerY + 60, 180 + ringPulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // AI Face Tracking Box (Visual feature matching OpusClip face centering)
      if (layout === 'auto_reframe') {
        const boxSize = 380;
        const boxLeft = speakerX - boxSize / 2;
        const boxTop = speakerY - 120;

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([16, 10]);
        ctx.strokeRect(boxLeft, boxTop, boxSize, boxSize);
        ctx.setLineDash([]);

        // Target Corners
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 5;
        const cornerLen = 28;
        // Top-left
        ctx.beginPath(); ctx.moveTo(boxLeft, boxTop + cornerLen); ctx.lineTo(boxLeft, boxTop); ctx.lineTo(boxLeft + cornerLen, boxTop); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(boxLeft + boxSize - cornerLen, boxTop); ctx.lineTo(boxLeft + boxSize, boxTop); ctx.lineTo(boxLeft + boxSize, boxTop + cornerLen); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(boxLeft, boxTop + boxSize - cornerLen); ctx.lineTo(boxLeft, boxTop + boxSize); ctx.lineTo(boxLeft + cornerLen, boxTop + boxSize); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(boxLeft + boxSize - cornerLen, boxTop + boxSize); ctx.lineTo(boxLeft + boxSize, boxTop + boxSize); ctx.lineTo(boxLeft + boxSize, boxTop + boxSize - cornerLen); ctx.stroke();

        // AI Tracking Tag
        ctx.fillStyle = '#10B981';
        ctx.roundRect(boxLeft, boxTop - 40, 200, 36, 8);
        ctx.fill();
        ctx.fillStyle = '#022c22';
        ctx.font = 'bold 20px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('● AI FACE TRACK', boxLeft + 100, boxTop - 16);
      }

      ctx.restore();
    }

    // Top & Bottom Vignette
    const vignette = ctx.createLinearGradient(0, 0, 0, height);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    vignette.addColorStop(0.18, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.82, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Hook Banner (Top of Screen)
    if (showHookBanner && clip.hookText) {
      ctx.save();
      const bannerY = aspectRatio === '9:16' ? 150 : 80;
      const bannerHeight = aspectRatio === '9:16' ? 110 : 80;
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 25;
      
      ctx.fillStyle = '#000000';
      ctx.roundRect(60, bannerY, width - 120, bannerHeight, 22);
      ctx.fill();

      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 5;
      ctx.roundRect(60, bannerY, width - 120, bannerHeight, 22);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 ${aspectRatio === '9:16' ? 44 : 32}px Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(clip.hookText, width / 2, bannerY + bannerHeight / 2);
      ctx.restore();
    }

    // Campaign Disclosure Tag
    if (showDisclosure && campaign?.requiredDisclosure) {
      ctx.save();
      const discY = aspectRatio === '9:16' ? 290 : 180;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.roundRect(width - 380, discY, 320, 52, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.roundRect(width - 380, discY, 320, 52, 14);
      ctx.stroke();

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(campaign.requiredDisclosure, width - 220, discY + 26);
      ctx.restore();
    }

    // Word-by-Word Captions (Hormozi, MrBeast, Ali Abdaal, Karaoke, Boxed)
    const captionY = height * (captionStyle.yPositionPercent / 100);

    const activeIndex = clip.words.findIndex(w => w.start === activeWord?.start);
    const startIdx = Math.max(0, activeIndex - 1);
    const endIdx = Math.min(clip.words.length, startIdx + (captionStyle.wordsPerChunk || 3));
    const visibleChunk = clip.words.slice(startIdx, endIdx);

    if (visibleChunk.length > 0) {
      ctx.save();
      const fontSizePx = captionStyle.fontSize * (aspectRatio === '9:16' ? 2.2 : 1.8);
      ctx.font = `900 ${fontSizePx}px ${captionStyle.fontFamily || 'Impact, sans-serif'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const wordsWithWidths = visibleChunk.map(w => {
        const displayText = (captionStyle.uppercase ? w.word.toUpperCase() : w.word) + (w.emoji ? ` ${w.emoji}` : '');
        return {
          ...w,
          displayText,
          width: ctx.measureText(displayText + ' ').width,
          isActive: w.start === activeWord?.start
        };
      });

      const totalWidth = wordsWithWidths.reduce((acc, curr) => acc + curr.width, 0);
      let currentX = (width - totalWidth) / 2;

      wordsWithWidths.forEach((item) => {
        const wordCenterX = currentX + item.width / 2;

        if (item.isActive) {
          const padX = 20;
          const padY = 16;
          const boxHeight = fontSizePx * 1.35;
          const boxWidth = item.width - 10 + (padX * 2);

          // Glowing Highlight Box
          ctx.shadowColor = captionStyle.highlightColor;
          ctx.shadowBlur = 25;
          ctx.fillStyle = captionStyle.highlightColor;
          ctx.roundRect(wordCenterX - boxWidth / 2, captionY - boxHeight / 2, boxWidth, boxHeight, 18);
          ctx.fill();

          ctx.fillStyle = captionStyle.highlightColor === '#FFFFFF' ? '#000000' : '#000000';
          ctx.shadowBlur = 0;
          ctx.fillText(item.displayText, wordCenterX, captionY + 2);

        } else {
          ctx.lineWidth = 14;
          ctx.strokeStyle = captionStyle.strokeColor || '#000000';
          ctx.strokeText(item.displayText, wordCenterX, captionY);

          ctx.fillStyle = captionStyle.fontColor || '#FFFFFF';
          ctx.fillText(item.displayText, wordCenterX, captionY);
        }

        currentX += item.width;
      });

      ctx.restore();
    }

    // Video Progress Bar
    if (showProgressBar) {
      const clipDuration = clip.endTime - clip.startTime;
      const progressPercent = Math.min(Math.max((currentTime - clip.startTime) / clipDuration, 0), 1);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(40, height - 50, width - 80, 12);

      ctx.fillStyle = captionStyle.highlightColor || '#FACC15';
      ctx.fillRect(40, height - 50, (width - 80) * progressPercent, 12);
    }

  }, [
    currentTime, 
    clip, 
    captionStyle, 
    speakerOffset, 
    campaign, 
    showHookBanner, 
    showProgressBar, 
    showDisclosure, 
    activeWord,
    isPlaying,
    aspectRatio,
    layout,
    activeBRoll,
    bRollActive
  ]);

  // Fast 1080p MP4 Export Simulation & True Blob Download
  const handleExportMP4 = () => {
    setIsExporting(true);
    setExportProgress(10);

    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 90) {
          clearInterval(interval);
          return 95;
        }
        return p + 20;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setExportProgress(100);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${clip.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${aspectRatio.replace(':', 'x')}_1080p.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/jpeg', 0.95);
      }

      setIsExporting(false);
    }, 1800);
  };

  const clipDuration = (clip.endTime - clip.startTime).toFixed(1);
  const elapsed = (currentTime - clip.startTime).toFixed(1);

  return (
    <div className="flex flex-col items-center w-full">

      {/* Top Layout & Aspect Ratio Switcher (Opus Clip Toolbar) */}
      <div className="w-full max-w-[360px] flex items-center justify-between mb-3 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
        {/* Aspect Ratio */}
        <div className="flex items-center space-x-1">
          <Ratio className="w-3.5 h-3.5 text-zinc-400 mr-1" />
          {(['9:16', '1:1', '16:9'] as const).map(ratio => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange && onAspectRatioChange(ratio)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                aspectRatio === ratio 
                  ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Layout Mode */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onLayoutChange && onLayoutChange('two_speaker_split')}
            title="Two-Speaker Split (Podcast)"
            className={`p-1 rounded transition ${layout === 'two_speaker_split' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
          >
            <Users className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange && onLayoutChange('auto_reframe')}
            title="Auto-Reframe Face Tracking"
            className={`p-1 rounded transition ${layout === 'auto_reframe' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
          >
            <User className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange && onLayoutChange('screen_pip')}
            title="Screen Share + PiP"
            className={`p-1 rounded transition ${layout === 'screen_pip' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className={`relative bg-black rounded-[36px] p-2.5 shadow-2xl shadow-amber-500/10 border-4 border-zinc-800 flex flex-col justify-between overflow-hidden group transition-all duration-300 ${
        aspectRatio === '9:16'
          ? 'w-[300px] sm:w-[340px] md:w-[350px] aspect-[9/16]'
          : aspectRatio === '1:1'
          ? 'w-[300px] sm:w-[340px] aspect-square'
          : 'w-[320px] sm:w-[420px] aspect-video'
      }`}>
        
        {/* Phone Notch (Only for 9:16) */}
        {aspectRatio === '9:16' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-zinc-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-zinc-800 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          </div>
        )}

        {/* Live Canvas Screen */}
        <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-zinc-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          />

          {/* Center Play Overlay */}
          {!isPlaying && (
            <div 
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-[1px] transition-all hover:bg-black/30"
            >
              <div className="p-4 rounded-full bg-amber-500 text-zinc-950 shadow-xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-transform">
                <Play className="w-7 h-7 fill-zinc-950 translate-x-0.5" />
              </div>
            </div>
          )}

          {/* B-Roll Active Live Tag */}
          {activeBRoll && (
            <div className="absolute top-4 left-4 bg-indigo-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-indigo-400/40 flex items-center gap-1 z-30 shadow-lg animate-pulse">
              <Film className="w-3 h-3" />
              <span>B-ROLL CUTAWAY</span>
            </div>
          )}

          {/* Social Platform UI Mockup overlay (TikTok style side buttons for 9:16) */}
          {aspectRatio === '9:16' && (
            <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-3.5 text-white text-xs z-20 pointer-events-none opacity-85">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-zinc-900/80 border border-white/20 flex items-center justify-center text-rose-500 text-xs">
                  ❤️
                </div>
                <span className="text-[9px] font-bold mt-0.5 drop-shadow">94.2K</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-zinc-900/80 border border-white/20 flex items-center justify-center text-white text-xs">
                  💬
                </div>
                <span className="text-[9px] font-bold mt-0.5 drop-shadow">1.8K</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-zinc-900/80 border border-white/20 flex items-center justify-center text-amber-400 text-xs">
                  💰
                </div>
                <span className="text-[9px] font-bold mt-0.5 text-amber-400 drop-shadow">Reward</span>
              </div>
            </div>
          )}

          {/* Bottom Metatag Overlay */}
          <div className="absolute left-4 bottom-6 right-16 z-20 pointer-events-none text-left">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-black text-white drop-shadow">@creator</span>
              <span className="text-[10px] bg-amber-500 text-zinc-950 font-bold px-1.5 rounded">
                SCORE {clip.viralityScore}
              </span>
            </div>
            <p className="text-[10px] text-zinc-200 line-clamp-2 leading-tight drop-shadow">
              {clip.caption}
            </p>
          </div>
        </div>

      </div>

      {/* Media Controller Bar */}
      <div className="w-full max-w-[360px] mt-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 shadow-lg">
        
        {/* Scrub Slider */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400 mb-2">
          <span>{elapsed}s</span>
          <input
            type="range"
            min={clip.startTime}
            max={clip.endTime}
            step="0.1"
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="flex-1 accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="text-zinc-500">{clipDuration}s</span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-amber-500 text-zinc-950 hover:brightness-110 active:scale-95 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950" />}
            </button>

            <button
              onClick={() => setCurrentTime(clip.startTime)}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
              title="Replay from clip start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setBRollActive(!bRollActive)}
              className={`p-2 rounded-xl text-xs transition flex items-center gap-1 ${
                bRollActive 
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' 
                  : 'bg-zinc-800 text-zinc-500'
              }`}
              title="Toggle AI B-Roll Overlays"
            >
              <Film className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">B-Roll</span>
            </button>
          </div>

          <button
            onClick={handleExportMP4}
            disabled={isExporting}
            className="flex items-center space-x-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs border border-amber-500/30 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? `${exportProgress}%` : 'Export 1080p'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
