import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Filter,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
  PlusCircle,
  CreditCard,
  Zap,
  Check,
  X,
  ArrowRight,
  RefreshCw,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { CommissionStatus, PayoutRecord } from "../../types";

export const PartnerWalletView: React.FC = () => {
  const {
    currentPartner,
    commissions,
    payouts,
    currentRole,
    updatePartnerBankDetails,
    requestRazorpayPayout,
    addTestPayableCommission,
  } = useApp();

  const [activeLedgerTab, setActiveLedgerTab] = useState<"commissions" | "payouts">("commissions");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Bank Account Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankSuccessMsg, setBankSuccessMsg] = useState<string | null>(null);
  const [bankForm, setBankForm] = useState({
    accountHolderName:
      currentPartner.bankDetails?.accountName || currentPartner.name || "",
    bankName: currentPartner.bankDetails?.bankName || "",
    accountNumber: currentPartner.bankDetails?.accountNumber || "",
    confirmAccountNumber: currentPartner.bankDetails?.accountNumber || "",
    ifscCode: currentPartner.bankDetails?.ifscCode || "",
    accountType: (currentPartner.bankDetails?.accountType || "SAVINGS") as "SAVINGS" | "CURRENT",
    upiId: currentPartner.bankDetails?.upiId || "",
    razorpayId: currentPartner.bankDetails?.razorpayId || "",
  });

  // Razorpay Payout Modal State
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutRazorpayId, setPayoutRazorpayId] = useState<string>(
    currentPartner.bankDetails?.razorpayId || `rzp_${currentPartner.code.toLowerCase()}_01`
  );
  const [payoutUpiId, setPayoutUpiId] = useState<string>(
    currentPartner.bankDetails?.upiId || ""
  );
  const [payoutProcessing, setPayoutProcessing] = useState(false);
  const [payoutResult, setPayoutResult] = useState<{
    success: boolean;
    payout?: PayoutRecord;
    error?: string;
  } | null>(null);

  // Get partner's commissions
  const myCommissions = commissions.filter((c) =>
    currentRole === "admin" ? true : c.partnerId === currentPartner.id
  );

  // Get partner's payouts
  const myPayouts = payouts.filter((p) =>
    currentRole === "admin" ? true : p.partnerId === currentPartner.id
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
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Pending Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            Approved
          </span>
        );
      case "PAYABLE":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            Payable Now
          </span>
        );
      case "PAID":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F5132] text-white">
            Paid Out
          </span>
        );
      case "REVERSED":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
            Reversed (Refund)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">{status}</span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers =
      "Commission ID,Client Name,Program,Collected Revenue,Commission %,Earned Amount,Status,Date\n";
    const rows = filteredCommissions
      .map(
        (c) =>
          `"${c.id}","${c.clientName}","${c.productName}",${c.collectedRevenue},${
            c.commissionPercentage
          }%,${c.commissionAmount},"${c.status}","${c.createdAt.slice(0, 10)}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `P2IP_Earnings_Statement_${currentPartner.code}.csv`;
    a.click();
  };

  const handleBankFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankForm.accountNumber && bankForm.accountNumber !== bankForm.confirmAccountNumber) {
      alert("Bank Account numbers do not match. Please verify.");
      return;
    }

    updatePartnerBankDetails(currentPartner.id, {
      accountName: bankForm.accountHolderName.trim(),
      bankName: bankForm.bankName.trim(),
      accountNumber: bankForm.accountNumber.trim(),
      ifscCode: bankForm.ifscCode.trim().toUpperCase(),
      accountType: bankForm.accountType,
      upiId: bankForm.upiId.trim(),
      razorpayId: bankForm.razorpayId.trim(),
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    });

    if (bankForm.razorpayId) {
      setPayoutRazorpayId(bankForm.razorpayId);
    }
    if (bankForm.upiId) {
      setPayoutUpiId(bankForm.upiId);
    }

    setBankSuccessMsg("Bank account, UPI ID, and Razorpay ID details saved and verified successfully!");
    setTimeout(() => {
      setBankSuccessMsg(null);
      setIsBankModalOpen(false);
    }, 1500);
  };

  const openPayoutModal = () => {
    setPayoutAmount(availableBalance);
    setPayoutRazorpayId(
      currentPartner.bankDetails?.razorpayId || `rzp_${currentPartner.code.toLowerCase()}_01`
    );
    setPayoutUpiId(currentPartner.bankDetails?.upiId || "");
    setPayoutResult(null);
    setIsPayoutModalOpen(true);
  };

  const handleTriggerDirectRazorpayPayout = () => {
    if (payoutAmount <= 0) {
      alert("No payable commission amount available to disburse.");
      return;
    }
    if (!payoutRazorpayId.trim()) {
      alert("Please enter your Razorpay ID to receive instant direct payout.");
      return;
    }

    setPayoutProcessing(true);
    setTimeout(() => {
      const res = requestRazorpayPayout(
        currentPartner.id,
        payoutAmount,
        payoutRazorpayId.trim(),
        payoutUpiId.trim() || undefined
      );
      setPayoutProcessing(false);
      setPayoutResult(res);
    }, 900);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="partner-wallet-view">
      {/* 1. Header & Actions */}
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Bank Account Option (Including UPI ID) */}
          <button
            id="add-bank-account-btn"
            onClick={() => setIsBankModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Building2 className="w-4 h-4 text-[#0F5132]" />
            <span>
              {currentPartner.bankDetails?.accountNumber || currentPartner.bankDetails?.upiId
                ? "Manage Bank & UPI Account"
                : "+ Add Bank Account & UPI"}
            </span>
          </button>

          {/* Button to Directly Get Payout Through Razorpay ID */}
          <button
            id="direct-razorpay-payout-btn"
            onClick={openPayoutModal}
            className="px-4 py-2 bg-gradient-to-r from-[#0F5132] via-[#125838] to-[#0F5132] hover:from-[#125838] hover:to-[#0F5132] text-white border border-[#D4AF37]/40 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <Zap className="w-4 h-4 text-[#F5D77F]" />
            <span>Direct Payout via Razorpay</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-gray-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0F5132]" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Bank Account Status Alert Banner */}
      {!currentPartner.bankDetails?.accountNumber && !currentPartner.bankDetails?.upiId && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong>Bank Account & UPI ID Needed:</strong> Add your Indian bank account or UPI ID
              to enable automated and direct payouts through Razorpay.
            </div>
          </div>
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="px-3 py-1.5 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-800 transition shrink-0 cursor-pointer"
          >
            Add Bank Account Now
          </button>
        </div>
      )}

      {/* 3. Wallet Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payable / Available Balance */}
        <div className="bg-gradient-to-br from-[#0F5132] to-[#146c43] text-white p-5 rounded-2xl shadow-sm border border-[#D4AF37]/30 flex flex-col justify-between">
          <div>
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
            <div className="text-[11px] text-emerald-100/90 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Ready for direct payout
            </div>
          </div>

          <div className="pt-3">
            <button
              id="wallet-card-razorpay-payout-btn"
              onClick={openPayoutModal}
              className="w-full py-2 bg-gradient-to-r from-[#D4AF37] to-[#e5be47] hover:from-[#c29e2f] hover:to-[#b59024] text-[#0F5132] font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#0F5132]" />
              <span>Get Payout via Razorpay ID</span>
            </button>
          </div>
        </div>

        {/* Pending Approval / Verification */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
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

          {availableBalance === 0 && (
            <div className="pt-3">
              <button
                onClick={() => addTestPayableCommission(currentPartner.id, 2500)}
                className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] border border-emerald-200 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                title="Add test verified commission to test Razorpay Payout"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Add ₹2,500 Test Commission</span>
              </button>
            </div>
          )}
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
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0F5132]" />
                Settlement Channel
              </div>
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="text-[11px] text-[#0F5132] font-bold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="text-xs font-bold text-gray-900 truncate">
              {currentPartner.bankDetails?.bankName || "No Bank Linked"}
            </div>
            <div className="text-[11px] font-mono text-gray-600 mt-0.5 truncate">
              UPI: {currentPartner.bankDetails?.upiId || "None"}
            </div>
            <div className="text-[11px] font-mono text-emerald-800 mt-0.5 truncate font-semibold">
              Razorpay: {currentPartner.bankDetails?.razorpayId || "Direct ID Ready"}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#0F5132]" />
            {currentPartner.bankDetails?.isVerified ? "KYC & Bank Verified" : "Direct Payout Ready"}
          </div>
        </div>
      </div>

      {/* 4. Ledger & Payout History Navigation */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Ledger Header & Tabs */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                id="tab-commission-ledger"
                onClick={() => setActiveLedgerTab("commissions")}
                className={`py-1.5 px-3 rounded-lg transition cursor-pointer ${
                  activeLedgerTab === "commissions"
                    ? "bg-white text-[#0F5132] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Commission Ledger ({filteredCommissions.length})
              </button>

              <button
                id="tab-payout-history"
                onClick={() => setActiveLedgerTab("payouts")}
                className={`py-1.5 px-3 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeLedgerTab === "payouts"
                    ? "bg-white text-[#0F5132] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Payout History ({myPayouts.length})
              </button>
            </div>
          </div>

          {activeLedgerTab === "commissions" && (
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
                    className={`py-1 px-2.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      statusFilter === s ? "bg-white text-[#0F5132] shadow-2xs font-bold" : "text-gray-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ledger Content: Tab 1 (Commissions) */}
        {activeLedgerTab === "commissions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" id="commissions-table">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
                  <th className="py-3 px-4">Ref / Commission ID</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Program / Vertical</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-right">Commission %</th>
                  <th className="py-3 px-4 text-right">Earned (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Wallet className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="font-semibold text-gray-600">No commission records found</p>
                        <p className="text-[11px]">
                          Refer clients using your personalized link to start accumulating verified
                          commissions.
                        </p>
                        <button
                          onClick={() => addTestPayableCommission(currentPartner.id, 2500)}
                          className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0F5132] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Add Test Payable Commission
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#0F5132]">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{item.clientName}</td>
                      <td className="py-3 px-4 text-gray-700 max-w-[200px] truncate">
                        {item.productName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-600">
                        ₹{item.collectedRevenue.toLocaleString("en-IN")}
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
        )}

        {/* Ledger Content: Tab 2 (Payout History & Razorpay Disbursals) */}
        {activeLedgerTab === "payouts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" id="payouts-history-table">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
                  <th className="py-3 px-4">Payout ID</th>
                  <th className="py-3 px-4">Amount Disbursed</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Razorpay / UTR Reference</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Zap className="w-8 h-8 text-amber-500 mx-auto" />
                        <p className="font-semibold text-gray-600">No payouts disbursed yet</p>
                        <p className="text-[11px]">
                          Click "Direct Payout via Razorpay" above to withdraw your payable balance
                          instantly.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  myPayouts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#0F5132]">{p.id}</td>
                      <td className="py-3 px-4 font-extrabold text-[#0F5132] text-sm">
                        ₹{p.paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          <Zap className="w-3 h-3 text-amber-600" />
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-700">
                        {p.transactionRef}
                        {p.notes && <div className="text-[10px] text-gray-400 font-sans">{p.notes}</div>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F5132] text-white">
                          Disbursed (Success)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500 whitespace-nowrap">
                        {new Date(p.payoutDate || Date.now()).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. ADD BANK ACCOUNT MODAL (All Options Including UPI ID) */}
      {isBankModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          id="bank-account-modal"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
            <div className="bg-gradient-to-r from-[#0F5132] to-[#146c43] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#F5D77F]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Add / Update Bank & UPI Account</h3>
                  <p className="text-xs text-emerald-100">
                    Supports all Indian banks, UPI IDs, and direct Razorpay handles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleBankFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {bankSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5132] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{bankSuccessMsg}</span>
                </div>
              )}

              {/* UPI ID Field (Prominent for easy instant transfer) */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#0F5132] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#0F5132]" />
                    UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                  </label>
                  <span className="text-[10px] bg-[#0F5132] text-white px-2 py-0.5 rounded-full font-bold">
                    Fastest
                  </span>
                </div>
                <input
                  id="bank-upi-id-input"
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                  value={bankForm.upiId}
                  onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                  className="w-full p-2.5 text-xs bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] font-mono font-medium"
                />
                <p className="text-[10px] text-gray-500">
                  Commissions can be sent directly to this UPI VPA without needing IFSC codes.
                </p>
              </div>

              {/* Razorpay ID Field */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    My Razorpay ID / Contact ID
                  </label>
                  <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Direct Payout
                  </span>
                </div>
                <input
                  id="bank-razorpay-id-input"
                  type="text"
                  placeholder="e.g. rzp_partner_01 or cont_ABCD123"
                  value={bankForm.razorpayId}
                  onChange={(e) => setBankForm({ ...bankForm, razorpayId: e.target.value })}
                  className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-600 font-mono font-medium"
                />
                <p className="text-[10px] text-gray-500">
                  Used by the "Direct Payout via Razorpay" button for immediate sub-minute transfer.
                </p>
              </div>

              {/* Bank Account Details */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Bank Account Information (NEFT / IMPS)
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Account Holder Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anita Sharma"
                    value={bankForm.accountHolderName}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, accountHolderName: e.target.value })
                    }
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC Bank, SBI, ICICI"
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      value={bankForm.accountType}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          accountType: e.target.value as "SAVINGS" | "CURRENT",
                        })
                      }
                      className="w-full p-2.5 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132]"
                    >
                      <option value="SAVINGS">Savings Account</option>
                      <option value="CURRENT">Current Account</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="5010049281920"
                      value={bankForm.accountNumber}
                      onChange={(e) =>
                        setBankForm({ ...bankForm, accountNumber: e.target.value })
                      }
                      className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="5010049281920"
                      value={bankForm.confirmAccountNumber}
                      onChange={(e) =>
                        setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })
                      }
                      className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC0001234"
                    value={bankForm.ifscCode}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })
                    }
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-bank-account-submit-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#125838] text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#F5D77F]" />
                  <span>Save & Verify Payout Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DIRECT PAYOUT VIA RAZORPAY ID MODAL */}
      {isPayoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          id="razorpay-direct-payout-modal"
        >
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
            <div className="bg-gradient-to-r from-[#0F5132] via-[#146c43] to-[#0F5132] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#F5D77F]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Instant Direct Razorpay Payout</h3>
                  <p className="text-xs text-emerald-100">Automated disbursal through RazorpayX</p>
                </div>
              </div>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {payoutResult ? (
                /* Success Receipt */
                <div className="space-y-4 py-2 text-center animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-gray-900">
                      ₹{(payoutResult.payout?.paidAmount ?? payoutAmount).toLocaleString("en-IN")} Disbursed!
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Direct payout completed through Razorpay Instant Disbursal Gateway
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction Ref:</span>
                      <span className="font-mono font-bold text-gray-900 truncate max-w-[180px]">
                        {payoutResult.payout?.transactionRef}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Credited To Razorpay ID:</span>
                      <span className="font-mono font-bold text-[#0F5132]">
                        {payoutRazorpayId}
                      </span>
                    </div>
                    {payoutUpiId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Linked UPI ID:</span>
                        <span className="font-mono font-bold text-gray-800">{payoutUpiId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transfer Mode:</span>
                      <span className="font-bold text-emerald-800">RazorpayX IMPS (Real-Time)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Settlement Fee:</span>
                      <span className="font-bold text-[#0F5132]">₹0.00 (Zero Fee)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsPayoutModalOpen(false);
                      setActiveLedgerTab("payouts");
                    }}
                    className="w-full py-3 bg-[#0F5132] hover:bg-[#125838] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
                  >
                    View in Payout History
                  </button>
                </div>
              ) : (
                /* Payout Confirmation Form */
                <div className="space-y-4">
                  {/* Amount Card */}
                  <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-gray-500 font-semibold">
                        Payable Commission Available:
                      </div>
                      <div className="text-2xl font-black text-[#0F5132]">
                        ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    {availableBalance === 0 && (
                      <button
                        onClick={() => {
                          addTestPayableCommission(currentPartner.id, 2500);
                          setPayoutAmount(2500);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-[#0F5132] font-bold text-[11px] hover:bg-emerald-200 cursor-pointer"
                      >
                        + Add ₹2,500 Test
                      </button>
                    )}
                  </div>

                  {/* Disburse Amount Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Withdrawal Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={availableBalance > 0 ? availableBalance : 100000}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(Number(e.target.value))}
                      className="w-full p-2.5 text-sm font-bold text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>

                  {/* Razorpay ID Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      My Razorpay ID / Virtual Contact <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Zap className="w-4 h-4 absolute left-3 top-3 text-amber-500" />
                      <input
                        id="payout-razorpay-id-field"
                        type="text"
                        required
                        placeholder="e.g. rzp_partner_01 or cont_ABC123"
                        value={payoutRazorpayId}
                        onChange={(e) => setPayoutRazorpayId(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-gray-900 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400">
                      Disbursed directly into your linked bank account or Razorpay dashboard.
                    </span>
                  </div>

                  {/* Optional UPI ID */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Linked UPI ID (Optional Backup)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. yourname@okhdfcbank"
                      value={payoutUpiId}
                      onChange={(e) => setPayoutUpiId(e.target.value)}
                      className="w-full p-2.5 text-xs font-mono text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>

                  {/* Summary Details */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1.5 text-gray-600">
                    <div className="flex justify-between">
                      <span>Gateway Provider:</span>
                      <strong className="text-gray-900">RazorpayX Disbursal API</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Speed:</span>
                      <strong className="text-emerald-700">Sub-minute Instant IMPS</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Disbursal Charges:</span>
                      <strong className="text-[#0F5132]">₹0.00 (Zero Deduction)</strong>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="confirm-razorpay-payout-btn"
                      onClick={handleTriggerDirectRazorpayPayout}
                      disabled={payoutProcessing || payoutAmount <= 0 || !payoutRazorpayId.trim()}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                        payoutProcessing || payoutAmount <= 0 || !payoutRazorpayId.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#0F5132] via-[#146c43] to-[#0F5132] text-white hover:shadow-lg active:scale-98"
                      }`}
                    >
                      {payoutProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#F5D77F]" />
                          <span>Processing Razorpay Payout...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-[#F5D77F]" />
                          <span>
                            Confirm & Disburse ₹{payoutAmount.toLocaleString("en-IN")} via Razorpay
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
