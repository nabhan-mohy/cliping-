import React, { useState } from 'react';
import { Terminal, Copy, Check, Server, Cpu, Layers, FileCode, CheckCircle2 } from 'lucide-react';

export const DockerArchGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const dockerComposeCode = `version: '3.8'

services:
  web-app:
    build:
      context: ..
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - AI_PIPELINE_URL=http://ai-worker:8000
    depends_on:
      - ai-worker

  ai-worker:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./media_cache:/app/media_cache
    environment:
      - WHISPER_MODEL=base
      - DEVICE=cpu
    restart: unless-stopped`;

  const runCommand = `cd pipeline
docker-compose up --build`;

  const curlTest = `curl -X POST http://localhost:8000/api/render-clip \\
  -H "Content-Type: application/json" \\
  -d '{
    "video_id": "oz_ali_pod",
    "start_time": 12.0,
    "end_time": 44.5,
    "aspect_ratio": "9:16",
    "resolution": "1080p",
    "hook_banner": "STOP DOING THIS IF YOU WANT TO SCALE"
  }'`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-amber-400" />
          Local Docker Setup & Architecture Guide
        </h2>
        <p className="text-xs text-zinc-400">
          Everything you need to run the complete Whisper + FFmpeg 9:16 AI clipping pipeline on your local machine with Docker.
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          System Architecture: Local Free & Open-Source Stack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Server className="w-4 h-4" />
              <span>1. Web App & Studio (:3000)</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              React 19 + Express full-stack. Provides interactive 9:16 phone mockup, word-by-word bold caption compiler, Content Rewards CPM calculators, and export engine.
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>2. AI Worker FastAPI (:8000)</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Python 3.10 microservice running Faster-Whisper transformer model to generate millisecond word tokens and PySceneDetect for face-tracking speaker offsets.
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <FileCode className="w-4 h-4" />
              <span>3. FFmpeg 9:16 Video Engine</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Cuts video at exact millisecond timestamps, crops into 1080x1920 vertical canvas, silences removal, and encodes high-bitrate H.264 MP4.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Launch with Docker Compose */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">1</span>
            Launch Local Docker Stack
          </h3>
          <button
            onClick={() => copyToClipboard('runCmd', runCommand)}
            className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            {copiedKey === 'runCmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'runCmd' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 font-mono text-xs text-amber-300">
          <code>{runCommand}</code>
        </div>
        <p className="text-xs text-zinc-400">
          This builds the Node web container on port 3000 and the Python Whisper worker on port 8000.
        </p>
      </div>

      {/* Step 2: docker-compose.yml Reference */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">2</span>
            docker-compose.yml (Saved in /pipeline/docker-compose.yml)
          </h3>
          <button
            onClick={() => copyToClipboard('compose', dockerComposeCode)}
            className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            {copiedKey === 'compose' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'compose' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-56">
          <pre>{dockerComposeCode}</pre>
        </div>
      </div>

      {/* Step 3: Test API Endpoint */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">3</span>
            Test FFmpeg 9:16 Render Worker (cURL)
          </h3>
          <button
            onClick={() => copyToClipboard('curl', curlTest)}
            className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'curl' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
          <pre>{curlTest}</pre>
        </div>
      </div>

    </div>
  );
};
