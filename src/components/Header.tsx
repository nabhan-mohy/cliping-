import React from 'react';
import { Film, Award, Send, Terminal, Sparkles, Plus, DollarSign, Eye, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'clipper' | 'campaigns' | 'submissions' | 'docker';
  setActiveTab: (tab: 'clipper' | 'campaigns' | 'submissions' | 'docker') => void;
  onNewProject: () => void;
  totalEarnings: number;
  totalViews: number;
  activeCampaignCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewProject,
  totalEarnings,
  totalViews,
  activeCampaignCount,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('clipper')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20">
              <Film className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">ClipRewards</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Content Rewards AI
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium hidden sm:block">
                9:16 Vertical Viral Clipper • CPM & Payout Tracker
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => setActiveTab('clipper')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'clipper'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Clipper</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Campaigns</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-800 text-amber-400">
                {activeCampaignCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'submissions'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submissions & Payouts</span>
            </button>

            <button
              onClick={() => setActiveTab('docker')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'docker'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Local Docker</span>
            </button>
          </nav>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                <span>${totalEarnings.toFixed(2)}</span>
                <span className="text-[10px] text-zinc-400 font-normal">Earned</span>
              </div>
              <div className="h-3 w-[1px] bg-zinc-700" />
              <div className="flex items-center space-x-1 text-zinc-300 font-medium">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>{(totalViews / 1000).toFixed(1)}k</span>
                <span className="text-[10px] text-zinc-400 font-normal">Views</span>
              </div>
            </div>

            <button
              onClick={onNewProject}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-bold px-3.5 py-1.5 rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/10"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Clip</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
