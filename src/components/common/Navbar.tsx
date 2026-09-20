import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BrandLogo } from "./BrandLogo";
import { AdminAuthModal } from "./AdminAuthModal";
import { HeaderDocMenu } from "./HeaderDocMenu";
import {
  Bell,
  QrCode,
  UserPlus,
  Shield,
  UserCheck,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ChevronDown,
  LogOut,
  Lock,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentPartner,
    setCurrentPartner,
    partners,
    notifications,
    setIsQuickReferOpen,
    setIsQRCodeOpen,
    setIsNotificationsOpen,
    resetToDemoData,
    setActiveTab,
    logout,
    authSession,
  } = useApp();

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleAdminSwitchClick = () => {
    if (authSession?.role === "admin") {
      setCurrentRole("admin");
      setActiveTab("admin-dashboard");
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#0F5132]/10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab(currentRole === "admin" ? "admin-dashboard" : "dashboard");
              }}
              className="text-left cursor-pointer transition hover:opacity-90"
              id="navbar-logo-btn"
            >
              <BrandLogo size="md" />
            </button>
          </div>

          {/* Center: Interactive Role Switcher & Partner Persona Selector */}
          <div className="hidden md:flex items-center gap-2 bg-[#F5F7F5] p-1 rounded-xl border border-[#0F5132]/15">
            <button
              id="switch-role-partner"
              onClick={() => {
                setCurrentRole("partner");
                setActiveTab("dashboard");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRole === "partner"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "text-[#1F2923]/80 hover:text-[#0F5132] hover:bg-white/60"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Partner Portal
            </button>

            <button
              id="switch-role-admin"
              onClick={handleAdminSwitchClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRole === "admin"
                  ? "bg-[#0F5132] text-white shadow-sm"
                  : "text-[#1F2923]/80 hover:text-[#0F5132] hover:bg-white/60"
              }`}
              title={authSession?.role === "admin" ? "Switch to Central Admin CRM" : "Restricted: Master password p2ip@1230 required"}
            >
              {authSession?.role === "admin" ? (
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{authSession?.role === "admin" ? "Admin / P2IP CRM" : "Admin (p2ip@1230)"}</span>
            </button>

            <button
              id="switch-role-public"
              onClick={() => {
                setCurrentRole("public_referral");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentRole === "public_referral"
                  ? "bg-[#B48220] text-white shadow-sm"
                  : "text-[#B48220] hover:bg-amber-50"
              }`}
              title="Preview public referral invite page seen by clients"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Referral Landing
            </button>

            <button
              id="nav-partner-with-us-btn"
              onClick={() => {
                setActiveTab("partner-with-us");
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0F5132] hover:bg-emerald-50 transition cursor-pointer"
              title="Refer & Earn program details for all verticals"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Partner With Us</span>
            </button>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://p2-ip-partner-sphere.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#c29e2f] text-[#0F5132] font-black text-xs transition shadow-2xs"
              title="External partner registration"
            >
              <span>Register Now</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {/* Authenticated Genuine Partner Identity Badge */}
            {currentRole === "partner" && currentPartner && currentPartner.code !== "PENDING_REGISTRATION" && (
              <div className="hidden lg:flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 rounded-xl px-3 py-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="text-[#0F5132] font-bold truncate max-w-[140px]">{currentPartner.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white rounded border border-emerald-200 text-emerald-800 font-semibold">
                  {currentPartner.code}
                </span>
              </div>
            )}

            {/* Quick Refer Button (Primary CTA) */}
            <button
              id="quick-refer-cta-btn"
              onClick={() => setIsQuickReferOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0F5132] to-[#146c43] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition active:scale-95 cursor-pointer border border-[#D4AF37]/40"
            >
              <UserPlus className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold">+ REFER A CLIENT</span>
            </button>

            {/* QR Code Button */}
            {currentRole === "partner" && (
              <button
                id="navbar-qr-btn"
                onClick={() => setIsQRCodeOpen(true)}
                title="View & Share Partner QR Code"
                className="p-2 rounded-xl text-[#0F5132] bg-[#E8F5E9] hover:bg-[#D1E7DD] border border-[#0F5132]/20 transition cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}

            {/* Notifications Bell */}
            <button
              id="navbar-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl text-gray-700 bg-gray-100/80 hover:bg-gray-200 border border-gray-200/80 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Demo Reset */}
            <button
              id="navbar-reset-demo-btn"
              onClick={() => {
                if (confirm("Reset demo data to clean initial state?")) {
                  resetToDemoData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 rounded-xl text-gray-500 hover:text-[#0F5132] hover:bg-gray-100 transition hidden sm:block cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Avatar / Badge */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-xs shadow-inner ring-1 ring-[#D4AF37]/50 overflow-hidden">
                {currentRole === "admin" ? (
                  <img
                    src="/p2ip-logo.webp"
                    onError={(e) => {
                      e.currentTarget.src = "https://yourimageshare.com/ib/Lqlh3mtjO0.png";
                    }}
                    alt="P2IP Admin"
                    className="w-full h-full rounded-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : currentPartner.avatarUrl ? (
                  <img
                    src={currentPartner.avatarUrl}
                    alt={currentPartner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentPartner.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-800 leading-tight">
                  {currentRole === "admin" ? "P2IP Admin CRM" : currentPartner.name}
                </span>
                <span className="text-[10px] font-medium text-[#0F5132]">
                  {currentRole === "admin"
                    ? "Executive Admin"
                    : `${currentPartner.partnerType} • ${currentPartner.level}`}
                </span>
              </div>
            </div>

            {/* Logout / Switch Session Action */}
            <button
              id="navbar-logout-btn"
              onClick={logout}
              title="Sign out or login with different Referral ID"
              className="p-2 rounded-xl text-gray-500 hover:text-red-700 hover:bg-red-50 border border-gray-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Header Right Side 3-Dots Documentation & Support Menu */}
            <HeaderDocMenu theme="light" />
          </div>
        </div>

        {/* Mobile Sub-header Role Switcher */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-gray-100 gap-1 overflow-x-auto">
          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={() => {
                setCurrentRole("partner");
                setActiveTab("dashboard");
              }}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap transition ${
                currentRole === "partner"
                  ? "bg-[#0F5132] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Partner Portal
            </button>
            <button
              onClick={handleAdminSwitchClick}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap transition flex items-center justify-center gap-1 ${
                currentRole === "admin"
                  ? "bg-[#0F5132] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {authSession?.role !== "admin" && <Lock className="w-3 h-3 text-amber-600" />}
              <span>Admin CRM</span>
            </button>
            <button
              onClick={() => setCurrentRole("public_referral")}
              className={`py-1 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap transition ${
                currentRole === "public_referral"
                  ? "bg-[#B48220] text-white"
                  : "bg-amber-50 text-[#B48220]"
              }`}
            >
              Invite Page
            </button>
          </div>
        </div>
      </div>

      {/* Master Admin Authorization Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
      />
    </header>
  );
};
