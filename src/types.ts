export interface WordToken {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  emoji?: string;
  highlight?: boolean;
}

export interface BRollCutaway {
  id: string;
  startTime: number;
  endTime: number;
  label: string;
  videoUrl: string;
  opacity?: number;
}

export interface ClipMoment {
  id: string;
  title: string;
  hookText: string;
  startTime: number;
  endTime: number;
  duration: number;
  viralityScore: number; // 0 - 100 overall
  hookScore?: number;       // 0 - 100 (Retention hook)
  flowScore?: number;       // 0 - 100 (Cadence and pacing)
  engagementScore?: number; // 0 - 100 (Wisdom/takeaway depth)
  trendScore?: number;      // 0 - 100 (Algorithm virality match)
  viralityReason: string;
  viralityHighlights?: string[]; // Bulleted breakdown like Opus Clip score cards
  hookType: 'contrarian' | 'story' | 'framework' | 'high_emotion' | 'value_drop';
  layout?: 'auto_reframe' | 'single_speaker' | 'two_speaker_split' | 'screen_pip' | 'fit_blur';
  aspectRatio?: '9:16' | '1:1' | '16:9';
  speakerOffset: number; // -50 to 50 for horizontal centering
  words: WordToken[];
  hashtags: string[];
  caption: string;
  suggestedPlatforms: ('TikTok' | 'Instagram Reels' | 'YouTube Shorts')[];
  status: 'ready' | 'draft' | 'exported' | 'submitted';
  linkedCampaignId?: string;
  bRollEnabled?: boolean;
  bRollKeyword?: string;
  bRollCutaways?: BRollCutaway[];
  showProgressBar?: boolean;
  fillerWordsRemoved?: number;
}

export interface CaptionStyleConfig {
  preset: 'bold_pop' | 'karaoke' | 'minimal' | 'boxed' | 'hormozi' | 'beast' | 'ali_abdaal';
  fontColor: string;
  highlightColor: string;
  strokeColor: string;
  fontSize: number; // in rem or px scale
  fontFamily: string;
  uppercase: boolean;
  yPositionPercent: number; // 20% to 85% from top
  autoEmoji: boolean;
  wordsPerChunk: number; // 1 to 4 words on screen at once
}

export interface ProcessingWizardOptions {
  aspectRatio: '9:16' | '1:1' | '16:9';
  resolution: '720p' | '1080p' | '4K';
  layout?: 'auto_reframe' | 'single_speaker' | 'two_speaker_split' | 'screen_pip' | 'fit_blur';
  minDuration: number;
  maxDuration: number;
  clipCountMode: 'auto' | 'custom';
  customClipCount: number;
  captionStyle: CaptionStyleConfig;
  editing: {
    removeSilences: boolean;
    removeFillerWords: boolean;
    autoReframe: boolean;
    addProgressBar: boolean;
    addHookBanner: boolean;
    addCampaignDisclosure: boolean;
    aiBRollInsertion?: boolean;
  };
  targetPlatforms: ('TikTok' | 'Instagram Reels' | 'YouTube Shorts')[];
  campaignId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  hostBrand: string;
  cpmRate: number; // USD per 1,000 views, e.g. 1.50
  budgetTotal: number;
  budgetRemaining: number;
  minPayout: number;
  maxPayout: number;
  requiredDisclosure: string; // e.g. "#ad #OzAliPartner"
  linkInBioUrl: string;
  allowedPlatforms: ('TikTok' | 'Instagram Reels' | 'YouTube Shorts')[];
  minViewsForPayout: number;
  approvalRequired: boolean;
  submissionsCount: number;
  totalViews: number;
  totalPaidOut: number;
  status: 'active' | 'paused' | 'completed';
  tags: string[];
  description: string;
}

export interface Submission {
  id: string;
  clipId: string;
  clipTitle: string;
  campaignId: string;
  campaignName: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
  livePostUrl: string;
  views: number;
  cpmRate: number;
  earnings: number;
  status: 'pending_approval' | 'approved' | 'rejected' | 'paid';
  submittedAt: string;
  payoutStatus: 'unpaid' | 'processing' | 'paid';
  adminNotes?: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
}
