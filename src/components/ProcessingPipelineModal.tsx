import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Video, FileAudio, Brain, Crop, Type, Layers } from 'lucide-react';
import { PipelineStage } from '../types';

interface ProcessingPipelineModalProps {
  isOpen: boolean;
  onComplete: () => void;
  videoTitle: string;
}

export const ProcessingPipelineModal: React.FC<ProcessingPipelineModalProps> = ({
  isOpen,
  onComplete,
  videoTitle
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number>(15);
  const [logs, setLogs] = useState<string[]>([]);

  const stages = [
    {
      id: 'ingest',
      label: 'Ingesting Video & Audio Stream',
      description: 'Extracting clean 16kHz audio stream via FFmpeg',
      icon: FileAudio
    },
    {
      id: 'transcribe',
      label: 'Whisper Word-Level Transcription',
      description: 'Aligning precise millisecond timestamps for each spoken word',
      icon: Type
    },
    {
      id: 'virality',
      label: 'Opus AI Virality & Retention Curve Analysis',
      description: 'Scoring hook strength, flow, engagement, and trend prediction',
      icon: Brain
    },
    {
      id: 'reframe',
      label: 'Multi-Layout Speaker Reframing',
      description: 'Calculating 2-speaker split screen & AI face tracking bounding boxes',
      icon: Crop
    },
    {
      id: 'broll',
      label: 'AI B-Roll Matching & Stock Cutaway Injection',
      description: 'Detecting context keywords to insert dynamic visual cutaways',
      icon: Video
    },
    {
      id: 'captions',
      label: 'Generating Kinetic Word-by-Word Captions',
      description: 'Applying Hormozi bold pop styling with auto-emojis and progress bars',
      icon: Layers
    }
  ];

  useEffect(() => {
    if (!isOpen) return;

    setCurrentStageIndex(0);
    setStageProgress(10);
    setLogs([
      `[Pipeline] Initializing worker for: "${videoTitle.slice(0, 40)}..."`,
      `[FFmpeg] Demuxing media containers and extracting 16kHz PCM audio...`
    ]);

    const interval = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 95) {
          return 95;
        }
        return prev + Math.floor(Math.random() * 12) + 5;
      });
    }, 400);

    const timeouts = [
      setTimeout(() => {
        setCurrentStageIndex(1);
        setStageProgress(30);
        setLogs(prev => [
          ...prev,
          `[Whisper] Audio extraction completed. Running Faster-Whisper transformer...`,
          `[Whisper] Detected language: English (confidence 99.8%). Aligning word tokens...`
        ]);
      }, 1400),

      setTimeout(() => {
        setCurrentStageIndex(2);
        setStageProgress(55);
        setLogs(prev => [
          ...prev,
          `[ViralityEngine] Scoring transcript segments across 15s-60s retention windows...`,
          `[ViralityEngine] Found 3 viral spikes: Contrarian scaling hook (Score 96), Pricing matrix (Score 92).`
        ]);
      }, 2900),

      setTimeout(() => {
        setCurrentStageIndex(3);
        setStageProgress(78);
        setLogs(prev => [
          ...prev,
          `[Vision] Tracking active speaker bounding box with MediaPipe...`,
          `[Reframe] Applying dynamic 9:16 crop box (1080x1920) centered on face.`
        ]);
      }, 4300),

      setTimeout(() => {
        setCurrentStageIndex(4);
        setStageProgress(96);
        setLogs(prev => [
          ...prev,
          `[Captions] Formatting Bold Pop styles with #FACC15 highlight and keyword emojis...`,
          `[Render] Finalizing clips and Content Rewards disclosure tags.`
        ]);
      }, 5500),

      setTimeout(() => {
        setStageProgress(100);
        setCurrentStageIndex(5); // all completed
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 6600),
    ];

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/10 border border-amber-500/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-lg font-black text-white tracking-tight">AI Clipping Pipeline Active</h2>
          <p className="text-xs text-zinc-400 mt-1 truncate px-4">
            Processing: <span className="text-zinc-200 font-medium">{videoTitle}</span>
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-zinc-400">Total Generation Progress</span>
            <span className="text-amber-400 font-mono font-bold">{stageProgress}%</span>
          </div>
          <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-300 shadow-sm shadow-amber-500/50"
              style={{ width: `${stageProgress}%` }}
            />
          </div>
        </div>

        {/* Pipeline Stage Checklist */}
        <div className="space-y-3 mb-6">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isFinished = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={stage.id}
                className={`flex items-start space-x-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-amber-500/60 bg-amber-500/10 shadow-sm'
                    : isFinished
                    ? 'border-zinc-800/80 bg-zinc-950/40 opacity-80'
                    : 'border-zinc-800/40 bg-zinc-950/20 opacity-40'
                }`}
              >
                <div className="mt-0.5">
                  {isFinished ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-white' : isFinished ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-amber-400 animate-pulse font-semibold">
                        PROCESSING...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Terminal Logs */}
        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 font-mono text-[10px] text-zinc-400 max-h-24 overflow-y-auto space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="leading-tight">
              <span className="text-zinc-600">&gt;</span> {log}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
