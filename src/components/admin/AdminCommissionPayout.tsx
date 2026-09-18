import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  ArrowRight,
  ShieldAlert,
  Search,
  Check,
  Send,
} from "lucide-react";
import { Commission, CommissionStatus } from "../../types";

export const AdminCommissionPayout: React.FC = () => {
  const {
    commissions,
    partners,
    approveCommission,
    markCommissionPayable,
    reverseCommission,
    createPayoutBatch,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Reversal Modal
  const [reversalTarget, setReversalTarget] = useState<Commission | null>(null);
  const [reversalReason, setReversalReason] = useState("");

  // Payout Batch Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchNotes, setBatchNotes] = useState("");

  // Filtered commissions
  const filteredCommissions = commissions.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matches =
      c.clientName.toLowerCase().includes(q) ||
      c.partnerName.toLowerCase().includes(q) ||
      c.productName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);

    if (!matches) return false;
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = commissions.filter((c) => c.status === "PENDING").length;
  const approvedCount = commissions.filter((c) => c.status === "APPROVED").length;
  const payableCommissions = commissions.filter((c) => c.status === "PAYABLE");
  const payableAmount = payableCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);

  const handleExecuteBatchPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const payableIds = payableCommissions.map((c) => c.id);
    if (payableIds.length === 0) return;

    createPayoutBatch(payableIds, batchNotes || "Weekly P2IP Partner Settlement Run");
    setIsBatchModalOpen(false);
    setBatchNotes("");
  };

  const handleExecuteReversal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalTarget || !reversalReason.trim()) return;

    reverseCommission(reversalTarget.id, reversalReason);
    setReversalTarget(null);
    setReversalReason("");
  };

  const exportPayoutCSV = () => {
    const headers =
      "Commission ID,Partner ID,Partner Name,Bank Name,UPI ID,Account Number,IFSC Code,Amount,Client Name,Program\n";
    const rows = payableCommissions
      .map((c) => {
        const partner = partners.find((p) => p.id === c.partnerId);
        const bank = partner?.bankDetails;
        return `"${c.id}","${c.partnerId}","${c.partnerName}","${bank?.bankName || "HDFC Bank"}","${
          bank?.upiId || ""
        }","${bank?.accountNumber || ""}","${bank?.ifscCode || ""}",${c.commissionAmount},"${
          c.clientName
        }","${c.productName}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `P2IP_Bank_Settlement_Batch_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-commission-payout-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#0F5132]" />
            Commission Ledger & Payout Settlement Engine
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            50% revenue distribution pipeline, batch bank/UPI settlements, and audit-governed clawbacks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {payableCommissions.length > 0 && (
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              Execute Settlement Batch (₹{payableAmount.toFixed(2)})
            </button>
          )}

          <button
            onClick={exportPayoutCSV}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-gray-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0F5132]" />
            Export Bank CSV
          </button>
        </div>
      </div>

      {/* PIPELINE STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Pending Approval */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 block mb-1">
            Pending Review
          </span>
          <div className="text-2xl font-extrabold text-amber-700">{pendingCount}</div>
          <div className="text-[10px] text-gray-400 mt-1">Requires admin approval</div>
        </div>

        {/* Approved (In 7-day window) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 block mb-1">
            Approved (Window)
          </span>
          <div className="text-2xl font-extrabold text-blue-700">{approvedCount}</div>
          <div className="text-[10px] text-gray-400 mt-1">7-day satisfaction window</div>
        </div>

        {/* Payable Now */}
        <div className="bg-gradient-to-br from-[#0F5132] to-[#146c43] text-white p-4 rounded-2xl shadow-xs border border-[#D4AF37]/30">
          <span className="text-[11px] font-bold text-emerald-200 block mb-1">
            Payable in Current Batch
          </span>
          <div className="text-2xl font-black text-[#F5D77F]">
            ₹{payableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-100/80 mt-1">
            {payableCommissions.length} transactions ready for bank settlement
          </div>
        </div>

        {/* Lifetime Disbursed */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 block mb-1">
            Total Paid Disbursed
          </span>
          <div className="text-2xl font-extrabold text-gray-900">
            ₹
            {commissions
              .filter((c) => c.status === "PAID")
              .reduce((sum, c) => sum + c.commissionAmount, 0)
              .toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
            NEFT / IMPS / UPI confirmed
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client, partner, program, or commission ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs overflow-x-auto">
          {["ALL", "PENDING", "APPROVED", "PAYABLE", "PAID", "REVERSED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-[#0F5132] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* MASTER COMMISSIONS LEDGER TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F8] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Client / Program</th>
                <th className="py-3 px-4 text-right">Collected Rev</th>
                <th className="py-3 px-4 text-right">Commission Share</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Pipeline Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredCommissions.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#0F5132]">
                    {c.id}
                    <span className="block text-[10px] text-gray-400 font-normal">
                      {c.createdAt.slice(0, 10)}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{c.partnerName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{c.partnerId}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800">{c.clientName}</div>
                    <div className="text-[11px] text-gray-500">{c.productName}</div>
                  </td>

                  <td className="py-3 px-4 text-right font-medium">
                    {c.collectedRevenue > 0 ? `₹${c.collectedRevenue.toLocaleString("en-IN")}` : "Free"}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span
                      className={`font-black ${
                        c.status === "REVERSED"
                          ? "text-red-500 line-through"
                          : "text-[#0F5132]"
                      }`}
                    >
                      ₹{c.commissionAmount.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      {c.commissionPercentage > 0 ? `${c.commissionPercentage}%` : "Fixed Reward"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === "PAID"
                          ? "bg-[#0F5132] text-white"
                          : c.status === "PAYABLE"
                          ? "bg-emerald-100 text-[#0F5132] border border-emerald-300"
                          : c.status === "APPROVED"
                          ? "bg-blue-100 text-blue-800"
                          : c.status === "REVERSED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                    {c.reversalReason && (
                      <span className="block text-[9px] text-red-600 truncate max-w-[120px] mx-auto mt-0.5" title={c.reversalReason}>
                        {c.reversalReason}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.status === "PENDING" && (
                        <button
                          onClick={() => approveCommission(c.id)}
                          className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded font-semibold text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {c.status === "APPROVED" && (
                        <button
                          onClick={() => markCommissionPayable(c.id)}
                          className="px-2 py-1 bg-emerald-50 text-[#0F5132] hover:bg-emerald-100 border border-emerald-300 rounded font-semibold text-[10px] cursor-pointer"
                        >
                          Make Payable
                        </button>
                      )}

                      {c.status !== "REVERSED" && c.status !== "PAID" && (
                        <button
                          onClick={() => setReversalTarget(c)}
                          className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded font-semibold text-[10px] cursor-pointer"
                        >
                          Clawback / Reverse
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: BATCH PAYOUT EXECUTION */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#0F5132]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0F5132]" />
                Execute Settlement Batch
              </h3>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteBatchPayout} className="space-y-3">
              <div className="p-4 bg-[#FDF8EB] border border-[#D4AF37]/40 rounded-xl space-y-2 text-[#8B6508]">
                <div className="flex justify-between font-bold text-sm">
                  <span>Total Payable Amount:</span>
                  <span>₹{payableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="text-[11px]">
                  Total Commission Items: <strong>{payableCommissions.length}</strong>
                </div>
                <div className="text-[10px] text-gray-500">
                  Executing this batch marks items as PAID, issues unique transaction UTR reference codes, and notifies all partners.
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Batch Description / Internal Reference
                </label>
                <input
                  type="text"
                  required
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="e.g. HDFC NEFT Settlement Batch #04"
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Disburse & Mark as Settled
                </button>
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COMMISSION REVERSAL / REFUND CLAWBACK */}
      {reversalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-red-300 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3 text-red-900">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Commission Reversal / Clawback
              </h3>
              <button
                onClick={() => setReversalTarget(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteReversal} className="space-y-3">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 space-y-1">
                <div className="font-bold">Transaction: {reversalTarget.id}</div>
                <div>Client: {reversalTarget.clientName}</div>
                <div>
                  Commission to Claw Back: <strong>₹{reversalTarget.commissionAmount.toFixed(2)}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Reason for Clawback / Reversal
                </label>
                <select
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white mb-2"
                >
                  <option value="">-- Select Reason --</option>
                  <option value="Customer exercised 7-day money-back guarantee">
                    7-Day Money-Back Guarantee Refund
                  </option>
                  <option value="Client chargeback / disputed transaction">
                    Chargeback / Dispute
                  </option>
                  <option value="Fraudulent or self-referral detected">
                    Policy Violation (Self-referral)
                  </option>
                  <option value="Attribution reassigned by administrative review">
                    Attribution Reassignment
                  </option>
                </select>

                <textarea
                  rows={2}
                  placeholder="Or enter specific notes..."
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!reversalReason.trim()}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
                >
                  Confirm Reversal & Clawback
                </button>
                <button
                  type="button"
                  onClick={() => setReversalTarget(null)}
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
