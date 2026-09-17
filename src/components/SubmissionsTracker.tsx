import React, { useState } from 'react';
import { 
  Send, DollarSign, Eye, ExternalLink, CheckCircle2, 
  Clock, AlertCircle, TrendingUp, Sparkles, Plus, RefreshCw 
} from 'lucide-react';
import { Submission, Campaign } from '../types';
import confetti from 'canvas-confetti';

interface SubmissionsTrackerProps {
  submissions: Submission[];
  campaigns: Campaign[];
  onSubmitNewLink: (sub: Partial<Submission>) => void;
  onSimulateViews: (id: string) => void;
}

export const SubmissionsTracker: React.FC<SubmissionsTrackerProps> = ({
  submissions,
  campaigns,
  onSubmitNewLink,
  onSimulateViews,
}) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [clipTitle, setClipTitle] = useState('');
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || '');
  const [platform, setPlatform] = useState<'TikTok' | 'Instagram Reels' | 'YouTube Shorts'>('TikTok');
  const [livePostUrl, setLivePostUrl] = useState('');
  const [initialViews, setInitialViews] = useState('2500');

  const totalViews = submissions.reduce((acc, s) => acc + s.views, 0);
  const totalEarnings = submissions.reduce((acc, s) => acc + s.earnings, 0);
  const paidEarnings = submissions
    .filter((s) => s.payoutStatus === 'paid')
    .reduce((acc, s) => acc + s.earnings, 0);
  const pendingEarnings = submissions
    .filter((s) => s.payoutStatus !== 'paid')
    .reduce((acc, s) => acc + s.earnings, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!livePostUrl) return;

    const selectedCamp = campaigns.find(c => c.id === campaignId) || campaigns[0];
    const viewsNum = parseInt(initialViews, 10) || 1000;
    const earningsNum = Number(((viewsNum / 1000) * selectedCamp.cpmRate).toFixed(2));

    onSubmitNewLink({
      clipTitle: clipTitle || 'Viral 9:16 Short Clip',
      campaignId: selectedCamp.id,
      campaignName: selectedCamp.name,
      platform,
      livePostUrl,
      views: viewsNum,
      cpmRate: selectedCamp.cpmRate,
      earnings: earningsNum,
      status: selectedCamp.approvalRequired ? 'pending_approval' : 'approved',
      payoutStatus: 'unpaid'
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });

    setIsSubmitModalOpen(false);
    setLivePostUrl('');
    setClipTitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-amber-400" />
            Content Rewards Submissions & Payouts
          </h2>
          <p className="text-xs text-zinc-400">
            Submit your live TikTok, Instagram Reels, and YouTube Shorts links. Earnings are verified based on CPM rates.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-110 active:scale-95 transition shadow-md shadow-amber-500/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Live Clip Link</span>
        </button>
      </div>

      {/* Payout & Views Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Total Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            ${totalEarnings.toFixed(2)}
          </div>
          <span className="text-[10px] text-zinc-500">Across all submitted campaigns</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Paid Out to Bank</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ${paidEarnings.toFixed(2)}
          </div>
          <span className="text-[10px] text-zinc-500">Processed via Whop / Stripe</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Pending Payout</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            ${pendingEarnings.toFixed(2)}
          </div>
          <span className="text-[10px] text-amber-400/80 font-medium">Ready in next cycle</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Verified Views</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500">Avg ${(totalEarnings / (totalViews / 1000 || 1)).toFixed(2)} CPM</span>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Registered Clip Submissions ({submissions.length})</h3>
          <span className="text-xs text-zinc-400">
            Click "Simulate Views" to test viral earnings growth
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 font-bold uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Clip & Campaign</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">CPM</th>
                <th className="px-4 py-3">Earnings</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payout</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {submissions.map((sub) => {
                return (
                  <tr key={sub.id} className="hover:bg-zinc-800/40 transition">
                    
                    {/* Title & Campaign */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-white max-w-xs truncate">{sub.clipTitle}</div>
                      <div className="text-[11px] text-amber-400/90 font-medium">{sub.campaignName}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{new Date(sub.submittedAt).toLocaleDateString()}</div>
                    </td>

                    {/* Platform */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {sub.platform}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-4 py-4 font-mono font-bold text-white">
                      {sub.views.toLocaleString()}
                    </td>

                    {/* CPM */}
                    <td className="px-4 py-4 font-mono text-zinc-400">
                      ${sub.cpmRate.toFixed(2)}
                    </td>

                    {/* Earnings */}
                    <td className="px-4 py-4 font-mono font-black text-emerald-400 text-sm">
                      ${sub.earnings.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : sub.status === 'pending_approval'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {sub.status === 'approved' ? 'Approved' : 'Pending Audit'}
                      </span>
                    </td>

                    {/* Payout Status */}
                    <td className="px-4 py-4">
                      <span className={`text-[11px] font-bold font-mono ${
                        sub.payoutStatus === 'paid' ? 'text-emerald-400' : 'text-zinc-400'
                      }`}>
                        {sub.payoutStatus === 'paid' ? '✓ Paid Out' : '• In Escrow'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onSimulateViews(sub.id)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-[11px] font-bold border border-amber-500/20 transition active:scale-95"
                        title="Simulate algorithmic view surge (+5k to +30k views)"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>+Views</span>
                      </button>

                      <a
                        href={sub.livePostUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center p-1 text-zinc-400 hover:text-white"
                        title="View Live Post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Clip Link Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Submit Live Clip For Rewards</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Enter your live TikTok, Instagram Reel, or YouTube Short link to register view tracking.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Clip Title</label>
                <input
                  type="text"
                  placeholder="e.g. The $10M Dropshipping Mistake"
                  value={clipTitle}
                  onChange={(e) => setClipTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Target Campaign</label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-medium"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.cpmRate.toFixed(2)} CPM)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e: any) => setPlatform(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Current Views</label>
                  <input
                    type="number"
                    value={initialViews}
                    onChange={(e) => setInitialViews(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Live Video URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://tiktok.com/@creator/video/12345..."
                  value={livePostUrl}
                  onChange={(e) => setLivePostUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition shadow-md shadow-amber-500/20"
                >
                  Submit Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
