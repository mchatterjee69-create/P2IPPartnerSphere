import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
import { MobileBottomNav } from "./components/common/MobileBottomNav";
import { QuickReferModal } from "./components/common/QuickReferModal";
import { QRCodeModal } from "./components/common/QRCodeModal";
import { TermsModal } from "./components/common/TermsModal";
import { NotificationDrawer } from "./components/common/NotificationDrawer";

// Partner Views
import { PartnerDashboard } from "./components/partner/PartnerDashboard";
import { PartnerLeadsView } from "./components/partner/PartnerLeadsView";
import { PartnerWalletView } from "./components/partner/PartnerWalletView";
import { PartnerGrowthView } from "./components/partner/PartnerGrowthView";
import { PartnerInnerCircleView } from "./components/partner/PartnerInnerCircleView";
import { PartnerMarketingCentre } from "./components/partner/PartnerMarketingCentre";
import { PartnerAnalyticsView } from "./components/partner/PartnerAnalyticsView";
import { PartnerAiAssistant } from "./components/partner/PartnerAiAssistant";
import { PartnerProfileView } from "./components/partner/PartnerProfileView";
import { PartnerFollowupView } from "./components/partner/PartnerFollowupView";

// Admin Views
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminLeadCrm } from "./components/admin/AdminLeadCrm";
import { AdminPartnerManagement } from "./components/admin/AdminPartnerManagement";
import { AdminProductCatalogue } from "./components/admin/AdminProductCatalogue";
import { AdminCommissionPayout } from "./components/admin/AdminCommissionPayout";
import { AdminCampaignCreator } from "./components/admin/AdminCampaignCreator";
import { AdminAutomationEngine } from "./components/admin/AdminAutomationEngine";
import { AdminAiAssistant } from "./components/admin/AdminAiAssistant";
import { AdminAuditLogsView } from "./components/admin/AdminAuditLogsView";
import { AdminSettingsView } from "./components/admin/AdminSettingsView";

// Public Landing Page
import { PublicReferralPage } from "./components/public/PublicReferralPage";
import { AuthPortal } from "./components/auth/AuthPortal";

const AppContent: React.FC = () => {
  const { activeTab, currentRole, isAuthenticated } = useApp();

  // If user navigated to the Public Referral Landing Page
  if (currentRole === "public_referral" || activeTab === "public-referral") {
    return <PublicReferralPage />;
  }

  // If user is not authenticated, show the Referral ID & 2-Step Verification Portal
  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  // Render view corresponding to activeTab
  const renderView = () => {
    switch (activeTab) {
      // Partner Tabs
      case "dashboard":
        return <PartnerDashboard />;
      case "leads":
        return <PartnerLeadsView />;
      case "followups":
        return <PartnerFollowupView />;
      case "wallet":
        return <PartnerWalletView />;
      case "growth":
        return <PartnerGrowthView />;
      case "inner-circle":
        return <PartnerInnerCircleView />;
      case "marketing":
        return <PartnerMarketingCentre />;
      case "analytics":
        return <PartnerAnalyticsView />;
      case "partner-ai":
      case "ai-assistant":
        return <PartnerAiAssistant />;
      case "profile":
        return <PartnerProfileView />;

      // Admin Tabs
      case "admin-dashboard":
        return <AdminDashboard />;
      case "admin-leads":
        return <AdminLeadCrm />;
      case "admin-partners":
        return <AdminPartnerManagement />;
      case "admin-catalogue":
      case "admin-products":
        return <AdminProductCatalogue />;
      case "admin-payouts":
        return <AdminCommissionPayout />;
      case "admin-campaigns":
        return <AdminCampaignCreator />;
      case "admin-automation":
      case "admin-automations":
        return <AdminAutomationEngine />;
      case "admin-ai":
        return <AdminAiAssistant />;
      case "admin-audit":
        return <AdminAuditLogsView />;
      case "admin-settings":
        return <AdminSettingsView />;

      default:
        return currentRole === "admin" ? <AdminDashboard /> : <PartnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col selection:bg-[#0F5132] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace with Desktop Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        {/* Scrollable Core View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl pb-24 md:pb-12 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Mobile-first bottom navigation */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <QuickReferModal />
      <QRCodeModal />
      <TermsModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
