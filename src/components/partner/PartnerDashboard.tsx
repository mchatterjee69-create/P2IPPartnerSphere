import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Wallet,
  TrendingUp,
  UserPlus,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Share2,
  Copy,
  Check,
  QrCode,
  Calendar,
  Sparkles,
  ChevronRight,
  PhoneCall,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export const PartnerDashboard: React.FC = () => {
  const {
    currentPartner,
    leads,
    commissions,
    followups,
    partnerLevels,
    setIsQuickReferOpen,
    setIsQRCodeOpen,
    setActiveTab,
    completeFollowup,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  // Filter metrics for the current partner
  const partnerLeads = leads.filter((l) => l.partnerId === currentPartner.id);
  const partnerCommissions = commissions.filter((c) => c.partnerId === currentPartner.id);

  // Financial calculations
  const totalEarnedThisMonth = partnerCommissions
    .filter((c) => c.status !== "REVERSED")
    .reduce((acc, c) => acc + c.commissionAmount, 0);

  const payableAmount = partnerCommissions
    .filter((c) => c.status === "PAYABLE")
    .reduce((acc, c) => acc + c.commissionAmount, 0);

  const pendingAmount = partnerCommissions
    .filter((c) => c.status === "PENDING" || c.status === "APPROVED")
    .reduce((acc, c) => acc + c.commissionAmount, 0);

  const paidAmount = partnerCommissions
    .filter((c) => c.status === "PAID")
    .reduce((acc, c) => acc + c.commissionAmount, 0);

  // Real monthly counts strictly based on actual data
  const currentReferrals = partnerLeads.length > 0
    ? partnerLeads.length
    : (currentPartner.currentMonthlyReferrals ?? 0);
  const target = currentPartner.monthlyTarget || 20;
  const progressPercent = target > 0 ? Math.min(100, Math.round((currentReferrals / target) * 100)) : 0;
  const referralsNeeded = Math.max(0, target - currentReferrals);

  const currentLevelConfig =
    partnerLevels.find((lvl) => lvl.key === currentPartner.level) || partnerLevels[0];
  const nextBonusAmount = currentLevelConfig?.monthlyPerformanceBonus ?? 0;

  // Breakdown metrics
  const challengeRegistrations = partnerLeads.filter(
    (l) => l.interestedProgramId === "prod-free-reset" || l.status === "REGISTERED"
  ).length;

  const challengeAttended = partnerLeads.filter(
    (l) => l.status === "CHALLENGE_ATTENDED" || l.status === "CHALLENGE_COMPLETED" || l.status === "PAID_CUSTOMER"
  ).length;

  const paidConversions = partnerLeads.filter(
    (l) => l.status === "PAID_CUSTOMER" || l.status === "RENEWAL"
  ).length;

  const totalRevenueGenerated = partnerCommissions
    .filter((c) => c.status !== "REVERSED")
    .reduce((acc, c) => acc + c.collectedRevenue, 0);

  // Partner Followups
  const partnerTasks = followups.filter((f) => f.partnerId === currentPartner.id && f.status === "PENDING");

  const referralUrl = currentPartner.referralUrl || `https://pathtoinnerpeace.in/r/${currentPartner.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in" id="partner-dashboard-view">
      {/* 1. HERO FINANCIAL OVERVIEW & GROWTH ACCELERATOR */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F5132] via-[#125838] to-[#0A3D24] text-white p-6 sm:p-8 shadow-xl border border-[#D4AF37]/30">
        {/* Decorative Gold Radiance Rings */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-48 h-48 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#D4AF37]/20 text-[#F5D77F] border border-[#D4AF37]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F5D77F]" />
                {currentPartner.level} PARTNER • {currentPartner.partnerType}
              </span>
              <span className="text-xs text-emerald-200/80">
                Attribution Code: <strong className="font-mono text-white">{currentPartner.code}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentPartner.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
              {currentPartner.organisation} • Empowering your community to find stillness, focus, and inner peace.
            </p>

            {/* Earnings Hero Metric */}
            <div className="mt-5 flex flex-wrap items-baseline gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold block">
                  Earned This Month
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F5D77F] tracking-tight">
                  ₹{totalEarnedThisMonth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-emerald-400/20 text-xs">
                <div>
                  <span className="text-emerald-200/80 block">Payable Balance</span>
                  <span className="font-bold text-white text-base">₹{payableAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-emerald-200/80 block">Next Payout</span>
                  <span className="font-bold text-white text-base">Friday Batch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setIsQuickReferOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B48220] text-gray-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-gray-950" />
              <span>+ Quick Refer Client</span>
            </button>

            <button
              onClick={() => setIsQRCodeOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer backdrop-blur-sm"
            >
              <QrCode className="w-4 h-4 text-[#F5D77F]" />
              <span>Show Partner QR Code</span>
            </button>
          </div>
        </div>

        {/* Growth Level Milestone Progress Bar */}
        <div className="mt-6 pt-5 border-t border-emerald-400/20">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Monthly Milestone:</span>
              <span className="text-emerald-200 font-medium">
                {currentReferrals} / {target} verified referrals
              </span>
            </div>
            <span className="font-bold text-[#F5D77F]">
              {referralsNeeded > 0
                ? `${referralsNeeded} more referrals to unlock ₹${nextBonusAmount.toLocaleString("en-IN")} PRO Bonus`
                : `🎉 Milestone Achieved! ₹${nextBonusAmount} Bonus Unlocked!`}
            </span>
          </div>

          <div className="w-full bg-emerald-950/60 rounded-full h-3 p-0.5 border border-emerald-500/30 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] h-full rounded-full transition-all duration-700 shadow-inner"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. INSTANT REFERRAL LINK BAR */}
      <div className="bg-white rounded-2xl p-4 border border-[#0F5132]/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 rounded-xl bg-[#E8F5E9] text-[#0F5132] shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Your Universal Referral Link
            </span>
            <span className="text-xs font-mono text-[#0F5132] font-semibold truncate block">
              {referralUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopy}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              copiedLink
                ? "bg-[#0F5132] text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedLink ? "Copied!" : "Copy Link"}
          </button>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `Join me for Path to Inner Peace's FREE 5-Day Mind Reset Challenge! Experience daily guided stillness & mental clarity: ${referralUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition flex items-center gap-1.5 shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* 3. 8 CORE MONTHLY METRIC CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F2923]/70">
            Monthly Performance Metrics
          </h2>
          <span className="text-xs font-semibold text-[#0F5132]">Real-time Attribution</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Referrals */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0F5132]/30 transition">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Total Referrals</span>
              <Users className="w-4 h-4 text-[#0F5132]" />
            </div>
            <div className="text-xl font-extrabold text-gray-900">{currentReferrals}</div>
            <div className="text-[10px] text-gray-500 mt-1">
              Lifetime: <strong className="text-gray-800">{currentPartner.totalReferrals}</strong>
            </div>
          </div>

          {/* Card 2: Challenge Registrations */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0F5132]/30 transition">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Challenge Registrations</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-extrabold text-gray-900">{challengeRegistrations}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">Free 5-Day Mind Reset</div>
          </div>

          {/* Card 3: Challenge Attendance */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0F5132]/30 transition">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Challenge Attended</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-gray-900">{challengeAttended}</div>
            <div className="text-[10px] text-gray-500 mt-1">
              ₹49 Activation Reward per completed lead
            </div>
          </div>

          {/* Card 4: Paid Conversions */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0F5132]/30 transition">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Paid Conversions</span>
              <Award className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xl font-extrabold text-[#0F5132]">{paidConversions}</div>
            <div className="text-[10px] text-gray-500 mt-1">
              Total Clients: <strong className="text-gray-800">{currentPartner.totalCustomers}</strong>
            </div>
          </div>

          {/* Card 5: Revenue Generated */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0F5132]/30 transition">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Revenue Generated</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-gray-900">
              ₹{totalRevenueGenerated.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Lifetime: ₹{currentPartner.lifetimeRevenue.toLocaleString("en-IN")}
            </div>
          </div>

          {/* Card 6: Commission Earned (50%) */}
          <div className="bg-white p-4 rounded-2xl border border-[#D4AF37]/30 shadow-xs bg-gradient-to-b from-white to-[#FDF8EB]">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-bold text-[#8B6508]">Commission Earned</span>
              <Wallet className="w-4 h-4 text-[#B48220]" />
            </div>
            <div className="text-xl font-extrabold text-[#8B6508]">
              ₹{totalEarnedThisMonth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-[#8B6508] font-semibold mt-1">
              50% Default Revenue Share
            </div>
          </div>

          {/* Card 7: Pending / Payable Commission */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0F5132]/30 transition">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Pending & Payable</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-extrabold text-amber-700">
              ₹{(pendingAmount + payableAmount).toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Subject to 7-day refund window
            </div>
          </div>

          {/* Card 8: Paid Commission */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0F5132]/30 transition">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-[11px] font-semibold">Paid Out</span>
              <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
            </div>
            <div className="text-xl font-extrabold text-[#0F5132]">
              ₹{paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Direct to Bank / UPI</div>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S PRIORITY FOLLOW-UPS & ENGAGEMENT ACTIONS */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#0F5132]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Today's Priority Follow-ups</h3>
              <p className="text-[11px] text-gray-500">
                Timely client touchpoints to drive challenge completion & program upgrades
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0F5132] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
              {partnerTasks.length} pending
            </span>
            <button
              onClick={() => setActiveTab("followups")}
              className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Tasks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {partnerTasks.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-500">
            ✨ All follow-ups completed for today! Check back after new client registrations.
          </div>
        ) : (
          <div className="space-y-2.5">
            {partnerTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#FBFBFA] hover:bg-[#F5F7F5] transition gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{task.leadName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                        task.priority === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.priority} PRIORITY
                    </span>
                    <span className="text-[10px] text-gray-400">Due: {task.dueDate}</span>
                  </div>
                  <p className="text-xs text-gray-600">{task.title}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Hi ${task.leadName}! Just checking in on your Path to Inner Peace journey. How did you find today's reflection session?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#1EBE5D] transition flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>

                  <button
                    onClick={() => completeFollowup(task.id)}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-[#0F5132] hover:text-white text-gray-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. REFERRAL LIFECYCLE PROGRESSION ROADMAP */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Referral Lifecycle Transparency</h3>
            <p className="text-[11px] text-gray-500">
              Clear path from prospective contact to recurring monthly revenue
            </p>
          </div>
          <button
            onClick={() => setActiveTab("leads")}
            className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Leads</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pipeline steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-[#F8F9F8] border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 block mb-1">STEP 1</span>
            <div className="font-bold text-gray-800">Referral Logged</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Attribution Locked</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F9F8] border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 block mb-1">STEP 2</span>
            <div className="font-bold text-gray-800">5-Day Reset</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Free Registration</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-600 block mb-1">STEP 3</span>
            <div className="font-bold text-emerald-900">Attendance Verified</div>
            <div className="text-[10px] font-bold text-[#0F5132] mt-0.5">₹49 Reward</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F9F8] border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 block mb-1">STEP 4</span>
            <div className="font-bold text-gray-800">Paid Upgrade</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Shift / Mastery</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[10px] font-bold text-amber-700 block mb-1">STEP 5</span>
            <div className="font-bold text-amber-900">50% Commission</div>
            <div className="text-[10px] text-amber-700 mt-0.5">Instant Ledger</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F9F8] border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 block mb-1">STEP 6</span>
            <div className="font-bold text-gray-800">Weekly Payout</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Bank / UPI</div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
            <span className="text-[10px] font-bold text-purple-700 block mb-1">STEP 7</span>
            <div className="font-bold text-purple-900">Monthly Renewal</div>
            <div className="text-[10px] text-purple-700 mt-0.5">Recurring Share</div>
          </div>
        </div>
      </div>
    </div>
  );
};
