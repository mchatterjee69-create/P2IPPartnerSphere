import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  P2IP_PARTNERSPHERE_HEADER,
  P2IP_PARTNERSPHERE_CLAUSES,
  P2IP_CAMPAIGN_COMMISSION_RULES,
  P2IP_MANDATORY_DISCLOSURES,
  P2IP_ACKNOWLEDGEMENT_CHECKBOXES,
  P2IP_PARTNERSPHERE_FULL_TEXT,
} from "../../data/partnerTermsData";
import {
  X,
  ShieldCheck,
  Check,
  FileText,
  Search,
  BookOpen,
  Scale,
  DollarSign,
  Share2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Copy,
} from "lucide-react";

export const TermsModal: React.FC = () => {
  const {
    isTermsOpen,
    setIsTermsOpen,
    businessRules,
    currentPartner,
    acceptPartnerTerms,
    currentRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"CLAUSES" | "COMMISSIONS" | "DISCLOSURES" | "RAW_TEXT">("CLAUSES");
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({
    "clause-1": true,
    "clause-2": true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isTermsOpen) return null;

  const toggleClause = (id: string) => {
    setExpandedClauses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    P2IP_PARTNERSPHERE_CLAUSES.forEach((c) => (all[c.id] = true));
    setExpandedClauses(all);
  };

  const collapseAll = () => {
    setExpandedClauses({});
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredClauses = P2IP_PARTNERSPHERE_CLAUSES.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.fullText.toLowerCase().includes(q) ||
      c.badge.toLowerCase().includes(q) ||
      String(c.clauseNumber).includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in" id="terms-modal-overlay">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#0F5132]/30 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]" id="terms-modal-container">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B3D26] via-[#0F5132] to-[#146c43] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4AF37]/50 flex items-center justify-center text-[#F5D77F] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#F5D77F] bg-black/30 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  {P2IP_PARTNERSPHERE_HEADER.title}
                </span>
                <span className="text-[11px] text-emerald-200 hidden sm:inline-block">
                  • {P2IP_PARTNERSPHERE_HEADER.tagline}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-wide mt-0.5">
                {P2IP_PARTNERSPHERE_HEADER.subtitle}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {P2IP_PARTNERSPHERE_HEADER.organisation} • Program: {P2IP_PARTNERSPHERE_HEADER.program}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTermsOpen(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Advisory Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-xs text-amber-950 shrink-0">
          <Scale className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="text-[11px]">
            <strong>Statutory Legal Notice:</strong> Before making this legally binding, have an Indian lawyer review the final version—especially the commission, privacy/data, refund, termination, and dispute-resolution clauses.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-xs flex-wrap">
            <button
              onClick={() => setActiveTab("CLAUSES")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "CLAUSES"
                  ? "bg-[#0F5132] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Expandable T&C (23 Clauses)</span>
            </button>
            <button
              onClick={() => setActiveTab("COMMISSIONS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "COMMISSIONS"
                  ? "bg-[#0F5132] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Campaign Commission Rules</span>
            </button>
            <button
              onClick={() => setActiveTab("DISCLOSURES")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "DISCLOSURES"
                  ? "bg-[#0F5132] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Disclosures</span>
            </button>
            <button
              onClick={() => setActiveTab("RAW_TEXT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "RAW_TEXT"
                  ? "bg-[#0F5132] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Plain Text</span>
            </button>
          </div>

          {activeTab === "CLAUSES" && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 23 clauses..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132] w-36 sm:w-48"
                />
              </div>
              <button
                type="button"
                onClick={expandAll}
                className="px-2 py-1 text-[11px] font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg cursor-pointer"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-2 py-1 text-[11px] font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg cursor-pointer"
              >
                Collapse
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-gray-700 bg-[#FCFDFD]">
          {activeTab === "CLAUSES" && (
            <div className="space-y-2.5">
              {filteredClauses.map((clause) => {
                const isExpanded = !!expandedClauses[clause.id];
                return (
                  <div
                    key={clause.id}
                    className={`rounded-xl border transition duration-150 overflow-hidden bg-white ${
                      isExpanded
                        ? "border-[#0F5132]/50 shadow-sm ring-1 ring-[#0F5132]/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleClause(clause.id)}
                      className="w-full text-left p-3 flex items-start justify-between gap-3 hover:bg-gray-50/70 transition cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#0F5132] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                          {clause.clauseNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                              {clause.title}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {clause.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                            {clause.summary}
                          </p>
                        </div>
                      </div>

                      <div className="text-gray-400 shrink-0 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-3.5 pt-1 text-xs text-gray-700 border-t border-gray-100 bg-[#FAFBFB] space-y-2">
                        <p className="font-sans leading-relaxed text-gray-800 text-[11.5px] bg-white p-3 rounded-lg border border-gray-100">
                          {clause.fullText}
                        </p>
                        {clause.bulletPoints && clause.bulletPoints.length > 0 && (
                          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-[11px] text-amber-950 space-y-1">
                            <strong className="block text-[10.5px] uppercase tracking-wider text-amber-900">
                              Specified Provisions:
                            </strong>
                            <ul className="list-disc list-inside space-y-1 pl-1">
                              {clause.bulletPoints.map((bp, i) => (
                                <li key={i}>{bp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Acknowledgement clause preview */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl mt-4">
                <h4 className="font-extrabold text-xs text-[#0F5132] mb-1">
                  24. Acknowledgement (Mandatory 10 Affirmations)
                </h4>
                <p className="text-[11px] text-gray-600 mb-2">
                  All partners must explicitly agree to the 10 statutory affirmations before access is unlocked.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {P2IP_ACKNOWLEDGEMENT_CHECKBOXES.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-emerald-100 text-gray-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "COMMISSIONS" && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h4 className="font-extrabold text-sm text-[#0F5132]">
                  Active Campaign Commission Rules & Refund Cooling Windows
                </h4>
                <span className="text-[11px] font-bold bg-[#0F5132] text-[#F5D77F] px-2.5 py-0.5 rounded-lg">
                  Tiered 20% - 35%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {P2IP_CAMPAIGN_COMMISSION_RULES.map((camp) => (
                  <div key={camp.id} className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2.5 shadow-xs">
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-gray-900">{camp.campaignName}</h5>
                        <span className="text-[10px] text-gray-500">Target: {camp.targetAudience}</span>
                      </div>
                      <span className="font-mono font-black text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        {camp.programPrice}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <span className="text-gray-500 block text-[9.5px] uppercase font-bold">Starter:</span>
                        <strong className="text-[#0F5132]">{camp.starterRate}</strong>
                      </div>
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                        <span className="text-gray-500 block text-[9.5px] uppercase font-bold">Elite Partner:</span>
                        <strong className="text-amber-800">{camp.eliteRate}</strong>
                      </div>
                    </div>
                    <div className="space-y-1 text-[11px] text-gray-600">
                      <div><strong>Qualifying Action:</strong> {camp.qualifyingAction}</div>
                      <div><strong>Payout Timeline:</strong> {camp.payoutTimeline}</div>
                      <div><strong>Refund Policy:</strong> {camp.refundPolicy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "DISCLOSURES" && (
            <div className="space-y-3">
              <div className="pb-2 border-b border-gray-200">
                <h4 className="font-extrabold text-sm text-[#0F5132]">Clause 7: Approved Transparency Disclosures</h4>
                <p className="text-[11px] text-gray-500">
                  Partners must disclose referral relationships clearly and visibly to their audience.
                </p>
              </div>

              {P2IP_MANDATORY_DISCLOSURES.map((disc) => (
                <div key={disc.id} className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900">{disc.label}</span>
                    <button
                      onClick={() => handleCopy(disc.format, disc.id)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedId === disc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-xs text-[#0F5132] font-bold">
                    {disc.format}
                  </div>
                  <p className="text-[11px] text-gray-500"><strong>Usage:</strong> {disc.usage}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "RAW_TEXT" && (
            <div className="bg-white p-4 rounded-2xl border border-gray-200 font-sans text-xs whitespace-pre-line text-gray-800 leading-relaxed max-h-[500px] overflow-y-auto">
              {P2IP_PARTNERSPHERE_FULL_TEXT}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-gray-500 text-center sm:text-left">
            Compliance & Legal: <a href="mailto:connect@pathtoinnerpeace.in" className="text-[#0F5132] font-semibold underline">connect@pathtoinnerpeace.in</a>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsTermsOpen(false)}
              className="flex-1 sm:flex-none px-5 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-300 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
