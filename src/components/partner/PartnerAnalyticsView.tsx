import React from "react";
import { useApp } from "../../context/AppContext";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const PartnerAnalyticsView: React.FC = () => {
  const { currentPartner, leads, commissions, products } = useApp();

  const myLeads = leads.filter((l) => l.partnerId === currentPartner.id);
  const myCommissions = commissions.filter((c) => c.partnerId === currentPartner.id && c.status !== "REVERSED");

  // Funnel counts
  const totalReferrals = myLeads.length;
  const registered = myLeads.filter(
    (l) => l.status !== "NEW" && l.status !== "CONTACTED" && l.status !== "LOST"
  ).length;
  const attended = myLeads.filter(
    (l) => l.status === "CHALLENGE_ATTENDED" || l.status === "CHALLENGE_COMPLETED" || l.status === "PAID_CUSTOMER"
  ).length;
  const paidCustomers = myLeads.filter((l) => l.status === "PAID_CUSTOMER").length;

  const regRate = totalReferrals > 0 ? Math.round((registered / totalReferrals) * 100) : 0;
  const attendRate = registered > 0 ? Math.round((attended / registered) * 100) : 0;
  const paidRate = attended > 0 ? Math.round((paidCustomers / attended) * 100) : 0;
  const overallConversion = totalReferrals > 0 ? Math.round((paidCustomers / totalReferrals) * 100) : 0;

  // Program Breakdown
  const programMap: { [name: string]: { count: number; revenue: number; commission: number } } = {};
  myCommissions.forEach((c) => {
    if (!programMap[c.productName]) {
      programMap[c.productName] = { count: 0, revenue: 0, commission: 0 };
    }
    programMap[c.productName].count += 1;
    programMap[c.productName].revenue += c.collectedRevenue;
    programMap[c.productName].commission += c.commissionAmount;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="partner-analytics-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0F5132]" />
            Partner Conversion & Revenue Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Holistic data intelligence on your client transformation funnel and program monetization
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#0F5132]/30 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0F5132]">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          Overall Conversion: {overallConversion}%
        </div>
      </div>

      {/* 1. VISUAL CONVERSION FUNNEL */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Client Transformation Funnel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-blue-700 font-bold uppercase">
              <span>Stage 1</span>
              <span>100%</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-950">{totalReferrals}</div>
            <div className="text-xs font-semibold text-blue-900">Total Referrals Logged</div>
            <p className="text-[11px] text-blue-800/80">Clients introduced through your code or links.</p>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-700 font-bold uppercase">
              <span>Stage 2</span>
              <span>{regRate}%</span>
            </div>
            <div className="text-2xl font-extrabold text-indigo-950">{registered}</div>
            <div className="text-xs font-semibold text-indigo-900">Registered for Challenge</div>
            <p className="text-[11px] text-indigo-800/80">Reserved a free spot in the 5-Day Reset.</p>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-bold uppercase">
              <span>Stage 3</span>
              <span>{attendRate}%</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-950">{attended}</div>
            <div className="text-xs font-semibold text-emerald-900">Attended / Completed</div>
            <p className="text-[11px] text-emerald-800/80">Earned ₹49 Activation Reward each.</p>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8B6508] font-bold uppercase">
              <span>Stage 4</span>
              <span>{paidRate}%</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-950">{paidCustomers}</div>
            <div className="text-xs font-semibold text-amber-900">Paid Program Enrollments</div>
            <p className="text-[11px] text-amber-800/80">50% Recurring revenue share credited.</p>
          </div>
        </div>
      </div>

      {/* 2. REVENUE BY PROGRAM BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Program Enrollment & Commission Breakdown
        </h2>

        <div className="space-y-3">
          {Object.keys(programMap).length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400">
              No program commissions recorded yet.
            </div>
          ) : (
            Object.entries(programMap).map(([progName, data]) => {
              const maxComm = Math.max(...Object.values(programMap).map((d) => d.commission), 1);
              const barPercent = Math.round((data.commission / maxComm) * 100);

              return (
                <div key={progName} className="p-3 rounded-xl bg-[#F8F9F8] border border-gray-200 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-gray-900 text-sm">{progName}</span>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-gray-500">{data.count} enrollments</span>
                      <span className="text-gray-700">Rev: ₹{data.revenue.toLocaleString("en-IN")}</span>
                      <span className="font-bold text-[#0F5132]">Earned: ₹{data.commission.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#0F5132] h-full rounded-full transition-all duration-500"
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
