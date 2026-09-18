import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Home,
  Users,
  PlusCircle,
  Wallet,
  Megaphone,
  Menu,
  Shield,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    setIsQuickReferOpen,
  } = useApp();

  if (currentRole === "public_referral") {
    return null;
  }

  if (currentRole === "admin") {
    return (
      <nav
        id="mobile-bottom-nav-admin"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200/80 shadow-lg px-2 py-1.5"
      >
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab("admin-dashboard")}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
              activeTab === "admin-dashboard" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("admin-leads")}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
              activeTab === "admin-leads" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            Leads CRM
          </button>

          <button
            onClick={() => setActiveTab("admin-partners")}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
              activeTab === "admin-partners" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            Partners
          </button>

          <button
            onClick={() => setActiveTab("admin-payouts")}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
              activeTab === "admin-payouts" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Wallet className="w-5 h-5 mb-0.5" />
            Payouts
          </button>

          <button
            onClick={() => setActiveTab("admin-ai")}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
              activeTab === "admin-ai" ? "text-[#B48220]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            Admin AI
          </button>

          <button
            onClick={() => setActiveTab("admin-catalogue")}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-semibold transition ${
              activeTab === "admin-catalogue" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            More
          </button>
        </div>
      </nav>
    );
  }

  // Partner Mobile Navigation: HOME, LEADS, REFER, EARNINGS, MARKETING, MORE
  return (
    <nav
      id="mobile-bottom-nav-partner"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200/80 shadow-lg px-2 py-1.5"
    >
      <div className="flex items-center justify-around">
        {/* HOME */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition ${
            activeTab === "dashboard" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          HOME
        </button>

        {/* LEADS */}
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition ${
            activeTab === "leads" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          LEADS
        </button>

        {/* REFER - Prominent elevated Center CTA */}
        <button
          onClick={() => setIsQuickReferOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 p-1 group focus:outline-none"
          title="Quick Refer Client"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0F5132] to-[#166534] text-white flex items-center justify-center shadow-md ring-4 ring-white active:scale-95 transition">
            <PlusCircle className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <span className="text-[10px] font-extrabold text-[#0F5132] tracking-tight mt-0.5">
            REFER
          </span>
        </button>

        {/* EARNINGS */}
        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition ${
            activeTab === "wallet" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          EARNINGS
        </button>

        {/* MARKETING */}
        <button
          onClick={() => setActiveTab("marketing")}
          className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition ${
            activeTab === "marketing" ? "text-[#0F5132]" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Megaphone className="w-5 h-5 mb-0.5" />
          MARKETING
        </button>

        {/* MORE (Growth, Inner Circle, AI, Profile) */}
        <button
          onClick={() => setActiveTab("more")}
          className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition ${
            activeTab === "more" || activeTab === "growth" || activeTab === "profile" || activeTab === "partner-ai"
              ? "text-[#0F5132]"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          MORE
        </button>
      </div>
    </nav>
  );
};
