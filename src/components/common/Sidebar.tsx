import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Users,
  Wallet,
  TrendingUp,
  Share2,
  Megaphone,
  BarChart3,
  Bot,
  User,
  ShieldCheck,
  Package,
  CreditCard,
  Target,
  Network,
  Zap,
  History,
  Settings,
  PhoneCall,
  ExternalLink,
  HelpCircle,
  CheckSquare,
  LogOut,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, currentPartner, leads, commissions, followups, setIsTermsOpen, logout } = useApp();

  const duplicateLeadsCount = leads.filter((l) => l.attributionStatus === "DUPLICATE_FLAGGED").length;
  const pendingCommissionsCount = commissions.filter((c) => c.status === "PENDING").length;
  const pendingFollowupsCount = followups.filter(
    (t) => t.partnerId === currentPartner.id && t.status === "PENDING"
  ).length;

  if (currentRole === "public_referral") {
    return null;
  }

  const partnerLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "leads",
      label: "Referrals & Leads",
      icon: Users,
      badge: leads.filter((l) => l.partnerId === currentPartner.id && l.status === "NEW").length || undefined,
    },
    {
      id: "followups",
      label: "Follow-up Engine",
      icon: CheckSquare,
      badge: pendingFollowupsCount || undefined,
    },
    { id: "wallet", label: "Earnings & Wallet", icon: Wallet },
    { id: "growth", label: "Growth & Bonuses", icon: TrendingUp },
    { id: "inner-circle", label: "Inner Circle Loop", icon: Share2 },
    { id: "marketing", label: "Marketing Centre", icon: Megaphone },
    { id: "analytics", label: "Partner Analytics", icon: BarChart3 },
    { id: "partner-ai", label: "P2IP Partner AI", icon: Bot, highlight: true },
    { id: "profile", label: "Partner Profile & QR", icon: User },
  ];

  const adminLinks = [
    { id: "admin-dashboard", label: "Executive Overview", icon: LayoutDashboard },
    {
      id: "admin-leads",
      label: "Lead CRM & Review",
      icon: Users,
      badge: duplicateLeadsCount ? `${duplicateLeadsCount} alert` : undefined,
      badgeAlert: duplicateLeadsCount > 0,
    },
    { id: "admin-partners", label: "Partner Management", icon: ShieldCheck },
    { id: "admin-catalogue", label: "Programs Catalogue", icon: Package },
    {
      id: "admin-payouts",
      label: "Commissions & Payouts",
      icon: CreditCard,
      badge: pendingCommissionsCount ? `${pendingCommissionsCount}` : undefined,
    },
    { id: "admin-campaigns", label: "Smart Campaigns", icon: Target },
    { id: "admin-inner-circle", label: "Client Referral Graph", icon: Network },
    { id: "admin-automation", label: "Automation & Follow-ups", icon: Zap },
    { id: "admin-ai", label: "P2IP Admin AI", icon: Bot, highlight: true },
    { id: "admin-audit", label: "Audit Logs", icon: History },
    { id: "admin-settings", label: "Business Rules", icon: Settings },
  ];

  const links = currentRole === "admin" ? adminLinks : partnerLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#0F5132]/10 h-[calc(100vh-4rem)] sticky top-16 shadow-[2px_0_10px_rgba(0,0,0,0.02)] select-none">
      {/* Partner Mini Header */}
      {currentRole === "partner" && (
        <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-[#F8F9F8] to-[#E8F5E9]/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
              Partner ID
            </span>
            <span className="text-[11px] font-extrabold text-[#0F5132] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#0F5132]/20 font-mono">
              {currentPartner.id}
            </span>
          </div>
          <div className="text-sm font-bold text-gray-900 truncate">{currentPartner.name}</div>
          <div className="text-xs text-gray-600 truncate">{currentPartner.organisation}</div>

          {/* Level Badge */}
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-gray-500">Growth Level:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#D4AF37]/20 text-[#8B6508] border border-[#D4AF37]/40">
              {currentPartner.level} PARTNER
            </span>
          </div>
        </div>
      )}

      {/* Admin Mini Header */}
      {currentRole === "admin" && (
        <div className="p-4 border-b border-gray-100 bg-[#F4F6F4]">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0F5132] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            P2IP Central Control
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Path to Inner Peace Admin CRM
          </div>
        </div>
      )}

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer group ${
                isActive
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : item.highlight
                  ? "text-[#8B6508] bg-[#FDF8EB] hover:bg-[#F9ECC6]"
                  : "text-[#1F2923]/80 hover:bg-[#F4F6F4] hover:text-[#0F5132]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-white"
                      : item.highlight
                      ? "text-[#B48220]"
                      : "text-gray-500 group-hover:text-[#0F5132]"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white text-[#0F5132]"
                      : (item as any).badgeAlert
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-[#0F5132]/10 text-[#0F5132]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout / Switch Session Action */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-red-700 border border-gray-200 rounded-xl transition cursor-pointer"
          title="Sign out or switch partner account"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Switch Portal</span>
        </button>
      </div>

      {/* Official Brand Footer */}
      <div className="p-3 border-t border-gray-100 bg-[#FBFBFA] text-[11px] text-gray-500 space-y-1">
        <div className="flex items-center justify-between">
          <a
            href="https://www.pathtoinnerpeace.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F5132] font-semibold hover:underline flex items-center gap-1"
          >
            pathtoinnerpeace.in
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-[10px] font-medium text-gray-500 hover:text-[#0F5132] underline"
          >
            Partner Terms
          </button>
        </div>
        <div className="text-[10px] text-gray-600 flex items-center gap-1 truncate">
          <PhoneCall className="w-3 h-3 text-[#0F5132]" />
          <span>WhatsApp: 9163670300</span>
        </div>
        <div className="text-[9px] text-gray-400">
          connect@pathtoinnerpeace.in
        </div>
      </div>
    </aside>
  );
};
