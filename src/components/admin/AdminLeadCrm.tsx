import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Check,
  Shield,
  Clock,
  Sparkles,
  ChevronDown,
  X,
  RefreshCw,
} from "lucide-react";
import { Lead, ReferralStatus, AttributionDecision } from "../../types";

export const AdminLeadCrm: React.FC = () => {
  const {
    leads,
    partners,
    products,
    updateLeadStatus,
    resolveDuplicateAttribution,
    logCustomerPayment,
    refreshData,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("ALL");
  const [programFilter, setProgramFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [attributionFilter, setAttributionFilter] = useState("ALL");

  // Selected lead for duplicate resolution
  const [duplicateReviewLead, setDuplicateReviewLead] = useState<Lead | null>(null);
  const [decisionChoice, setDecisionChoice] = useState<AttributionDecision>("FIRST_PARTNER");
  const [decisionNotes, setDecisionNotes] = useState("");

  // Selected lead for payment logger
  const [paymentLead, setPaymentLead] = useState<Lead | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(499);
  const [paymentProductId, setPaymentProductId] = useState("prod-mind-mastery");

  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.clientName.toLowerCase().includes(q) ||
      l.mobile.includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      l.partnerName.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (partnerFilter !== "ALL" && l.partnerId !== partnerFilter) return false;
    if (programFilter !== "ALL" && l.interestedProgramId !== programFilter) return false;
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    if (attributionFilter !== "ALL" && l.attributionStatus !== attributionFilter) return false;
    return true;
  });

  const duplicateFlaggedCount = leads.filter(
    (l) => l.attributionStatus === "DUPLICATE_FLAGGED"
  ).length;

  const handleResolveDuplicate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duplicateReviewLead) return;
    resolveDuplicateAttribution(duplicateReviewLead.id, decisionChoice, decisionNotes);
    setDuplicateReviewLead(null);
    setDecisionNotes("");
  };

  const handleLogPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentLead) return;
    logCustomerPayment(paymentLead.id, paymentAmount, paymentProductId);
    setPaymentLead(null);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-lead-crm-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0F5132]" />
            Central Lead CRM & Attribution Engine
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational pipeline tracking, duplicate resolution, counselor assignments, and commission reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="Sync all client leads directly from SQLite database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0F5132] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync DB"}</span>
          </button>

          {duplicateFlaggedCount > 0 && (
            <button
              onClick={() => setAttributionFilter("DUPLICATE_FLAGGED")}
              className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition hover:bg-amber-200 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>{duplicateFlaggedCount} Attribution Review Needed</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, mobile, email, ID, or partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
            />
          </div>

          {/* Partner Selector */}
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white text-gray-800"
          >
            <option value="ALL">All Partners ({partners.length})</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.partnerType})
              </option>
            ))}
          </select>

          {/* Program Selector */}
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white text-gray-800"
          >
            <option value="ALL">All Programs</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white text-gray-800"
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="REGISTERED">Registered</option>
            <option value="CHALLENGE_ATTENDED">Challenge Attended</option>
            <option value="CHALLENGE_COMPLETED">Challenge Completed</option>
            <option value="PAID_CUSTOMER">Paid Customer</option>
            <option value="RENEWAL">Renewal</option>
            <option value="LOST">Lost</option>
          </select>

          {/* Attribution Status */}
          <select
            value={attributionFilter}
            onChange={(e) => setAttributionFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white text-gray-800"
          >
            <option value="ALL">All Attribution States</option>
            <option value="NORMAL">Normal</option>
            <option value="DUPLICATE_FLAGGED">Duplicate Flagged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* CRM Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F8] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Lead ID / Date</th>
                <th className="py-3 px-4">Client Contact</th>
                <th className="py-3 px-4">Attributed Partner</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4 text-center">Lifecycle Stage</th>
                <th className="py-3 px-4 text-center">Attribution</th>
                <th className="py-3 px-4 text-right">Paid / Commission</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No leads matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-gray-50 transition ${
                      lead.attributionStatus === "DUPLICATE_FLAGGED" ? "bg-amber-50/30" : ""
                    }`}
                  >
                    {/* Lead ID & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#0F5132] block">
                        {lead.id}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Client Name & Contact */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{lead.clientName}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" />
                        {lead.mobile}
                      </div>
                      {lead.email && (
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" />
                          {lead.email}
                        </div>
                      )}
                    </td>

                    {/* Attributed Partner */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800">{lead.partnerName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{lead.partnerId}</div>
                      {lead.referringClientId && (
                        <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-semibold mt-0.5 inline-block">
                          Inner Circle Loop
                        </span>
                      )}
                    </td>

                    {/* Interested Program */}
                    <td className="py-3 px-4 font-medium text-gray-700 max-w-[150px] truncate">
                      {lead.interestedProgramName}
                    </td>

                    {/* Stage Selector */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLeadStatus(lead.id, e.target.value as ReferralStatus)
                        }
                        className="text-[11px] font-semibold border border-gray-200 rounded-lg p-1 bg-white cursor-pointer"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="REGISTERED">Registered</option>
                        <option value="CHALLENGE_ATTENDED">Challenge Attended (₹49)</option>
                        <option value="CHALLENGE_COMPLETED">Challenge Completed (₹49)</option>
                        <option value="PAID_CUSTOMER">Paid Customer</option>
                        <option value="RENEWAL">Renewal</option>
                        <option value="LOST">Lost</option>
                      </select>
                    </td>

                    {/* Attribution State */}
                    <td className="py-3 px-4 text-center">
                      {lead.attributionStatus === "DUPLICATE_FLAGGED" ? (
                        <button
                          onClick={() => setDuplicateReviewLead(lead)}
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg text-[10px] transition flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Review Conflict
                        </button>
                      ) : lead.attributionStatus === "RESOLVED" ? (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-semibold">
                          Resolved: {lead.duplicateInfo?.adminDecision}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-[#0F5132] rounded text-[10px] font-semibold">
                          Attributed
                        </span>
                      )}
                    </td>

                    {/* Paid Amount / Commission */}
                    <td className="py-3 px-4 text-right">
                      {lead.paidAmount && lead.paidAmount > 0 ? (
                        <div>
                          <span className="font-bold text-gray-900 block">
                            ₹{lead.paidAmount.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-[#0F5132] font-semibold">
                            Comm: ₹{lead.commissionEarned?.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {lead.status !== "PAID_CUSTOMER" && (
                        <button
                          onClick={() => {
                            setPaymentLead(lead);
                            setPaymentProductId(
                              lead.interestedProgramId !== "prod-free-reset"
                                ? lead.interestedProgramId
                                : "prod-mind-mastery"
                            );
                          }}
                          className="px-2.5 py-1 bg-[#FDF8EB] hover:bg-[#F9ECC6] text-[#8B6508] border border-[#D4AF37]/40 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <CreditCard className="w-3 h-3 text-[#B48220]" />
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DUPLICATE ATTRIBUTION RESOLUTION MODAL */}
      {duplicateReviewLead && duplicateReviewLead.duplicateInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-amber-300 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3 text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-extrabold">Duplicate Lead Attribution Review</h3>
              </div>
              <button
                onClick={() => setDuplicateReviewLead(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950 space-y-1">
              <p>
                Lead <strong>{duplicateReviewLead.clientName}</strong> matched an existing contact by{" "}
                <strong>{duplicateReviewLead.duplicateInfo.matchedField.toUpperCase()}</strong>:
              </p>
              <div className="font-mono text-[11px] text-amber-800">
                Matched Value: {duplicateReviewLead.mobile} / {duplicateReviewLead.email}
              </div>
            </div>

            {/* Timeline Comparison */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 border rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">
                  Original Attributed Lead
                </span>
                <div className="font-bold text-gray-900">
                  {duplicateReviewLead.duplicateInfo.existingLeadId}
                </div>
                <div className="text-gray-700">
                  Partner: <strong>{duplicateReviewLead.duplicateInfo.originalPartnerName}</strong>
                </div>
                <div className="text-[10px] text-gray-400">
                  Date: {duplicateReviewLead.duplicateInfo.originalReferralDate}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase block">
                  New Duplicate Submission
                </span>
                <div className="font-bold text-blue-950">{duplicateReviewLead.id}</div>
                <div className="text-blue-900">
                  Partner: <strong>{duplicateReviewLead.duplicateInfo.newPartnerName}</strong>
                </div>
                <div className="text-[10px] text-blue-700">
                  Date: {duplicateReviewLead.createdAt.slice(0, 10)}
                </div>
              </div>
            </div>

            <form onSubmit={handleResolveDuplicate} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Select Attribution Decision
                </label>
                <select
                  value={decisionChoice}
                  onChange={(e) => setDecisionChoice(e.target.value as AttributionDecision)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-[#F8F9F8] font-semibold text-gray-800"
                >
                  <option value="FIRST_PARTNER">
                    1. First Partner Attribution (Original partner retains credit)
                  </option>
                  <option value="LAST_PARTNER">
                    2. Last Partner Attribution (Re-attribute to new submitting partner)
                  </option>
                  <option value="EXISTING_CUSTOMER">
                    3. Existing Client / Organic (No partner commission credited)
                  </option>
                  <option value="SPLIT">
                    4. Split Attribution (Shared credit between both partners)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Decision Notes / Reason (Logged to Audit Trail)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Client verified previous participation in 2025; first partner holds 1-year referral protection..."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Confirm & Resolve Attribution
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateReviewLead(null)}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN LOG CUSTOMER PAYMENT MODAL */}
      {paymentLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#0F5132]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0F5132]" />
                Record Customer Payment & Revenue Share
              </h3>
              <button
                onClick={() => setPaymentLead(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogPaymentSubmit} className="space-y-3">
              <div className="p-3 bg-[#F8F9F8] rounded-xl border space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Client:</span>
                  <strong>{paymentLead.clientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Attributed Partner:</span>
                  <strong className="text-[#0F5132]">{paymentLead.partnerName}</strong>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Enrolled Program</label>
                <select
                  value={paymentProductId}
                  onChange={(e) => {
                    const sel = products.find((p) => p.id === e.target.value);
                    setPaymentProductId(e.target.value);
                    if (sel && sel.price > 0) setPaymentAmount(sel.price);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                >
                  {products
                    .filter((p) => p.price > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Actual Collected Revenue (₹)
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-[#FDF8EB] border border-[#D4AF37]/40 rounded-xl text-[#8B6508]">
                <div className="flex justify-between font-bold">
                  <span>Calculated Partner Share (50%):</span>
                  <span>₹{(paymentAmount * 0.5).toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Generates an approved commission entry in the partner's wallet.
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Record Payment & Generate Commission
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentLead(null)}
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
