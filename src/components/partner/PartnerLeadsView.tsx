import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronDown,
  MessageSquare,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { ReferralStatus } from "../../types";

export const PartnerLeadsView: React.FC = () => {
  const {
    currentPartner,
    leads,
    products,
    setIsQuickReferOpen,
    updateLeadStatus,
    logCustomerPayment,
    currentRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(499);
  const [paymentProductId, setPaymentProductId] = useState<string>("prod-mind-mastery");

  // Leads for the current partner (or all if admin viewing leads in this tab)
  const myLeads = leads.filter((l) =>
    currentRole === "admin" ? true : l.partnerId === currentPartner.id
  );

  const filteredLeads = myLeads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      l.clientName.toLowerCase().includes(q) ||
      l.mobile.includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      l.interestedProgramName.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (statusFilter === "ALL") return true;
    if (statusFilter === "DUPLICATE") return l.attributionStatus === "DUPLICATE_FLAGGED";
    return l.status === statusFilter;
  });

  const getStatusBadge = (status: ReferralStatus, attributionStatus: string) => {
    if (attributionStatus === "DUPLICATE_FLAGGED") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Duplicate Flagged • Under Review
        </span>
      );
    }

    switch (status) {
      case "NEW":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">New Referral</span>;
      case "CONTACTED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Contacted</span>;
      case "REGISTERED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">Challenge Registered</span>;
      case "CHALLENGE_ATTENDED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">Challenge Attended (₹49)</span>;
      case "CHALLENGE_COMPLETED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-[#0F5132] border border-emerald-300 font-semibold">Challenge Completed (₹49)</span>;
      case "PAID_CUSTOMER":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#8B6508] border border-[#D4AF37]/50 font-bold">Paid Customer (50% Share)</span>;
      case "RENEWAL":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Active Renewal</span>;
      case "LOST":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">Lost</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForPayment) return;
    logCustomerPayment(selectedLeadForPayment, paymentAmount, paymentProductId);
    setSelectedLeadForPayment(null);
  };

  return (
    <div className="space-y-5 animate-fade-in" id="partner-leads-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0F5132]" />
            Referrals & Leads Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent tracking of your referred community from registration to program enrollment
          </p>
        </div>

        <button
          onClick={() => setIsQuickReferOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#0F5132] to-[#146c43] text-white rounded-xl text-xs font-bold shadow hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30 shrink-0"
        >
          <UserPlus className="w-4 h-4 text-[#D4AF37]" />
          + Add New Referral
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name, mobile, email, or Referral ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          {[
            { id: "ALL", label: `All (${myLeads.length})` },
            { id: "NEW", label: "New" },
            { id: "REGISTERED", label: "Registered" },
            { id: "CHALLENGE_ATTENDED", label: "Attended" },
            { id: "CHALLENGE_COMPLETED", label: "Completed" },
            { id: "PAID_CUSTOMER", label: "Paid Customer" },
            { id: "DUPLICATE", label: "Duplicate Flagged" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Cards / Table List */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 text-xs">
            No referrals matching the current filters.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs transition hover:shadow-sm ${
                lead.attributionStatus === "DUPLICATE_FLAGGED"
                  ? "border-amber-300 bg-amber-50/20"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Client Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#0F5132] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#0F5132]/20">
                      {lead.id}
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-900">{lead.clientName}</h3>
                    {getStatusBadge(lead.status, lead.attributionStatus)}

                    {lead.referringClientId && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <Share2 className="w-2.5 h-2.5" />
                        Inner Circle Invite
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-mono">{lead.mobile}</span>
                    </div>

                    {lead.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{lead.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{lead.location}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Referred: {new Date(lead.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Program & Notes */}
                  <div className="text-xs text-gray-700 bg-[#F8F9F8] p-2.5 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-gray-500 mr-1">Program:</span>
                      <strong className="text-gray-900">{lead.interestedProgramName}</strong>
                      {lead.notes && (
                        <span className="text-gray-600 block sm:inline sm:ml-2 italic text-[11px]">
                          "{lead.notes}"
                        </span>
                      )}
                    </div>

                    {lead.commissionEarned && lead.commissionEarned > 0 && (
                      <div className="text-[#8B6508] font-bold text-xs shrink-0 flex items-center gap-1 bg-[#D4AF37]/15 px-2 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3 text-[#B48220]" />
                        Commission: ₹{lead.commissionEarned.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Duplicate warning box if flagged */}
                  {lead.attributionStatus === "DUPLICATE_FLAGGED" && lead.duplicateInfo && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Attribution Conflict Detected:</strong> Matched existing lead {lead.duplicateInfo.existingLeadId} originally referred by {lead.duplicateInfo.originalPartnerName}. Admin review in progress to ensure proper attribution.
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions & Lifecycle Controller */}
                <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  {/* WhatsApp Direct Action */}
                  <a
                    href={`https://api.whatsapp.com/send?phone=${lead.mobile.replace(
                      /[^0-9]/g,
                      ""
                    )}&text=${encodeURIComponent(
                      `Hi ${lead.clientName}! 🌿 Following up on your Path to Inner Peace interest for the ${lead.interestedProgramName}. Are you free for a brief call?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#1EBE5D] transition flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp Client
                  </a>

                  {/* Advance Stage Dropdown (Simulate lifecycle progression) */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-500 font-medium text-[11px]">Stage:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as ReferralStatus)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold bg-white text-gray-800 cursor-pointer"
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
                  </div>

                  {/* Log Paid Enrollment Button */}
                  {lead.status !== "PAID_CUSTOMER" && (
                    <button
                      onClick={() => {
                        setSelectedLeadForPayment(lead.id);
                        setPaymentProductId(
                          lead.interestedProgramId !== "prod-free-reset"
                            ? lead.interestedProgramId
                            : "prod-mind-mastery"
                        );
                      }}
                      className="px-2.5 py-1 bg-[#FDF8EB] hover:bg-[#F9ECC6] text-[#8B6508] border border-[#D4AF37]/50 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Simulate enrollment payment and 50% commission calculation"
                    >
                      <CreditCard className="w-3 h-3 text-[#B48220]" />
                      Log Paid Enrollment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Log Customer Payment & Commission */}
      {selectedLeadForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-[#0F5132]/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0F5132]" />
                Log Paid Customer Enrollment
              </h3>
              <button
                onClick={() => setSelectedLeadForPayment(null)}
                className="text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <p className="text-gray-600">
                Recording this payment marks the client as a Paid Customer and immediately generates a 50% revenue commission entry into your Partner Wallet.
              </p>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Program</label>
                <select
                  value={paymentProductId}
                  onChange={(e) => {
                    const sel = products.find((p) => p.id === e.target.value);
                    setPaymentProductId(e.target.value);
                    if (sel && sel.price > 0) setPaymentAmount(sel.price);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-[#F8F9F8]"
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
                  <span>Calculated Partner Commission (50%):</span>
                  <span>₹{(paymentAmount * 0.5).toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Based on Path to Inner Peace default 50% revenue share terms.
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Confirm & Credit Commission
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForPayment(null)}
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
