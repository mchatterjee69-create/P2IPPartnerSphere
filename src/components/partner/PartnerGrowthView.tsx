import React from "react";
import { useApp } from "../../context/AppContext";
import {
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Gift,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";

export const PartnerGrowthView: React.FC = () => {
  const { currentPartner, partnerLevels, campaigns, leads } = useApp();

  const currentLevelKey = currentPartner.level;
  const currentLevelIndex = partnerLevels.findIndex((l) => l.key === currentLevelKey);

  const partnerLeads = leads.filter((l) => l.partnerId === currentPartner.id);
  const monthlyReferrals = partnerLeads.length > 0 
    ? partnerLeads.length 
    : (currentPartner.currentMonthlyReferrals ?? 0);
  const target = currentPartner.monthlyTarget || 20;

  return (
    <div className="space-y-6 animate-fade-in" id="partner-growth-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0F5132]" />
            Growth Levels & Performance Bonuses
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Progress through institutional partner tiers to unlock elevated monthly bonuses and VIP recognition
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FDF8EB] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-xl">
          <Sparkles className="w-4 h-4 text-[#B48220]" />
          <span className="text-xs font-bold text-[#8B6508]">
            Current Level: {currentPartner.level} PARTNER
          </span>
        </div>
      </div>

      {/* TIER PROGRESSION CARDS */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Partner Progression Structure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {partnerLevels.map((tier, idx) => {
            const isCurrent = tier.key === currentLevelKey;
            const isUnlocked = idx <= currentLevelIndex;

            return (
              <div
                key={tier.key}
                className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                  isCurrent
                    ? "bg-gradient-to-b from-[#0F5132] to-[#125838] text-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/40"
                    : isUnlocked
                    ? "bg-white border-emerald-200 text-gray-800"
                    : "bg-gray-50/80 border-gray-200 text-gray-400"
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 right-3 bg-[#D4AF37] text-gray-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Active Tier
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider ${
                        isCurrent ? "text-[#F5D77F]" : isUnlocked ? "text-[#0F5132]" : "text-gray-400"
                      }`}
                    >
                      {tier.name}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className={`w-4 h-4 ${isCurrent ? "text-[#F5D77F]" : "text-[#0F5132]"}`} />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-300" />
                    )}
                  </div>

                  <div className={`text-lg font-extrabold ${isCurrent ? "text-white" : "text-gray-900"}`}>
                    {tier.minReferrals}
                    {tier.maxReferrals ? ` - ${tier.maxReferrals}` : "+"}
                    <span className="text-[11px] font-normal block text-gray-400">
                      referrals / mo
                    </span>
                  </div>

                  <p className={`text-[11px] mt-2 leading-relaxed ${isCurrent ? "text-emerald-100/90" : "text-gray-500"}`}>
                    {tier.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100/20 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-semibold">Monthly Bonus:</span>
                    <strong className={`text-xs ${isCurrent ? "text-[#F5D77F]" : "text-[#0F5132]"}`}>
                      {tier.monthlyPerformanceBonus > 0
                        ? `+₹${tier.monthlyPerformanceBonus.toLocaleString("en-IN")}`
                        : "Standard 50%"}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SMART CAMPAIGNS & MILESTONE INCENTIVES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Active Milestone Campaigns
          </h2>
          <span className="text-xs text-emerald-700 font-semibold">Auto-calculated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:border-[#0F5132]/30 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#0F5132] border border-[#0F5132]/20 uppercase tracking-wider">
                    {camp.badgeText}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Valid till {camp.endDate}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-gray-900">{camp.name}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {camp.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Reward:</span>
                  <strong className="text-sm font-extrabold text-[#8B6508]">
                    +₹{camp.bonusAmount.toLocaleString("en-IN")} Bonus
                  </strong>
                </div>

                <div className="text-right">
                  <span className="text-gray-500 block text-[10px]">Target:</span>
                  <strong className="text-xs font-bold text-gray-800">
                    {camp.targetReferrals} referrals
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
