import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Shield,
  Users,
  UserCheck,
  TrendingUp,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Clock,
  Award,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar,
  ChevronRight,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const {
    partners,
    leads,
    commissions,
    products,
    setActiveTab,
    setIsQuickReferOpen,
  } = useApp();

  // 10 Executive metrics calculation
  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === "ACTIVE").length;
  const newPartners = partners.filter((p) => p.joiningDate >= "2026-06-01").length;

  const totalReferrals = leads.length;
  const challengeRegistrations = leads.filter(
    (l) => l.interestedProgramId === "prod-free-reset" || l.status !== "NEW"
  ).length;

  const paidCustomers = leads.filter(
    (l) => l.status === "PAID_CUSTOMER" || l.status === "RENEWAL"
  ).length;

  const totalRevenueCollected = commissions
    .filter((c) => c.status !== "REVERSED")
    .reduce((sum, c) => sum + c.collectedRevenue, 0);

  const partnerCommissionLiability = commissions
    .filter((c) => c.status !== "REVERSED")
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const netP2IPRevenue = totalRevenueCollected - partnerCommissionLiability;

  const overallConversionRate =
    totalReferrals > 0 ? ((paidCustomers / totalReferrals) * 100).toFixed(1) : "0";

  // Attention Items
  const duplicateAlerts = leads.filter((l) => l.attributionStatus === "DUPLICATE_FLAGGED");
  const pendingApprovals = commissions.filter((c) => c.status === "PENDING" || c.status === "APPROVED");
  const payableCommissions = commissions.filter((c) => c.status === "PAYABLE");

  return (
    <div className="space-y-6 animate-fade-in" id="admin-dashboard-view">
      {/* Executive Welcome & Context Header */}
      <div className="bg-gradient-to-r from-[#0F5132] to-[#125838] text-white p-6 rounded-3xl shadow-xl border border-[#D4AF37]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D4AF37]/20 text-[#F5D77F] border border-[#D4AF37]/40 flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#F5D77F]" />
              Central Operations CRM
            </span>
            <span className="text-xs text-emerald-200">Path to Inner Peace Executive Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            P2IP PartnerSphere™ Master Overview
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl">
            Real-time management of multi-tier institutional partners, lead attribution integrity, and commission liabilities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab("admin-ai")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B48220] text-gray-950 font-bold text-xs shadow-md hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-gray-950" />
            Launch Admin AI
          </button>

          <button
            onClick={() => setIsQuickReferOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>+ Refer on Behalf</span>
          </button>
        </div>
      </div>

      {/* ATTENTION REQUIRED BANNERS */}
      {(duplicateAlerts.length > 0 || pendingApprovals.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {duplicateAlerts.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">
                    {duplicateAlerts.length} Duplicate Leads Require Attribution Review
                  </h4>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Phone/email collision detected. Resolve partner attribution in the CRM.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("admin-leads")}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs transition cursor-pointer shrink-0 ml-2"
              >
                Review Now
              </button>
            </div>
          )}

          {payableCommissions.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-[#0F5132]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">
                    {payableCommissions.length} Commissions Ready for Settlement
                  </h4>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Passed 7-day validation window. Ready for batch payout processing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("admin-payouts")}
                className="px-3 py-1.5 bg-[#0F5132] hover:bg-[#146c43] text-white font-bold rounded-lg text-xs transition cursor-pointer shrink-0 ml-2"
              >
                Process Payouts
              </button>
            </div>
          )}
        </div>
      )}

      {/* 10 EXECUTIVE METRICS GRID */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
          10 Executive Commercial Metrics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Total Partners */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Total Partners
            </span>
            <div className="text-2xl font-extrabold text-gray-900">{totalPartners}</div>
            <div className="text-[10px] text-gray-500 mt-1">Across 10 categories</div>
          </div>

          {/* 2. Active Partners */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Active Partners
            </span>
            <div className="text-2xl font-extrabold text-[#0F5132]">{activePartners}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-1">
              {Math.round((activePartners / totalPartners) * 100)}% active rate
            </div>
          </div>

          {/* 3. New Partners */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Recent Onboarded
            </span>
            <div className="text-2xl font-extrabold text-blue-700">{newPartners}</div>
            <div className="text-[10px] text-gray-500 mt-1">Last 90 days</div>
          </div>

          {/* 4. Total Referrals */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Total Referrals
            </span>
            <div className="text-2xl font-extrabold text-gray-900">{totalReferrals}</div>
            <div className="text-[10px] text-gray-500 mt-1">Logged into CRM</div>
          </div>

          {/* 5. Challenge Registrations */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Challenge Registrations
            </span>
            <div className="text-2xl font-extrabold text-indigo-700">
              {challengeRegistrations}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">5-Day Mind Reset</div>
          </div>

          {/* 6. Paid Customers */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Paid Customers
            </span>
            <div className="text-2xl font-extrabold text-[#8B6508]">{paidCustomers}</div>
            <div className="text-[10px] text-[#8B6508] font-bold mt-1">Active Subscribers</div>
          </div>

          {/* 7. Total Revenue Collected */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Gross Revenue Collected
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
              ₹{totalRevenueCollected.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Actual receipts</div>
          </div>

          {/* 8. Partner Commission Liability */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Partner Commission
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-700">
              ₹{partnerCommissionLiability.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">50% default payout pool</div>
          </div>

          {/* 9. Net P2IP Revenue */}
          <div className="bg-white p-4 rounded-2xl border border-[#0F5132]/30 shadow-xs bg-[#E8F5E9]/30">
            <span className="text-[11px] font-bold text-[#0F5132] block mb-1">
              Net P2IP Revenue
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#0F5132]">
              ₹{netP2IPRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-800 font-semibold mt-1">After commission</div>
          </div>

          {/* 10. Overall Conversion Rate */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1">
              Overall Conversion
            </span>
            <div className="text-2xl font-extrabold text-purple-700">
              {overallConversionRate}%
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Referral → Paid Client</div>
          </div>
        </div>
      </div>

      {/* HIGH-PERFORMING PARTNERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Top Performing Referral Partners</h3>
            <p className="text-xs text-gray-500">
              Ranked by verified monthly referrals, client conversion, and active growth level
            </p>
          </div>
          <button
            onClick={() => setActiveTab("admin-partners")}
            className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Partners</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F8] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Monthly / Target</th>
                <th className="py-3 px-4 text-right">Lifetime Rev</th>
                <th className="py-3 px-4 text-right">Lifetime Comm</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {partners.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <div className="text-[11px] text-gray-500">{p.organisation}</div>
                  </td>
                  <td className="py-3 px-4 font-medium">{p.partnerType}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#8B6508]">
                      {p.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#0F5132]">
                    {p.currentMonthlyReferrals} / {p.monthlyTarget}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    ₹{p.lifetimeRevenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#0F5132]">
                    ₹{p.lifetimeCommission.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
