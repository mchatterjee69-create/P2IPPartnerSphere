import React from "react";
import { useApp } from "../../context/AppContext";
import {
  TrendingUp,
  Share2,
  BarChart3,
  Bot,
  User,
  CheckSquare,
  FileText,
  LogOut,
  Sparkles,
  Package,
  Target,
  Network,
  Zap,
  History,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  QrCode,
  Shield,
  CreditCard,
} from "lucide-react";

export const MobileMoreHub: React.FC = () => {
  const {
    currentRole,
    setActiveTab,
    currentPartner,
    setIsTermsOpen,
    setIsQRCodeOpen,
    logout,
  } = useApp();

  const partnerItems = [
    {
      id: "growth",
      label: "Growth & Milestone Bonuses",
      desc: "Track referrals to unlock ₹5,000 / ₹15,000 cash rewards",
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "followups",
      label: "Follow-up Engine",
      desc: "Smart client nurturing nudges and action prompts",
      icon: CheckSquare,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "inner-circle",
      label: "Inner Circle Loop",
      desc: "Secondary client-to-client referral network",
      icon: Share2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "analytics",
      label: "Partner Analytics",
      desc: "Conversion funnels, attribution channels, and trends",
      icon: BarChart3,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      id: "partner-with-us",
      label: "Partner With Us (Refer & Earn)",
      desc: "Vertical-wise earnings guide for instructors, clinics & studios",
      icon: Sparkles,
      color: "text-[#D4AF37] bg-amber-50/80",
      highlight: true,
    },
    {
      id: "partner-ai",
      label: "P2IP Partner AI",
      desc: "Generate personalized client pitch scripts & WhatsApp copy",
      icon: Bot,
      color: "text-purple-600 bg-purple-50",
    },
    {
      id: "profile",
      label: "Partner Profile & QR Code",
      desc: "View PAN, Aadhaar status, banking details & attribution code",
      icon: User,
      color: "text-emerald-700 bg-emerald-50",
    },
  ];

  const adminItems = [
    {
      id: "admin-catalogue",
      label: "Programs Catalogue",
      desc: "Mind Mastery 21-Day, Breathwork & Mind Reset configs",
      icon: Package,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "admin-campaigns",
      label: "Smart Campaigns",
      desc: "Broadcast challenges & seasonal flash rewards",
      icon: Target,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "admin-inner-circle",
      label: "Client Referral Graph",
      desc: "Visualize multi-tier client attribution loops",
      icon: Network,
      color: "text-purple-600 bg-purple-50",
    },
    {
      id: "admin-automation",
      label: "Automation & Workflows",
      desc: "Automated trigger rules for client journeys",
      icon: Zap,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "admin-audit",
      label: "Audit Logs",
      desc: "Immutable activity trail & attribution revisions",
      icon: History,
      color: "text-gray-600 bg-gray-100",
    },
    {
      id: "admin-settings",
      label: "Business Rules & Commission Rates",
      desc: "50% revenue share, 7-day validation hold, TDS configs",
      icon: Settings,
      color: "text-teal-600 bg-teal-50",
    },
  ];

  const items = currentRole === "admin" ? adminItems : partnerItems;

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-10">
      {/* Header Profile Summary on Mobile */}
      {currentRole === "partner" ? (
        <div className="bg-gradient-to-br from-[#0F5132] to-[#146c43] text-white p-4 sm:p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white text-[#0F5132] flex items-center justify-center font-black text-sm shadow-inner ring-2 ring-[#D4AF37]">
                {currentPartner.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  {currentPartner.name}
                </h3>
                <p className="text-xs text-emerald-200">
                  {currentPartner.partnerType} • {currentPartner.organisation}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsQRCodeOpen(true)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-[#F5D77F] border border-white/20 transition cursor-pointer"
              title="Show QR Code"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-400/20 flex items-center justify-between text-xs">
            <div>
              <span className="text-emerald-200 text-[10px] block">Attribution Code:</span>
              <span className="font-mono font-bold text-white text-xs">{currentPartner.code}</span>
            </div>
            <div>
              <span className="text-emerald-200 text-[10px] block">Level:</span>
              <span className="font-bold text-[#F5D77F] text-xs uppercase">{currentPartner.level} PARTNER</span>
            </div>
            <div>
              <span className="text-emerald-200 text-[10px] block">Statutory KYC:</span>
              <span className="font-bold text-emerald-100 text-xs">✓ PAN & Aadhaar</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-[#0F5132] text-white p-4 sm:p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5D77F]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">P2IP Central Operations</h3>
              <p className="text-xs text-emerald-200">Master Administrative Modules</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs divide-y divide-gray-100 overflow-hidden">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0F5132] transition truncate">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {item.desc}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0F5132] group-hover:translate-x-0.5 transition shrink-0 ml-2" />
            </button>
          );
        })}
      </div>

      {/* Quick Action Cards: Terms & Conditions and Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={() => setIsTermsOpen(true)}
          className="p-3.5 bg-white rounded-2xl border border-gray-200/80 hover:border-[#0F5132]/40 transition text-left flex items-center gap-3 cursor-pointer shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Partner Terms & 10 Clauses</div>
            <div className="text-[10px] text-gray-500">Client referral adherence rules</div>
          </div>
        </button>

        <a
          href="https://www.pathtoinnerpeace.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-white rounded-2xl border border-gray-200/80 hover:border-[#0F5132]/40 transition text-left flex items-center gap-3 shadow-xs"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#B48220] flex items-center justify-center shrink-0">
            <ExternalLink className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900">Official Website</div>
            <div className="text-[10px] text-gray-500">pathtoinnerpeace.in</div>
          </div>
        </a>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        className="w-full py-3 px-4 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        <LogOut className="w-4 h-4 text-red-600" />
        <span>Sign Out / Switch Partner Portal</span>
      </button>
    </div>
  );
};
