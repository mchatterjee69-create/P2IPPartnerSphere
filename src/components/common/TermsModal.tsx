import React from "react";
import { useApp } from "../../context/AppContext";
import { X, ShieldCheck, Check, Calendar, FileText } from "lucide-react";

export const TermsModal: React.FC = () => {
  const {
    isTermsOpen,
    setIsTermsOpen,
    businessRules,
    currentPartner,
    acceptPartnerTerms,
    currentRole,
  } = useApp();

  if (!isTermsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#0F5132]/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F5132] to-[#146c43] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Partner Terms & Ethical Standards</h3>
              <p className="text-xs text-emerald-100/80">
                Official Path to Inner Peace Agreement ({businessRules.termsVersion})
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTermsOpen(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs leading-relaxed text-gray-700">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <strong>Notice on Ethical Standards:</strong> Path to Inner Peace programs represent holistic lifestyle, stress management, guided breathwork, and emotional transformation practices. Partners must not misrepresent programs as clinical psychotherapy or medical psychiatric treatment.
          </div>

          <div className="bg-[#F8F9F8] p-4 rounded-xl border border-gray-200 font-mono text-[11px] whitespace-pre-line text-gray-800 leading-normal">
            {businessRules.partnerTermsContent}
          </div>

          {currentPartner.termsAccepted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0F5132]" />
                <span>
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
                {currentPartner.termsVersion || businessRules.termsVersion}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-[11px] text-gray-500">
            For legal inquiries: connect@pathtoinnerpeace.in
          </div>
          <div className="flex items-center gap-2">
            {!currentPartner.termsAccepted && currentRole === "partner" && (
              <button
                onClick={() => {
                  acceptPartnerTerms(currentPartner.id);
                  setIsTermsOpen(false);
                }}
                className="px-4 py-2 bg-[#0F5132] text-white rounded-xl text-xs font-bold hover:bg-[#146c43] transition cursor-pointer"
              >
                Accept & Agree to Terms
              </button>
            )}
            <button
              onClick={() => setIsTermsOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-300 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
