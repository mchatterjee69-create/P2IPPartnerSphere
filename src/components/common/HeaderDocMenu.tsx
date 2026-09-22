import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  MoreVertical,
  ShieldCheck,
  FileText,
  ExternalLink,
  PhoneCall,
  Mail,
  RotateCcw,
  Scale,
  BookOpen,
  X,
  Shield,
  Users,
  Banknote,
  Sliders,
  ClipboardList,
  LogOut,
  UserCheck,
} from "lucide-react";

interface HeaderDocMenuProps {
  theme?: "light" | "dark";
}

export const HeaderDocMenu: React.FC<HeaderDocMenuProps> = ({ theme = "light" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    currentRole,
    setCurrentRole,
    currentPartner,
    setIsTermsOpen,
    setActiveTab,
    resetToDemoData,
    logout,
  } = useApp();

  const isAdmin = currentRole === "admin";

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleOpenTerms = () => {
    setIsOpen(false);
    setIsTermsOpen(true);
  };

  const handleNavigate = (tab: string) => {
    setIsOpen(false);
    setActiveTab(tab);
  };

  const isDark = theme === "dark";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* 3-Dots Button */}
      <button
        id="header-doc-menu-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Documentation and options menu"
        aria-expanded={isOpen}
        className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
          isDark
            ? "text-emerald-100 hover:text-white hover:bg-white/15 bg-white/10 border border-white/20"
            : "text-gray-600 hover:text-[#0F5132] hover:bg-gray-100 bg-gray-50 border border-gray-200/90"
        } ${isOpen ? (isDark ? "bg-white/20 text-white" : "bg-emerald-50 text-[#0F5132] border-[#0F5132]/30") : ""}`}
        title={`${isAdmin ? "Admin Governance & Docs" : "Partner Documentation & Desk"} (3-dots menu)`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          id="header-doc-dropdown"
          className="absolute right-0 mt-2 w-76 sm:w-84 rounded-2xl bg-white shadow-2xl border border-gray-200/90 z-50 animate-fade-in overflow-hidden text-gray-800 ring-1 ring-black/5"
        >
          {/* Dropdown Header showing Role Identity */}
          <div className="bg-gradient-to-r from-[#0F5132] to-[#146c43] p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20 text-[#F5D77F]">
                {isAdmin ? <Shield className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black tracking-wide flex items-center gap-1.5 text-white">
                  <span>{isAdmin ? "Admin Governance & Docs" : "Partner Docs & Resources"}</span>
                </div>
                <p className="text-[10px] text-emerald-200 truncate">
                  {isAdmin
                    ? "Central Executive CRM Control"
                    : `${currentPartner.name} • ${currentPartner.code}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto divide-y divide-gray-100">
            {/* Legal & Policy Section */}
            <div className="p-2 space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {isAdmin ? "Governance & Legal Framework" : "Legal & Compliance Terms"}
              </div>

              <button
                id="doc-menu-terms-btn"
                onClick={handleOpenTerms}
                className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-[#0F5132] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0F5132] group-hover:text-white transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                    Partner Terms & 10 Clauses
                  </div>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    Attribution rules, 50% revenue share, 7-day refund window & compliance
                  </p>
                </div>
              </button>

              <button
                onClick={handleOpenTerms}
                className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#B48220] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#B48220] group-hover:text-white transition">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                    Code of Ethics & Anti-Spam
                  </div>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    Client consent mandate, zero aggressive solicitation rules
                  </p>
                </div>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNavigate("admin-payouts")}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0F5132] group-hover:text-white transition">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                      Commission Payout & SLA Desk
                    </div>
                    <p className="text-[10px] text-gray-500 leading-snug">
                      7-day refund hold enforcement, batch payout settlements
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* Role-Specific Shortcuts */}
            <div className="p-2 space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {isAdmin ? "Admin Controls & Catalogs" : "Portals & Collaterals"}
              </div>

              <a
                id="doc-menu-website-link"
                href="https://www.pathtoinnerpeace.in"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition flex items-center justify-between">
                    <span>Official Website</span>
                    <span className="text-[9px] text-gray-400 font-normal">pathtoinnerpeace.in</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    Transform Your Mind, Elevate Your Life
                  </p>
                </div>
              </a>

              {isAdmin ? (
                <>
                  <button
                    onClick={() => handleNavigate("admin-catalogue")}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                        Product Catalogue & Commission Rules
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug">
                        Manage Mind Reset Challenge & 1-on-1 programs
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate("admin-partners")}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                        Partner Directory & Rates
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug">
                        Tier levels, 50% commission custom rates & KYC
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate("admin-automation")}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                        Automation & Attribution Engine
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug">
                        First-touch / Last-touch logic, duplicate fraud alerts
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate("admin-audit")}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gray-800 group-hover:text-white transition">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                        Audit Trail & System Logs
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug">
                        Immutable transaction log, role elevation events
                      </p>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate("marketing")}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                        Marketing Assets & Collaterals
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug">
                        Ready-made WhatsApp copy, banners & templates
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigate("inner-circle")}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0F5132] group-hover:text-white transition">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                        Inner Circle Network Rules
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug">
                        Tier progression, sub-partner invites & milestone rewards
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Direct Support Desk */}
            <div className="p-2 space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Direct Helpdesk
              </div>

              <a
                id="doc-menu-whatsapp-link"
                href="https://wa.me/919163670300"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#0F5132] flex items-center justify-center shrink-0 group-hover:bg-[#0F5132] group-hover:text-white transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                    WhatsApp Partner Support
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-800">
                    +91 9163670300
                  </div>
                </div>
              </a>

              <a
                id="doc-menu-email-link"
                href="mailto:connect@pathtoinnerpeace.in"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 transition cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-gray-800 group-hover:text-white transition">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-[#0F5132] transition">
                    Official Email Desk
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    connect@pathtoinnerpeace.in
                  </div>
                </div>
              </a>
            </div>

            {/* Quick Actions & Session */}
            <div className="p-2 bg-gray-50/80 space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (confirm("Reset application cache to clean initial state?")) {
                    resetToDemoData();
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-[#0F5132] hover:bg-white transition cursor-pointer border border-transparent hover:border-gray-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Application Cache</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({isAdmin ? "Admin" : currentPartner.code})</span>
              </button>
            </div>
          </div>

          {/* Minimal Dropdown Footer */}
          <div className="p-2 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
            Path to Inner Peace • {isAdmin ? "Admin Console" : "Partner Portal"}
          </div>
        </div>
      )}
    </div>
  );
};
