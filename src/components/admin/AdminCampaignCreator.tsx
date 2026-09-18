import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Zap,
  Plus,
  Calendar,
  Gift,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Campaign } from "../../types";

export const AdminCampaignCreator: React.FC = () => {
  const { campaigns, addCampaign, toggleCampaign } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetReferrals, setTargetReferrals] = useState(10);
  const [bonusAmount, setBonusAmount] = useState(2500);
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-30");
  const [badgeText, setBadgeText] = useState("Flash Incentive");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      name,
      description,
      targetReferrals,
      bonusAmount,
      startDate,
      endDate,
      badgeText,
      isActive: true,
    });

    setIsAddOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-campaigns-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#0F5132]" />
            Milestone Campaigns & Surge Incentives
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Design targeted seasonal bonuses and referral velocity sprints to accelerate community acquisition
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition hover:shadow-md ${
              c.isActive ? "border-gray-200" : "border-gray-300 opacity-60 bg-gray-50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#0F5132] border border-[#0F5132]/20">
                  {c.badgeText}
                </span>

                <button
                  onClick={() => toggleCampaign(c.id)}
                  className="text-xs font-bold flex items-center gap-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  {c.isActive ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400" /> Inactive
                    </span>
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-gray-900">{c.name}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{c.description}</p>
              </div>

              <div className="p-3 bg-[#FDF8EB] border border-[#D4AF37]/40 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[#8B6508]">
                  <span>Bonus Payout:</span>
                  <span>+₹{c.bonusAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-[11px] text-gray-600">
                  Target: <strong>{c.targetReferrals} referrals</strong> within window
                </div>
              </div>

              <div className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {c.startDate} to {c.endDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CREATE CAMPAIGN */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#0F5132]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#0F5132]" />
                Launch New Milestone Campaign
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. October Resilience Sprints"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Bonus or Autumn Surge"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Terms and incentive criteria for partners..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Referrals</label>
                  <input
                    type="number"
                    required
                    value={targetReferrals}
                    onChange={(e) => setTargetReferrals(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bonus Reward (₹)</label>
                  <input
                    type="number"
                    required
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Activate Campaign
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
