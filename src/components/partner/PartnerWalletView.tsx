import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Building2,
  QrCode,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import { CommissionStatus } from "../../types";

export const PartnerWalletView: React.FC = () => {
  const { currentPartner, commissions, payouts, currentRole } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Get partner's commissions
  const myCommissions = commissions.filter((c) =>
    currentRole === "admin" ? true : c.partnerId === currentPartner.id
  );

  // Financial summary calculations
  const availableBalance = myCommissions
    .filter((c) => c.status === "PAYABLE")
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const pendingApproval = myCommissions
    .filter((c) => c.status === "PENDING" || c.status === "APPROVED")
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const totalPaidOut = myCommissions
    .filter((c) => c.status === "PAID")
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const reversedTotal = myCommissions
    .filter((c) => c.status === "REVERSED")
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const lifetimeEarned = totalPaidOut + availableBalance + pendingApproval;

  // Filter commissions
  const filteredCommissions = myCommissions.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.clientName.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return c.status === statusFilter;
  });

  const getStatusBadge = (status: CommissionStatus) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Pending Review</span>;
      case "APPROVED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Approved</span>;
      case "PAYABLE":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">Payable in Next Batch</span>;
      case "PAID":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F5132] text-white">Paid Out</span>;
      case "REVERSED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">Reversed (Refund)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = "Commission ID,Client Name,Program,Collected Revenue,Commission %,Earned Amount,Status,Date\n";
    const rows = filteredCommissions
      .map(
        (c) =>
          `"${c.id}","${c.clientName}","${c.productName}",${c.collectedRevenue},${c.commissionPercentage}%,${c.commissionAmount},"${c.status}","${c.createdAt.slice(0, 10)}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `P2IP_Earnings_Statement_${currentPartner.code}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="partner-wallet-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#0F5132]" />
            Partner Wallet & Commission Ledger
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time financial transparency, verified payouts, and audit-ready transaction records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-gray-200 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#0F5132]" />
          Export Statement (CSV)
        </button>
      </div>

      {/* Wallet Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payable / Available Balance */}
        <div className="bg-gradient-to-br from-[#0F5132] to-[#146c43] text-white p-5 rounded-2xl shadow-sm border border-[#D4AF37]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
              Payable Balance
            </span>
            <span className="p-1.5 rounded-lg bg-white/10 text-[#D4AF37]">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5D77F]">
            ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-100/90 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            Verified & queued for next payout batch
          </div>
        </div>

        {/* Pending Approval / Verification */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2 text-gray-500">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Pending & Approved
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">
            ₹{pendingApproval.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            Under 7-day money-back validation window
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2 text-gray-500">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Lifetime Earnings
            </span>
            <span className="p-1.5 rounded-lg bg-[#E8F5E9] text-[#0F5132]">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            ₹{lifetimeEarned.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            Paid out: <strong className="text-gray-800">₹{totalPaidOut.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Payout Channel Info */}
        <div className="bg-[#F8F9F8] p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0F5132]" />
              Settlement Channel
            </div>
            <div className="text-xs font-bold text-gray-900">
              {currentPartner.bankDetails?.bankName || "HDFC Bank"}
            </div>
            <div className="text-xs font-mono text-gray-600 mt-0.5">
              UPI: {currentPartner.bankDetails?.upiId || "anita.sharma@okhdfcbank"}
            </div>
          </div>
          <div className="pt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#0F5132]" />
            KYC & Bank Verified
          </div>
        </div>
      </div>

      {/* Reversal notice if any reversals */}
      {reversedTotal > 0 && (
        <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl text-xs text-red-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Total Reversals: ₹{reversedTotal.toFixed(2)}</strong> — Result of verified client refunds processed within the 7-day satisfaction guarantee window.
            </span>
          </div>
        </div>
      )}

      {/* Transaction Ledger Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Ledger Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Commission Ledger</h3>
            <span className="text-xs text-gray-500">
              ({filteredCommissions.length} transactions)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#0F5132]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-xs">
              {["ALL", "PAYABLE", "APPROVED", "PAID", "REVERSED"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    statusFilter === s
                      ? "bg-white text-[#0F5132] shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F8] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Client / Source</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4 text-right">Collected Revenue</th>
                <th className="py-3 px-4 text-right">Rate</th>
                <th className="py-3 px-4 text-right">Commission Earned</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No transactions found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredCommissions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#0F5132]">
                      {item.id}
                      {item.isInnerCircleCredit && (
                        <span className="block text-[9px] text-purple-600 font-semibold font-sans">
                          Inner Circle Loop
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {item.clientName}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {item.productName}
                    </td>

                    <td className="py-3 px-4 text-right font-medium">
                      {item.collectedRevenue > 0
                        ? `₹${item.collectedRevenue.toLocaleString("en-IN")}`
                        : "₹0 (Free Challenge)"}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-gray-600">
                      {item.commissionPercentage > 0 ? `${item.commissionPercentage}%` : "Fixed"}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-extrabold ${
                          item.status === "REVERSED"
                            ? "text-red-600 line-through"
                            : "text-[#0F5132]"
                        }`}
                      >
                        ₹{item.commissionAmount.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(item.status)}
                      {item.status === "REVERSED" && item.reversalReason && (
                        <span className="block text-[9px] text-red-500 max-w-[140px] truncate mx-auto mt-0.5" title={item.reversalReason}>
                          {item.reversalReason}
                        </span>
                      )}
                      {item.payoutRefNumber && (
                        <span className="block text-[9px] font-mono text-gray-400 mt-0.5">
                          {item.payoutRefNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
