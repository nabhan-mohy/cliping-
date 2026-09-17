import React, { useState } from 'react';
import { 
  Award, DollarSign, Eye, ShieldCheck, Plus, 
  ExternalLink, ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp, Sparkles 
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignsManagerProps {
  campaigns: Campaign[];
  onSelectCampaignToClip: (campaign: Campaign) => void;
  onAddCampaign: (campaign: Partial<Campaign>) => void;
}

export const CampaignsManager: React.FC<CampaignsManagerProps> = ({
  campaigns,
  onSelectCampaignToClip,
  onAddCampaign,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [hostBrand, setHostBrand] = useState('');
  const [cpmRate, setCpmRate] = useState('1.50');
  const [budgetTotal, setBudgetTotal] = useState('20000');
  const [minPayout, setMinPayout] = useState('50');
  const [maxPayout, setMaxPayout] = useState('1000');
  const [requiredDisclosure, setRequiredDisclosure] = useState('#ad #Partner');
  const [linkInBioUrl, setLinkInBioUrl] = useState('https://whop.com/rewards');
  const [description, setDescription] = useState('');

  const totalBudget = campaigns.reduce((acc, c) => acc + c.budgetTotal, 0);
  const totalRemaining = campaigns.reduce((acc, c) => acc + c.budgetRemaining, 0);
  const totalPaidOut = campaigns.reduce((acc, c) => acc + c.totalPaidOut, 0);
  const totalViews = campaigns.reduce((acc, c) => acc + c.totalViews, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpmRate) return;

    onAddCampaign({
      name,
      hostBrand: hostBrand || 'Independent Host',
      cpmRate: parseFloat(cpmRate),
      budgetTotal: parseFloat(budgetTotal) || 10000,
      budgetRemaining: parseFloat(budgetTotal) || 10000,
      minPayout: parseFloat(minPayout) || 50,
      maxPayout: parseFloat(maxPayout) || 1000,
      requiredDisclosure,
      linkInBioUrl,
      allowedPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
      minViewsForPayout: 5000,
      approvalRequired: true,
      description
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Overview Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            Content Rewards Campaign Hub
          </h2>
          <p className="text-xs text-zinc-400">
            Track active clipping bounties, CPM rates, pool budgets, view thresholds, and payout schedules.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-110 active:scale-95 transition shadow-md shadow-amber-500/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Campaign</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Remaining Budget Pool</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ${totalRemaining.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500">out of ${totalBudget.toLocaleString()} total</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Total Community Views</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {(totalViews / 1000000).toFixed(2)}M
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">+14.2% this week</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Disbursed Payouts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ${totalPaidOut.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500">Across approved clippers</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Top CPM Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            $2.00 / 1k
          </div>
          <span className="text-[10px] text-zinc-500">Acquisition.com Lead clips</span>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => {
          const budgetPercent = Math.round((camp.budgetRemaining / camp.budgetTotal) * 100);

          return (
            <div
              key={camp.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition shadow-lg"
            >
              <div>
                {/* Header: Host Brand & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {camp.hostBrand}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active Bounty
                  </span>
                </div>

                {/* Campaign Title */}
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {camp.name}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-2 mb-4">
                  {camp.description}
                </p>

                {/* Key Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 mb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-zinc-500">CPM Rate</div>
                    <div className="text-base font-black text-amber-400 font-mono">
                      ${camp.cpmRate.toFixed(2)}
                      <span className="text-xs text-zinc-400 font-normal"> /1k views</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-zinc-500">Payout Window</div>
                    <div className="text-xs font-bold text-zinc-300 font-mono mt-0.5">
                      ${camp.minPayout} min – ${camp.maxPayout} max
                    </div>
                  </div>
                </div>

                {/* Budget Remaining Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-zinc-400">Budget Pool Left</span>
                    <span className="text-white font-mono">${camp.budgetRemaining.toLocaleString()} ({budgetPercent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                      style={{ width: `${budgetPercent}%` }}
                    />
                  </div>
                </div>

                {/* Required Disclosure & Platform */}
                <div className="space-y-1.5 text-xs text-zinc-400 mb-5">
                  <div className="flex items-center justify-between">
                    <span>Required Tag:</span>
                    <span className="font-mono text-amber-300 font-bold">{camp.requiredDisclosure}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platforms:</span>
                    <span className="text-zinc-300">TikTok, Reels, Shorts</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center space-x-2">
                <button
                  onClick={() => onSelectCampaignToClip(camp)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-2.5 px-3 rounded-xl text-xs transition active:scale-95 shadow-md shadow-amber-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Clip For This Campaign</span>
                </button>

                <a
                  href={camp.linkInBioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition"
                  title="Open Campaign Rules & Whop Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Campaign Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Content Rewards Campaign</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Enter campaign bounty parameters, CPM rates, and disclosures.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oz Ali Dropshipping Masterclass"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Host Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Oz Ali Official"
                    value={hostBrand}
                    onChange={(e) => setHostBrand(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">CPM Rate (USD / 1k)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={cpmRate}
                    onChange={(e) => setCpmRate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Total Pool ($)</label>
                  <input
                    type="number"
                    value={budgetTotal}
                    onChange={(e) => setBudgetTotal(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Min Payout ($)</label>
                  <input
                    type="number"
                    value={minPayout}
                    onChange={(e) => setMinPayout(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Max Payout ($)</label>
                  <input
                    type="number"
                    value={maxPayout}
                    onChange={(e) => setMaxPayout(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Required Disclosure Tag</label>
                <input
                  type="text"
                  value={requiredDisclosure}
                  onChange={(e) => setRequiredDisclosure(e.target.value)}
                  placeholder="#ad #OzAliPartner"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Campaign Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Target audience, hook types, and high converting topics..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
