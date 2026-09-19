import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PARTNER_CLIENT_REFERRAL_TERMS, PARTNER_TERMS_FULL_TEXT } from "../../data/partnerTermsData";
import {
  X,
  ShieldCheck,
  Check,
  FileText,
  Search,
  BookOpen,
  Scale,
  Users,
  AlertTriangle,
  Lock,
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
  const [activeViewMode, setActiveViewMode] = useState<"CLAUSES" | "RAW_TEXT">("CLAUSES");

  if (!isTermsOpen) return null;

  const filteredClauses = PARTNER_CLIENT_REFERRAL_TERMS.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fullText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#0F5132]/30 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F5132] to-[#146c43] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4AF37]/50 flex items-center justify-center text-[#F5D77F] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-wide">
                Partner Client Referral Code & Terms
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-200">
                Path to Inner Peace Statutory Partner Agreement ({businessRules.termsVersion || "v1.3"}) • 10 Adherence Clauses
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

        {/* View mode toggle & search bar */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setActiveViewMode("CLAUSES")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === "CLAUSES"
                  ? "bg-[#0F5132] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>10 Detailed Clauses</span>
            </button>
            <button
              onClick={() => setActiveViewMode("RAW_TEXT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === "RAW_TEXT"
                  ? "bg-[#0F5132] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Agreement Text</span>
            </button>
          </div>

          {activeViewMode === "CLAUSES" && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search referral rules, TDS, refund hold..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132]"
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-gray-700">
          {/* Important Notice */}
          <div className="p-3 sm:p-4 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-amber-950 flex items-start gap-2.5 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-[11px] sm:text-xs">
              <strong className="block text-amber-900 mb-0.5 font-black">
                Mandatory Client Referral Adherence:
              </strong>
              All accredited partners must refer individuals strictly as <strong>Clients</strong> seeking holistic inner peace, guided breathwork, and lifestyle resilience. The use of student terminology, clinical medical promises, cold spam blasts, or unauthorized discounts is strictly prohibited.
            </div>
          </div>

          {activeViewMode === "CLAUSES" ? (
            <div className="space-y-3">
              {filteredClauses.map((clause) => (
                <div
                  key={clause.id}
                  className="p-3.5 sm:p-4 bg-[#FAFBFA] border border-gray-200 rounded-2xl hover:border-[#0F5132]/40 transition shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5 pb-1.5 border-b border-gray-100">
                    <span className="font-extrabold text-xs text-[#0F5132] flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#0F5132] text-white flex items-center justify-center text-[10px] font-black">
                        {clause.clauseNumber}
                      </span>
                      <span>{clause.title}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {clause.badge}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-gray-800 font-medium mb-2 leading-relaxed">
                    {clause.summary}
                  </p>

                  <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 text-[11px] text-gray-600 leading-relaxed font-sans">
                    {clause.fullText}
                  </div>
                </div>
              ))}

              {filteredClauses.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No clauses match your search "{searchQuery}".
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#F8F9F8] p-4 rounded-xl border border-gray-200 font-mono text-[11px] whitespace-pre-line text-gray-800 leading-relaxed">
              {businessRules.partnerTermsContent || PARTNER_TERMS_FULL_TEXT}
            </div>
          )}

          {currentPartner.termsAccepted && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0F5132] shrink-0" />
                <span className="text-xs">
                  Terms accepted on{" "}
                  <strong>
                    {new Date(currentPartner.termsAcceptedAt || Date.now()).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-[#0F5132] px-2 py-0.5 rounded">
                Version {currentPartner.termsVersion || businessRules.termsVersion}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-gray-500 text-center sm:text-left">
            Official Compliance Desk: <a href="mailto:connect@pathtoinnerpeace.in" className="text-[#0F5132] font-semibold underline">connect@pathtoinnerpeace.in</a>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!currentPartner.termsAccepted && currentRole === "partner" && (
              <button
                onClick={() => {
                  acceptPartnerTerms(currentPartner.id);
                  setIsTermsOpen(false);
                }}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#0F5132] text-white rounded-xl text-xs font-bold hover:bg-[#146c43] transition cursor-pointer shadow-xs"
              >
                Accept & Agree to Terms
              </button>
            )}
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
