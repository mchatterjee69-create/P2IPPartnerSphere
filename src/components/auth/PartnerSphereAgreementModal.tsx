import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  X,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  Scale,
  Sparkles,
  DollarSign,
  Share2,
  FileText,
  UserCheck,
  Copy,
  Info,
  Radio,
} from "lucide-react";
import {
  P2IP_PARTNERSPHERE_HEADER,
  P2IP_PARTNERSPHERE_CLAUSES,
  P2IP_ACKNOWLEDGEMENT_CHECKBOXES,
  P2IP_CAMPAIGN_COMMISSION_RULES,
  P2IP_MANDATORY_DISCLOSURES,
  PartnerTermClause,
} from "../../data/partnerTermsData";

interface PartnerSphereAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndOpenPortal: () => void;
  partnerDetails: {
    name: string;
    organisation: string;
    partnerType: string;
    code: string;
    mobile: string;
    email: string;
    panNumber: string;
    aadhaarNumber: string;
  };
}

export const PartnerSphereAgreementModal: React.FC<PartnerSphereAgreementModalProps> = ({
  isOpen,
  onClose,
  onConfirmAndOpenPortal,
  partnerDetails,
}) => {
  // Navigation tabs to keep it clean and prevent a huge wall of text
  const [activeSection, setActiveSection] = useState<"TERMS" | "COMMISSIONS" | "DISCLOSURES">("TERMS");

  // Search in T&C clauses
  const [clauseSearch, setClauseSearch] = useState("");

  // Expandable accordion state for the 23 clauses
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({
    "clause-1": true,
    "clause-2": true,
    "clause-7": true,
  });

  // Radioactive 10 Acknowledgement Checkboxes state
  const [tickedBoxes, setTickedBoxes] = useState<Record<string, boolean>>({});

  // Copy feedback for disclosure templates
  const [copiedDisclosureId, setCopiedDisclosureId] = useState<string | null>(null);

  const toggleClause = (id: string) => {
    setExpandedClauses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    P2IP_PARTNERSPHERE_CLAUSES.forEach((c) => {
      all[c.id] = true;
    });
    setExpandedClauses(all);
  };

  const collapseAll = () => {
    setExpandedClauses({});
  };

  const toggleBox = (id: string) => {
    setTickedBoxes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tickAllBoxes = () => {
    const all: Record<string, boolean> = {};
    P2IP_ACKNOWLEDGEMENT_CHECKBOXES.forEach((b) => {
      all[b.id] = true;
    });
    setTickedBoxes(all);
  };

  const clearAllBoxes = () => {
    setTickedBoxes({});
  };

  const totalBoxes = P2IP_ACKNOWLEDGEMENT_CHECKBOXES.length;
  const tickedCount = Object.values(tickedBoxes).filter(Boolean).length;
  const allTicked = tickedCount === totalBoxes;

  const filteredClauses = useMemo(() => {
    if (!clauseSearch.trim()) return P2IP_PARTNERSPHERE_CLAUSES;
    const q = clauseSearch.toLowerCase();
    return P2IP_PARTNERSPHERE_CLAUSES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.fullText.toLowerCase().includes(q) ||
        c.badge.toLowerCase().includes(q) ||
        String(c.clauseNumber).includes(q)
    );
  }, [clauseSearch]);

  const handleCopyDisclosure = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDisclosureId(id);
    setTimeout(() => setCopiedDisclosureId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      id="partnersphere-agreement-modal-overlay"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#0F5132]/30 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]"
        id="partnersphere-agreement-modal-container"
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#0B3D26] via-[#0F5132] to-[#146c43] p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-[#D4AF37]/60 flex items-center justify-center text-[#F5D77F] shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-[#F5D77F] uppercase bg-black/30 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  {P2IP_PARTNERSPHERE_HEADER.title}
                </span>
                <span className="text-[10px] text-emerald-200 hidden sm:inline-block font-medium">
                  • {P2IP_PARTNERSPHERE_HEADER.tagline}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight mt-0.5 text-white">
                {P2IP_PARTNERSPHERE_HEADER.subtitle}
              </h2>
              <p className="text-[11px] text-emerald-100/90 font-sans">
                Organisation: <strong className="text-white">{P2IP_PARTNERSPHERE_HEADER.organisation}</strong> • Program: {P2IP_PARTNERSPHERE_HEADER.program}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            title="Close modal and review registration form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP NOTICE: STATUTORY LEGAL ADVICE & INDIAN LAWYER REVIEW */}
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-50 to-emerald-50 border-b border-amber-200/90 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-amber-950 shrink-0">
          <div className="flex items-start gap-2">
            <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs leading-tight">
              <strong className="text-amber-900 font-bold">Statutory Legal Notice:</strong>{" "}
              Before making this legally binding, have an Indian lawyer review the final version — especially the commission, privacy/data, refund, termination, and dispute-resolution clauses.
            </p>
          </div>
        </div>

        {/* PARTNER CREDENTIALS SUMMARY BAR */}
        <div className="bg-emerald-50/80 border-b border-emerald-200/70 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-[#0F5132]" />
            <span className="text-gray-600 text-[11px]">Partner:</span>
            <strong className="text-gray-900 text-[11px] sm:text-xs">
              {partnerDetails.name} ({partnerDetails.partnerType})
            </strong>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="bg-[#0F5132] text-[#F5D77F] font-mono px-2 py-0.5 rounded font-bold">
              ID: {partnerDetails.code.toUpperCase()}
            </span>
            <span className="text-gray-500 font-mono hidden md:inline">
              PAN: {partnerDetails.panNumber || "N/A"}
            </span>
            <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
              Sec 194H TDS Ready
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS (Prevents huge wall of text) */}
        <div className="bg-gray-100/90 px-4 pt-2.5 pb-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveSection("TERMS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === "TERMS"
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Expandable T&C (23 Clauses)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("COMMISSIONS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === "COMMISSIONS"
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>2. Campaign Commission Rules</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("DISCLOSURES")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === "DISCLOSURES"
                  ? "bg-[#0F5132] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>3. Mandatory Disclosures</span>
            </button>
          </div>

          <span className="text-[11px] font-semibold text-gray-500">
            Preamble: Read, confirm & tick all 10 boxes below to join
          </span>
        </div>

        {/* SCROLLABLE MAIN BODY */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs text-gray-700 leading-relaxed bg-[#FCFDFD]">
          {/* TAB 1: EXPANDABLE T&C CLAUSES (1 to 23) */}
          {activeSection === "TERMS" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-gray-200">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F5132] flex items-center gap-2">
                    <span>Partner Terms & Conditions (Clauses 1 – 23)</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                      {P2IP_PARTNERSPHERE_CLAUSES.length} Clauses
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Click on any clause to expand its full legal text or search for specific terms.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={clauseSearch}
                      onChange={(e) => setClauseSearch(e.target.value)}
                      placeholder="Search clauses..."
                      className="pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132] w-36 sm:w-48"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={expandAll}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAll}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg cursor-pointer"
                  >
                    Collapse
                  </button>
                </div>
              </div>

              {/* Accordion List */}
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
                          <span className="w-6 h-6 rounded-lg bg-[#0F5132] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
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

                        <div className="text-gray-400 hover:text-gray-700 shrink-0 p-1">
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
                                Specified Provisions / Prohibitions:
                              </strong>
                              <ul className="list-disc list-inside space-y-1 pl-1">
                                {clause.bulletPoints.map((bp, i) => (
                                  <li key={i} className="leading-snug">
                                    {bp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SEPARATE CAMPAIGN COMMISSION RULES */}
          {activeSection === "COMMISSIONS" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F5132] flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                    <span>Separately Stated Campaign Commission Rules</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Transparent payouts, qualifying client actions, and cooling refund policies for each active P2IP program.
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-[#0F5132] text-[#F5D77F] px-2.5 py-1 rounded-lg">
                  Tiered 20% – 35%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {P2IP_CAMPAIGN_COMMISSION_RULES.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:border-[#0F5132]/40 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                          {camp.campaignName}
                        </h4>
                        <span className="text-[10.5px] text-gray-500">
                          Target: {camp.targetAudience}
                        </span>
                      </div>
                      <span className="font-extrabold text-xs font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded shrink-0">
                        {camp.programPrice}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <span className="text-gray-500 block text-[10px] uppercase font-bold">Starter Level:</span>
                        <strong className="text-[#0F5132] font-mono">{camp.starterRate}</strong>
                      </div>
                      <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100">
                        <span className="text-gray-500 block text-[10px] uppercase font-bold">Elite Partner:</span>
                        <strong className="text-amber-800 font-mono">{camp.eliteRate}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>
                          <strong>Qualifying Action:</strong> {camp.qualifyingAction}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span>
                          <strong>Payout Timeline:</strong> {camp.payoutTimeline}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <span>
                          <strong>Refund / Reversal:</strong> {camp.refundPolicy}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MANDATORY DISCLOSURE ACKNOWLEDGEMENT */}
          {activeSection === "DISCLOSURES" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F5132] flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#0F5132]" />
                    <span>Clause 7: Transparent Partnership Disclosures</span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Approved standard commercial disclosure copy for social media, bio links, and direct messaging.
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                  Mandatory for All Partners
                </span>
              </div>

              <div className="space-y-3">
                {P2IP_MANDATORY_DISCLOSURES.map((disc) => (
                  <div
                    key={disc.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900">
                        {disc.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyDisclosure(disc.format, disc.id)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedDisclosureId === disc.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Format</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl font-mono text-xs text-[#0F5132] font-extrabold">
                      {disc.format}
                    </div>

                    <p className="text-[11px] text-gray-500">
                      <strong>Usage Guidelines:</strong> {disc.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 24: ACKNOWLEDGEMENT WITH 10 "RADIOACTIVE" CHECKBOXES */}
          <div
            className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/40 border-2 border-[#0F5132]/60 rounded-2xl sm:rounded-3xl shadow-md space-y-4"
            id="clause-24-acknowledgement-section"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0F5132] text-white flex items-center justify-center text-xs font-black">
                    24
                  </span>
                  <h3 className="font-black text-sm text-[#0F5132] tracking-tight">
                    24. Acknowledgement & Radioactive Affirmation
                  </h3>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  By selecting <strong className="text-emerald-950">“I Agree & Join PartnerSphere”</strong>, the Partner explicitly confirms all 10 statements below:
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full border transition ${
                    allTicked
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                      : "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                  }`}
                >
                  {tickedCount} of {totalBoxes} Confirmed
                </span>

                <button
                  type="button"
                  onClick={allTicked ? clearAllBoxes : tickAllBoxes}
                  className="px-3 py-1 bg-white hover:bg-emerald-50 text-[#0F5132] font-black text-xs rounded-xl border border-emerald-300 transition shadow-xs cursor-pointer"
                >
                  {allTicked ? "Untick All" : "⚡ Tick All 10 Boxes"}
                </button>
              </div>
            </div>

            {/* Radioactive Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  allTicked
                    ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-[#D4AF37] shadow-sm"
                    : "bg-[#0F5132]"
                }`}
                style={{ width: `${(tickedCount / totalBoxes) * 100}%` }}
              />
            </div>

            {/* The 10 Radioactive Checkboxes */}
            <div className="space-y-2" id="radioactive-checkbox-grid">
              {P2IP_ACKNOWLEDGEMENT_CHECKBOXES.map((item, index) => {
                const isChecked = !!tickedBoxes[item.id];
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleBox(item.id)}
                    className={`flex items-start gap-3 p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? "bg-emerald-50/90 border-emerald-500 shadow-xs ring-1 ring-emerald-400"
                        : "bg-white border-gray-200 hover:border-emerald-300 hover:bg-gray-50/80"
                    }`}
                  >
                    {/* Radioactive glowing checkbox indicator */}
                    <div className="relative mt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-[#0F5132] text-[#F5D77F] shadow-md shadow-emerald-700/40 ring-2 ring-[#0F5132]/30 scale-105"
                            : "border-2 border-gray-300 bg-white group-hover:border-emerald-500"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Radioactive pulsing aura when pending */}
                      {!isChecked && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <span
                        className={`text-xs font-bold leading-snug block transition ${
                          isChecked ? "text-emerald-950 font-black" : "text-gray-800"
                        }`}
                      >
                        <span className="text-gray-400 mr-1.5 font-mono text-[11px]">
                          [{index + 1}]
                        </span>
                        {item.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {!allTicked && (
              <p className="text-[11px] text-amber-800 font-bold flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <Radio className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                <span>
                  All 10 radioactive checkboxes must be ticked to activate partner accreditation and open your personal portal.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-xl transition cursor-pointer"
          >
            ← Review & Edit Details
          </button>

          <button
            id="confirm-declaration-and-open-portal-btn"
            type="button"
            disabled={!allTicked}
            onClick={onConfirmAndOpenPortal}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
              allTicked
                ? "bg-gradient-to-r from-[#0F5132] via-[#146c43] to-[#D4AF37] hover:brightness-110 text-white shadow-emerald-900/30 scale-[1.01]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${allTicked ? "text-[#F5D77F] animate-spin" : "text-gray-400"}`} />
            <span>
              {allTicked
                ? "I Agree & Join PartnerSphere — Open Portal Now →"
                : `Tick All 10 Radioactive Boxes to Unlock (${tickedCount}/${totalBoxes})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
