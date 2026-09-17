import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  SetupWizardModal 
} from './components/SetupWizardModal';
import { 
  ProcessingPipelineModal 
} from './components/ProcessingPipelineModal';
import { 
  ClipEditor 
} from './components/ClipEditor';
import { 
  ClipGallery 
} from './components/ClipGallery';
import { 
  CampaignsManager 
} from './components/CampaignsManager';
import { 
  SubmissionsTracker 
} from './components/SubmissionsTracker';
import { 
  DockerArchGuide 
} from './components/DockerArchGuide';

import { 
  ClipMoment, 
  CaptionStyleConfig, 
  ProcessingWizardOptions, 
  Campaign, 
  Submission 
} from './types';

import { 
  SAMPLE_SOURCE_VIDEOS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_SUBMISSIONS, 
  DEFAULT_CLIPS 
} from './data/mockData';

import { 
  Youtube, 
  Upload, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Play, 
  FileText, 
  Video, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'clipper' | 'campaigns' | 'submissions' | 'docker'>('clipper');
  
  // Data stores
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(INITIAL_CAMPAIGNS[0].id);

  // Clipper Project State
  const [videoUrl, setVideoUrl] = useState<string>('https://youtube.com/watch?v=oz-ali-blueprint-8fig');
  const [videoTitle, setVideoTitle] = useState<string>('Oz Ali: From $0 to $1.2M/Month with One Product (Full Blueprint)');
  const [customTranscript, setCustomTranscript] = useState<string>('');
  const [showTranscriptBox, setShowTranscriptBox] = useState<boolean>(false);
  const [activeSourceSample, setActiveSourceSample] = useState<string>(SAMPLE_SOURCE_VIDEOS[0].id);

  // Wizard & Pipeline Modals
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isPipelineActive, setIsPipelineActive] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);

  // Clips & Active Selection
  const [clips, setClips] = useState<ClipMoment[]>(DEFAULT_CLIPS);
  const [selectedClipId, setSelectedClipId] = useState<string>(DEFAULT_CLIPS[0].id);

  // Caption Styling: User requested Bold word-by-word pop with white text, black stroke, and yellow highlight!
  const [captionStyle, setCaptionStyle] = useState<CaptionStyleConfig>({
    preset: 'bold_pop',
    fontColor: '#FFFFFF',
    highlightColor: '#FACC15', // Vibrant Viral Yellow
    strokeColor: '#000000',
    fontSize: 28,
    fontFamily: 'Impact, sans-serif',
    uppercase: true,
    yPositionPercent: 72,
    autoEmoji: true,
    wordsPerChunk: 3
  });

  // Fetch initial campaigns & submissions from backend if available
  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        if (data.campaigns && data.campaigns.length > 0) {
          setCampaigns(data.campaigns);
        }
      })
      .catch(() => {});

    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => {
        if (data.submissions && data.submissions.length > 0) {
          setSubmissions(data.submissions);
        }
      })
      .catch(() => {});
  }, []);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];
  const selectedClip = clips.find(c => c.id === selectedClipId) || clips[0];

  const totalEarnings = submissions.reduce((acc, s) => acc + s.earnings, 0);
  const totalViews = submissions.reduce((acc, s) => acc + s.views, 0);

  // Handlers
  const handleSelectSampleVideo = (sample: typeof SAMPLE_SOURCE_VIDEOS[0]) => {
    setActiveSourceSample(sample.id);
    setVideoUrl(sample.url);
    setVideoTitle(sample.title);
    setCustomTranscript(sample.sampleTranscript);
    if (sample.campaignId) {
      setSelectedCampaignId(sample.campaignId);
    }
  };

  const handleStartWizard = () => {
    setIsWizardOpen(true);
  };

  const handleStartGeneration = async (options: ProcessingWizardOptions) => {
    setIsWizardOpen(false);
    setIsPipelineActive(true);

    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          videoTitle,
          customTranscript,
          options
        })
      });

      const result = await response.json();
      if (result.clips && result.clips.length > 0) {
        setClips(result.clips);
        setSelectedClipId(result.clips[0].id);
      }
    } catch (e) {
      console.warn('Backend call failed, using default high virality moments:', e);
    }

    setCaptionStyle(options.captionStyle);
  };

  const handlePipelineComplete = () => {
    setIsPipelineActive(false);
    setHasGenerated(true);
    // Smooth scroll down to the generated clips workspace
    setTimeout(() => {
      const el = document.getElementById('generated-clips-workspace');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleUpdateClip = (updated: ClipMoment) => {
    setClips(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleSelectCampaignToClip = (campaign: Campaign) => {
    setSelectedCampaignId(campaign.id);
    setActiveTab('clipper');
    // Find matching sample video if available
    const matchingSample = SAMPLE_SOURCE_VIDEOS.find(s => s.campaignId === campaign.id);
    if (matchingSample) {
      handleSelectSampleVideo(matchingSample);
    }
  };

  const handleAddCampaign = async (newCampData: Partial<Campaign>) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampData)
      });
      const data = await res.json();
      if (data.campaign) {
        setCampaigns(prev => [data.campaign, ...prev]);
      }
    } catch (e) {
      // local fallback
      const created: Campaign = {
        id: 'camp-' + Date.now(),
        name: newCampData.name || 'Custom Campaign',
        hostBrand: newCampData.hostBrand || 'Creator Brand',
        cpmRate: newCampData.cpmRate || 1.50,
        budgetTotal: newCampData.budgetTotal || 10000,
        budgetRemaining: newCampData.budgetRemaining || 10000,
        minPayout: newCampData.minPayout || 50,
        maxPayout: newCampData.maxPayout || 1000,
        requiredDisclosure: newCampData.requiredDisclosure || '#ad',
        linkInBioUrl: newCampData.linkInBioUrl || 'https://whop.com',
        allowedPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
        minViewsForPayout: 5000,
        approvalRequired: true,
        submissionsCount: 0,
        totalViews: 0,
        totalPaidOut: 0,
        status: 'active',
        tags: ['Custom'],
        description: newCampData.description || ''
      };
      setCampaigns(prev => [created, ...prev]);
    }
  };

  const handleSubmitClipToCampaign = (clip: ClipMoment) => {
    setActiveTab('submissions');
  };

  const handleSubmitNewLink = async (subData: Partial<Submission>) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subData)
      });
      const data = await res.json();
      if (data.submission) {
        setSubmissions(prev => [data.submission, ...prev]);
      }
    } catch (e) {
      const newSub: Submission = {
        id: 'sub-' + Date.now(),
        clipId: subData.clipId || 'clip-custom',
        clipTitle: subData.clipTitle || 'Custom 9:16 Viral Clip',
        campaignId: subData.campaignId || activeCampaign.id,
        campaignName: subData.campaignName || activeCampaign.name,
        platform: subData.platform || 'TikTok',
        livePostUrl: subData.livePostUrl || '',
        views: subData.views || 2500,
        cpmRate: subData.cpmRate || activeCampaign.cpmRate,
        earnings: subData.earnings || 3.75,
        status: 'approved',
        submittedAt: new Date().toISOString(),
        payoutStatus: 'unpaid'
      };
      setSubmissions(prev => [newSub, ...prev]);
    }
  };

  const handleSimulateViews = async (subId: string) => {
    try {
      const res = await fetch(`/api/submissions/${subId}/simulate-views`, { method: 'PATCH' });
      const data = await res.json();
      if (data.submission) {
        setSubmissions(prev => prev.map(s => s.id === subId ? data.submission : s));
      }
    } catch (e) {
      setSubmissions(prev => prev.map(s => {
        if (s.id === subId) {
          const addedViews = 15000;
          const newViews = s.views + addedViews;
          const newEarnings = Number(((newViews / 1000) * s.cpmRate).toFixed(2));
          return {
            ...s,
            views: newViews,
            earnings: newEarnings,
            status: 'approved'
          };
        }
        return s;
      }));
    }
  };

  const handleResetNewProject = () => {
    setActiveTab('clipper');
    setIsWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewProject={handleResetNewProject}
        totalEarnings={totalEarnings}
        totalViews={totalViews}
        activeCampaignCount={campaigns.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Tab 1: AI Clipper Studio */}
        {activeTab === 'clipper' && (
          <div className="space-y-8">
            
            {/* Step 1: Video Ingestion Station */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">1</span>
                    <h2 className="text-base font-bold text-white">Source Video Ingestion</h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Paste a YouTube link, Google Drive link, or choose from active Content Rewards campaign masterclasses.
                  </p>
                </div>

                {/* Active Campaign Badge */}
                <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl self-start md:self-auto">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <div className="text-xs">
                    <span className="text-zinc-400">Target Campaign: </span>
                    <span className="font-bold text-amber-300">{activeCampaign?.name}</span>
                    <span className="text-emerald-400 font-mono font-bold ml-1.5">${activeCampaign?.cpmRate.toFixed(2)} CPM</span>
                  </div>
                </div>
              </div>

              {/* URL Input Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Youtube className="w-5 h-5 text-rose-500" />
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube, Drive or MP4 URL (e.g. https://youtube.com/watch?v=...)"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-amber-500 transition shadow-inner"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleStartGeneration({
                        aspectRatio: '9:16',
                        resolution: '1080p',
                        minDuration: 15,
                        maxDuration: 60,
                        clipCountMode: 'auto',
                        customClipCount: 3,
                        captionStyle,
                        editing: {
                          removeSilences: true,
                          removeFillerWords: true,
                          autoReframe: true,
                          addProgressBar: true,
                          addHookBanner: true,
                          addCampaignDisclosure: true
                        },
                        targetPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
                        campaignId: selectedCampaignId
                      });
                    }}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-zinc-950 font-black px-5 py-3 rounded-2xl text-xs hover:brightness-110 active:scale-95 transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Clips</span>
                  </button>

                  <button
                    onClick={handleStartWizard}
                    className="flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-3 rounded-2xl text-xs active:scale-95 transition border border-zinc-700 whitespace-nowrap"
                    title="Customize aspect ratio, durations, caption styling, and campaign settings"
                  >
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Preferences</span>
                  </button>
                </div>
              </div>

              {/* Quick Select Preset Campaign Masterclasses */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Quick Load: Verified Content Rewards Masterclasses
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SAMPLE_SOURCE_VIDEOS.map((sample) => {
                    const isSelected = activeSourceSample === sample.id;
                    const camp = campaigns.find(c => c.id === sample.campaignId);

                    return (
                      <div
                        key={sample.id}
                        onClick={() => handleSelectSampleVideo(sample)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                            : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 relative">
                          <img 
                            src={sample.thumbnail} 
                            alt={sample.title}
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-0.5">
                            <span className="font-semibold text-amber-400 font-mono">
                              {camp ? `$${camp.cpmRate.toFixed(2)} CPM` : 'Bounty'}
                            </span>
                            <span className="font-mono">{sample.duration}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">
                            {sample.channel}
                          </h4>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {sample.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Transcript Toggle */}
              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowTranscriptBox(!showTranscriptBox)}
                  className="text-xs text-zinc-400 hover:text-amber-400 font-medium flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showTranscriptBox ? 'Hide Custom Transcript' : 'Provide Custom Transcript / Notes (Optional)'}</span>
                </button>

                <div className="flex items-center space-x-2 text-[11px] text-zinc-500">
                  <span>Aspect: 9:16 Vertical</span>
                  <span>•</span>
                  <span>1080p Crisp</span>
                  <span>•</span>
                  <span>Bold Yellow Pop Captions</span>
                </div>
              </div>

              {showTranscriptBox && (
                <textarea
                  rows={4}
                  value={customTranscript}
                  onChange={(e) => setCustomTranscript(e.target.value)}
                  placeholder="Paste video transcript here if you want immediate word-level timing without downloading full video..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-amber-500"
                />
              )}

            </div>

            {/* Step 2: 9:16 Built-in Editor & Active Clip Workspace */}
            {hasGenerated && (
              <div id="generated-clips-workspace" className="space-y-6 scroll-mt-6">
                
                {/* Clip Gallery Tabs */}
                <ClipGallery
                  clips={clips}
                  selectedClipId={selectedClipId}
                  onSelectClip={(clip) => setSelectedClipId(clip.id)}
                  campaign={activeCampaign}
                />

                {/* Active Clip Editor with 9:16 Vertical Player */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Built-in 9:16 Vertical Clip Editor & Exporter
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Edit virality hook headlines, customize bold word-by-word yellow pop captions, and export 1080p MP4.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                        TikTok • Reels • Shorts Ready
                      </span>
                    </div>
                  </div>

                  <ClipEditor
                    clip={selectedClip}
                    onUpdateClip={handleUpdateClip}
                    campaign={activeCampaign}
                    captionStyle={captionStyle}
                    onUpdateCaptionStyle={setCaptionStyle}
                    onSubmitToCampaign={handleSubmitClipToCampaign}
                  />
                </div>

              </div>
            )}

          </div>
        )}

        {/* Tab 2: Content Rewards Campaigns */}
        {activeTab === 'campaigns' && (
          <CampaignsManager
            campaigns={campaigns}
            onSelectCampaignToClip={handleSelectCampaignToClip}
            onAddCampaign={handleAddCampaign}
          />
        )}

        {/* Tab 3: Submissions & Payout Tracker */}
        {activeTab === 'submissions' && (
          <SubmissionsTracker
            submissions={submissions}
            campaigns={campaigns}
            onSubmitNewLink={handleSubmitNewLink}
            onSimulateViews={handleSimulateViews}
          />
        )}

        {/* Tab 4: Local Docker & Architecture */}
        {activeTab === 'docker' && (
          <DockerArchGuide />
        )}

      </main>

      {/* Preferences Setup Wizard Modal */}
      {isWizardOpen && (
        <SetupWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onGenerate={handleStartGeneration}
          campaigns={campaigns}
          selectedCampaignId={selectedCampaignId}
          videoTitle={videoTitle}
        />
      )}

      {/* AI Processing Pipeline Live Visualizer */}
      {isPipelineActive && (
        <ProcessingPipelineModal
          isOpen={isPipelineActive}
          onComplete={handlePipelineComplete}
          videoTitle={videoTitle}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ClipRewards • Dedicated AI Short-Form Video & Content Rewards Platform</span>
          <div className="flex items-center space-x-4">
            <span>Aspect: 9:16 Vertical</span>
            <span>•</span>
            <span>Whisper + FFmpeg Pipeline</span>
            <span>•</span>
            <span>Local Docker Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
