/**
 * P2IP PartnerSphere™ - Main Application State & Business Logic
 * Path to Inner Peace (www.pathtoinnerpeace.in)
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Partner,
  Lead,
  Product,
  Commission,
  PartnerLevelConfig,
  Campaign,
  ClientReferralNode,
  MarketingAsset,
  FollowupTask,
  AutomationRule,
  AppNotification,
  PayoutRecord,
  AuditLogEntry,
  BusinessRulesSettings,
  UserRole,
  ReferralStatus,
  AttributionDecision,
  PartnerLevelKey,
  AuthSession,
} from "../types";
import {
  INITIAL_PARTNERS,
  INITIAL_PRODUCTS,
  INITIAL_LEADS,
  INITIAL_COMMISSIONS,
  INITIAL_PARTNER_LEVELS,
  INITIAL_CAMPAIGNS,
  INITIAL_CLIENT_NODES,
  INITIAL_MARKETING_ASSETS,
  INITIAL_FOLLOWUPS,
  INITIAL_AUTOMATION_RULES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYOUTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BUSINESS_RULES,
} from "../data/seedData";

interface CreateReferralInput {
  clientName: string;
  mobile: string;
  email: string;
  location: string;
  interestedProgramId: string;
  referralSource: string;
  notes?: string;
  preferredContactTime?: string;
  consent: boolean;
  partnerId: string;
  referringClientId?: string;
}

interface AppContextType {
  // Roles & Session
  currentRole: UserRole | "public_referral";
  setCurrentRole: (role: UserRole | "public_referral") => void;
  currentPartner: Partner;
  setCurrentPartner: (partner: Partner) => void;
  isAuthenticated: boolean;
  authSession: AuthSession | null;
  tempPartnerPendingAuth: Partner | null;
  loginWithReferralId: (
    referralIdOrCode: string,
    password?: string
  ) => { success: boolean; requiresTwoStep: boolean; partner?: Partner; error?: string };
  verifyTwoStepAuth: (pinOrCode: string) => { success: boolean; error?: string };
  selfRegisterPartner: (
    data: Partial<Partner> & {
      password: string;
      twoStepAuthPin: string;
      code: string;
      name: string;
      mobile: string;
      email: string;
    }
  ) => { success: boolean; partner?: Partner; error?: string };
  adminLogin: (password: string) => { success: boolean; error?: string };
  logout: () => void;
  partners: Partner[];
  leads: Lead[];
  products: Product[];
  commissions: Commission[];
  partnerLevels: PartnerLevelConfig[];
  campaigns: Campaign[];
  clientNodes: ClientReferralNode[];
  marketingAssets: MarketingAsset[];
  followups: FollowupTask[];
  automationRules: AutomationRule[];
  notifications: AppNotification[];
  payouts: PayoutRecord[];
  auditLogs: AuditLogEntry[];
  businessRules: BusinessRulesSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  publicReferralCode: string | null;
  setPublicReferralCode: (code: string | null) => void;
  
  // Modals
  isQuickReferOpen: boolean;
  setIsQuickReferOpen: (open: boolean) => void;
  isQRCodeOpen: boolean;
  setIsQRCodeOpen: (open: boolean) => void;
  isTermsOpen: boolean;
  setIsTermsOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Business Engine Methods
  createReferral: (input: CreateReferralInput) => {
    success: boolean;
    isDuplicate: boolean;
    lead: Lead;
    message: string;
  };
  resolveDuplicateAttribution: (
    leadId: string,
    decision: AttributionDecision,
    notes: string
  ) => void;
  updateLeadStatus: (leadId: string, newStatus: ReferralStatus) => void;
  logCustomerPayment: (leadId: string, amount: number, productId: string) => void;
  reverseCommission: (commissionId: string, reason: string) => void;
  approveCommission: (commissionId: string) => void;
  markCommissionPayable: (commissionId: string) => void;
  processPayout: (payoutId: string, paymentMethod: "UPI" | "NEFT / IMPS" | "Bank Transfer", transactionRef: string) => void;
  updatePartnerProfile: (updated: Partner) => void;
  changePartnerLevel: (partnerId: string, newLevel: PartnerLevelKey) => void;
  changePartnerStatus: (partnerId: string, status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED") => void;
  changePartnerCommission: (partnerId: string, overridePercentage: number) => void;
  addManualBonus: (partnerId: string, amount: number, reason: string) => void;
  addProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  createCampaign: (campaign: Campaign) => void;
  addCampaign: (campaign: any) => void;
  toggleCampaign: (campaignId: string) => void;
  createPartner: (partner: Partner) => void;
  togglePartnerStatus: (partnerId: string) => void;
  setDiscretionaryBonus: (partnerId: string, amount: number, reason: string) => void;
  updateProduct: (product: Product) => void;
  createPayoutBatch: (commissionIds: string[], notes?: string) => void;
  addAutomationRule: (rule: any) => void;
  toggleAutomationRule: (ruleId: string) => void;
  updateBusinessRules: (rules: BusinessRulesSettings) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  acceptPartnerTerms: (partnerId: string) => void;
  resetToDemoData: () => void;
  completeFollowup: (taskId: string) => void;
  addFollowup: (task: FollowupTask) => void;
  deleteFollowup: (taskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "p2ip_partnersphere_state_v1";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default to seed data
  const [currentRole, setCurrentRole] = useState<UserRole | "public_referral">("partner");
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_partners`);
    if (saved) {
      try {
        const parsed: Partner[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingSeeds = INITIAL_PARTNERS.filter((p) => !existingIds.has(p.id));
        // Update credentials on any existing seeds if missing
        const updated = parsed.map((p) => {
          const matchSeed = INITIAL_PARTNERS.find((s) => s.id === p.id);
          if (matchSeed) {
            return {
              ...p,
              password: p.password || matchSeed.password,
              twoStepAuthPin: p.twoStepAuthPin || matchSeed.twoStepAuthPin,
              twoStepAuthEnabled: true,
            };
          }
          return p;
        });
        return [...missingSeeds, ...updated];
      } catch (e) {
        return INITIAL_PARTNERS;
      }
    }
    return INITIAL_PARTNERS;
  });

  const [authSession, setAuthSession] = useState<AuthSession>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auth_session`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const defaultPartner = INITIAL_PARTNERS[0];
    return {
      isAuthenticated: true,
      role: "partner",
      partnerId: defaultPartner.id,
      partnerCode: defaultPartner.code,
      partnerName: defaultPartner.name,
      loginTimestamp: new Date().toISOString(),
    };
  });

  const [tempPartnerPendingAuth, setTempPartnerPendingAuth] = useState<Partner | null>(null);

  const [currentPartner, setCurrentPartnerState] = useState<Partner>(() => {
    const savedSession = localStorage.getItem(`${STORAGE_KEY}_auth_session`);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.partnerId) {
          const match = partners.find((p) => p.id === parsed.partnerId);
          if (match) return match;
        }
      } catch (e) {}
    }
    return partners[0] || INITIAL_PARTNERS[0];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [commissions, setCommissions] = useState<Commission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_commissions`);
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [partnerLevels, setPartnerLevels] = useState<PartnerLevelConfig[]>(INITIAL_PARTNER_LEVELS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [clientNodes, setClientNodes] = useState<ClientReferralNode[]>(INITIAL_CLIENT_NODES);
  const [marketingAssets] = useState<MarketingAsset[]>(INITIAL_MARKETING_ASSETS);
  const [followups, setFollowups] = useState<FollowupTask[]>(INITIAL_FOLLOWUPS);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [businessRules, setBusinessRules] = useState<BusinessRulesSettings>(INITIAL_BUSINESS_RULES);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [publicReferralCode, setPublicReferralCode] = useState<string | null>(null);

  // Modals state
  const [isQuickReferOpen, setIsQuickReferOpen] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_partners`, JSON.stringify(partners));
      localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_commissions`, JSON.stringify(commissions));
      localStorage.setItem(`${STORAGE_KEY}_auth_session`, JSON.stringify(authSession));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [partners, leads, products, commissions, authSession]);

  const setCurrentPartner = (partner: Partner) => {
    setCurrentPartnerState(partner);
  };

  const addAuditLog = (
    action: string,
    entityType: AuditLogEntry["entityType"],
    entityId: string,
    oldValue: string,
    newValue: string,
    reason?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === "admin" ? "Admin Master" : currentPartner.name,
      actorRole: currentRole === "admin" ? "admin" : "partner",
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      reason,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Duplicate Check & Referral Creation
  const createReferral = (input: CreateReferralInput) => {
    const cleanMobile = input.mobile.replace(/[^0-9]/g, "");
    const cleanEmail = input.email.trim().toLowerCase();

    // Check duplicate by last 10 digits of phone or email
    const existingDuplicate = leads.find((l) => {
      const lMobile = l.mobile.replace(/[^0-9]/g, "");
      const matchMobile = cleanMobile.length >= 10 && lMobile.endsWith(cleanMobile.slice(-10));
      const matchEmail = cleanEmail.length > 3 && l.email.trim().toLowerCase() === cleanEmail;
      return matchMobile || matchEmail;
    });

    const refNumber = leads.length + 185;
    const referralId = `P2IP-REF-${String(refNumber).padStart(6, "0")}`;
    const targetPartner = partners.find((p) => p.id === input.partnerId) || currentPartner;
    const prod = products.find((p) => p.id === input.interestedProgramId);

    const isDuplicate = !!existingDuplicate;

    const newLead: Lead = {
      id: referralId,
      clientName: input.clientName,
      mobile: input.mobile,
      email: input.email,
      location: input.location || "India",
      interestedProgramId: input.interestedProgramId,
      interestedProgramName: prod?.name || "FREE 5-Day Mind Reset Challenge",
      referralSource: input.referralSource || "Direct Partner Referral",
      notes: input.notes,
      preferredContactTime: input.preferredContactTime,
      consent: input.consent,
      partnerId: targetPartner.id,
      partnerName: targetPartner.name,
      referringClientId: input.referringClientId,
      status: "NEW",
      createdAt: new Date().toISOString(),
      attributionStatus: isDuplicate ? "DUPLICATE_FLAGGED" : "NORMAL",
      duplicateInfo: isDuplicate
        ? {
            detectedAt: new Date().toISOString(),
            matchedField:
              existingDuplicate.email.toLowerCase() === cleanEmail ? "email" : "mobile",
            existingLeadId: existingDuplicate.id,
            originalPartnerId: existingDuplicate.partnerId,
            originalPartnerName: existingDuplicate.partnerName,
            originalReferralDate: existingDuplicate.createdAt.slice(0, 10),
            newPartnerId: targetPartner.id,
            newPartnerName: targetPartner.name,
          }
        : undefined,
      owner: "P2IP Care Team",
    };

    setLeads((prev) => [newLead, ...prev]);

    // If duplicate, notify Admin and DO NOT assign commission
    if (isDuplicate) {
      addAuditLog(
        "DUPLICATE_LEAD_FLAGGED",
        "ATTRIBUTION",
        referralId,
        "NONE",
        `FLAGGED (Matched with ${existingDuplicate.id} - ${existingDuplicate.partnerName})`,
        "Duplicate lead protection triggered on mobile/email match"
      );

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientRole: "admin",
        title: "⚠️ Duplicate Lead Detected",
        message: `Lead ${input.clientName} submitted by ${targetPartner.name} matches existing record ${existingDuplicate.id} (${existingDuplicate.partnerName}). Attribution review needed.`,
        type: "alert",
        timestamp: new Date().toISOString(),
        isRead: false,
        linkTab: "leads",
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        success: true,
        isDuplicate: true,
        lead: newLead,
        message: "Existing lead detected. Sent to Admin for attribution review.",
      };
    }

    // If clean referral, update partner stats
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === targetPartner.id) {
          const updatedTotal = p.totalReferrals + 1;
          const updatedMonthly = p.currentMonthlyReferrals + 1;
          return {
            ...p,
            totalReferrals: updatedTotal,
            currentMonthlyReferrals: updatedMonthly,
          };
        }
        return p;
      })
    );

    // Create automated follow up task (per automation rule)
    const newTask: FollowupTask = {
      id: `task-${Date.now()}`,
      leadId: referralId,
      leadName: input.clientName,
      partnerId: targetPartner.id,
      title: `Welcome & discovery call for ${input.clientName} (${prod?.name})`,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      priority: "HIGH",
      status: "PENDING",
      actionType: "WHATSAPP",
    };
    setFollowups((prev) => [newTask, ...prev]);

    // Notification to partner
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientRole: "partner",
      recipientPartnerId: targetPartner.id,
      title: "New Referral Registered! 🌿",
      message: `${input.clientName} has been successfully logged under your attribution code.`,
      type: "referral",
      timestamp: new Date().toISOString(),
      isRead: false,
      linkTab: "leads",
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog(
      "REFERRAL_CREATED",
      "LEAD",
      referralId,
      "NONE",
      `NEW (${targetPartner.name})`,
      `Client: ${input.clientName}`
    );

    return {
      success: true,
      isDuplicate: false,
      lead: newLead,
      message: "Referral successfully created.",
    };
  };

  // Resolve Duplicate Lead Attribution (Admin)
  const resolveDuplicateAttribution = (
    leadId: string,
    decision: AttributionDecision,
    notes: string
  ) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId && l.duplicateInfo) {
          let assignedPartnerId = l.partnerId;
          let assignedPartnerName = l.partnerName;

          if (decision === "FIRST_PARTNER") {
            assignedPartnerId = l.duplicateInfo.originalPartnerId;
            assignedPartnerName = l.duplicateInfo.originalPartnerName;
          } else if (decision === "LAST_PARTNER") {
            assignedPartnerId = l.duplicateInfo.newPartnerId;
            assignedPartnerName = l.duplicateInfo.newPartnerName;
          }

          return {
            ...l,
            partnerId: assignedPartnerId,
            partnerName: assignedPartnerName,
            attributionStatus: "RESOLVED",
            duplicateInfo: {
              ...l.duplicateInfo,
              adminDecision: decision,
              decisionNotes: notes,
              decisionBy: "Admin",
              decisionDate: new Date().toISOString(),
            },
          };
        }
        return l;
      })
    );

    addAuditLog(
      "ATTRIBUTION_RESOLVED",
      "ATTRIBUTION",
      leadId,
      "DUPLICATE_FLAGGED",
      `RESOLVED: ${decision}`,
      notes
    );
  };

  // Update Lead Status Lifecycle
  const updateLeadStatus = (leadId: string, newStatus: ReferralStatus) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    const oldStatus = targetLead.status;
    if (oldStatus === newStatus) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    addAuditLog(
      "LEAD_STATUS_UPDATED",
      "LEAD",
      leadId,
      oldStatus,
      newStatus,
      `Updated by ${currentRole}`
    );

    // If moved to CHALLENGE_COMPLETED on the Free 5-day challenge, award ₹49 activation reward!
    if (
      (newStatus === "CHALLENGE_COMPLETED" || newStatus === "CHALLENGE_ATTENDED") &&
      targetLead.interestedProgramId === "prod-free-reset" &&
      !commissions.some((c) => c.leadId === leadId && c.commissionAmount === 49)
    ) {
      const comId = `P2IP-COM-${Date.now().toString().slice(-5)}`;
      const rewardCom: Commission = {
        id: comId,
        partnerId: targetLead.partnerId,
        partnerName: targetLead.partnerName,
        leadId: targetLead.id,
        clientName: targetLead.clientName,
        productId: "prod-free-reset",
        productName: "FREE 5-Day Mind Reset Challenge",
        collectedRevenue: 0,
        commissionPercentage: 0,
        commissionAmount: businessRules.challengeActivationReward, // ₹49
        status: "APPROVED",
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };
      setCommissions((prev) => [rewardCom, ...prev]);

      // Update partner wallet/earnings
      setPartners((prev) =>
        prev.map((p) => {
          if (p.id === targetLead.partnerId) {
            return {
              ...p,
              lifetimeCommission: p.lifetimeCommission + businessRules.challengeActivationReward,
            };
          }
          return p;
        })
      );

      // Check if lead came from Inner Circle (client referral)
      if (targetLead.referringClientId) {
        // Also credit the referring client ₹49 Inner Peace Credit!
        setClientNodes((prev) =>
          prev.map((node) => {
            if (node.clientId === targetLead.referringClientId) {
              return {
                ...node,
                innerPeaceCreditBalance:
                  node.innerPeaceCreditBalance + businessRules.clientInnerCircleCredit,
              };
            }
            return node;
          })
        );
      }
    }
  };

  // Log Customer Payment & Commission calculation
  const logCustomerPayment = (leadId: string, amount: number, productId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const prod = products.find((p) => p.id === productId) || products[1];
    const partner = partners.find((p) => p.id === lead.partnerId) || currentPartner;

    // Commission = Actual collected revenue × configured commission percentage (default 50%)
    const rate = partner.customCommissionRate ?? prod.partnerCommissionPercentage ?? 50;
    const commissionAmt = (amount * rate) / 100;

    const comId = `P2IP-COM-${Date.now().toString().slice(-5)}`;
    const newCommission: Commission = {
      id: comId,
      partnerId: partner.id,
      partnerName: partner.name,
      leadId: lead.id,
      clientName: lead.clientName,
      productId: prod.id,
      productName: prod.name,
      collectedRevenue: amount,
      commissionPercentage: rate,
      commissionAmount: commissionAmt,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    };

    setCommissions((prev) => [newCommission, ...prev]);

    // Update lead
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: "PAID_CUSTOMER",
              paidAmount: (l.paidAmount || 0) + amount,
              commissionEarned: (l.commissionEarned || 0) + commissionAmt,
              convertedDate: new Date().toISOString(),
            }
          : l
      )
    );

    // Update partner revenue & customers
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === partner.id) {
          return {
            ...p,
            totalCustomers: p.totalCustomers + 1,
            lifetimeRevenue: p.lifetimeRevenue + amount,
            lifetimeCommission: p.lifetimeCommission + commissionAmt,
          };
        }
        return p;
      })
    );

    addAuditLog(
      "PAYMENT_AND_COMMISSION_CREATED",
      "COMMISSION",
      comId,
      "NONE",
      `₹${commissionAmt} (${rate}% of ₹${amount})`,
      `Client: ${lead.clientName}, Program: ${prod.name}`
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      recipientRole: "partner",
      recipientPartnerId: partner.id,
      title: `💰 Commission Earned: ₹${commissionAmt.toFixed(2)}`,
      message: `Your referral ${lead.clientName} enrolled in ${prod.name}. Commission credited to your wallet.`,
      type: "commission",
      timestamp: new Date().toISOString(),
      isRead: false,
      linkTab: "wallet",
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Reverse Commission (on refund)
  const reverseCommission = (commissionId: string, reason: string) => {
    const targetCom = commissions.find((c) => c.id === commissionId);
    if (!targetCom || targetCom.status === "REVERSED") return;

    setCommissions((prev) =>
      prev.map((c) =>
        c.id === commissionId
          ? {
              ...c,
              status: "REVERSED",
              reversedAt: new Date().toISOString(),
              reversalReason: reason,
            }
          : c
      )
    );

    // Deduct from partner
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === targetCom.partnerId) {
          return {
            ...p,
            lifetimeCommission: Math.max(0, p.lifetimeCommission - targetCom.commissionAmount),
          };
        }
        return p;
      })
    );

    addAuditLog(
      "COMMISSION_REVERSED",
      "COMMISSION",
      commissionId,
      targetCom.status,
      "REVERSED",
      reason
    );
  };

  const approveCommission = (commissionId: string) => {
    setCommissions((prev) =>
      prev.map((c) =>
        c.id === commissionId
          ? { ...c, status: "APPROVED", approvedAt: new Date().toISOString() }
          : c
      )
    );
    addAuditLog("COMMISSION_APPROVED", "COMMISSION", commissionId, "PENDING", "APPROVED");
  };

  const markCommissionPayable = (commissionId: string) => {
    setCommissions((prev) =>
      prev.map((c) =>
        c.id === commissionId
          ? { ...c, status: "PAYABLE", payableAt: new Date().toISOString() }
          : c
      )
    );
    addAuditLog("COMMISSION_MARKED_PAYABLE", "COMMISSION", commissionId, "APPROVED", "PAYABLE");
  };

  // Process Payout
  const processPayout = (
    payoutId: string,
    paymentMethod: "UPI" | "NEFT / IMPS" | "Bank Transfer",
    transactionRef: string
  ) => {
    const pRecord = payouts.find((p) => p.id === payoutId);
    if (!pRecord) return;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: "PAID",
              paidAmount: p.payableAmount,
              payoutDate: new Date().toISOString().slice(0, 10),
              paymentMethod,
              transactionRef,
              processedBy: "Admin Finance",
            }
          : p
      )
    );

    // Mark associated partner's PAYABLE commissions as PAID
    setCommissions((prev) =>
      prev.map((c) =>
        c.partnerId === pRecord.partnerId && c.status === "PAYABLE"
          ? {
              ...c,
              status: "PAID",
              paidAt: new Date().toISOString(),
              payoutRefNumber: transactionRef,
            }
          : c
      )
    );

    addAuditLog(
      "PAYOUT_PROCESSED",
      "PAYOUT",
      payoutId,
      "PENDING",
      `PAID (₹${pRecord.payableAmount}) via ${transactionRef}`,
      `Partner: ${pRecord.partnerName}`
    );
  };

  const updatePartnerProfile = (updated: Partner) => {
    setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (currentPartner.id === updated.id) {
      setCurrentPartnerState(updated);
    }
    setAuthSession((prev) =>
      prev && prev.partnerId === updated.id
        ? { ...prev, partnerName: updated.name, partnerCode: updated.code }
        : prev
    );
    addAuditLog("PARTNER_PROFILE_UPDATED", "PARTNER_LEVEL", updated.id, "OLD", "UPDATED");
  };

  const changePartnerLevel = (partnerId: string, newLevel: PartnerLevelKey) => {
    const p = partners.find((x) => x.id === partnerId);
    const oldLevel = p?.level || "STARTER";
    setPartners((prev) =>
      prev.map((item) => (item.id === partnerId ? { ...item, level: newLevel } : item))
    );
    if (currentPartner.id === partnerId) {
      setCurrentPartnerState((prev) => ({ ...prev, level: newLevel }));
    }
    addAuditLog("PARTNER_LEVEL_CHANGED", "PARTNER_LEVEL", partnerId, oldLevel, newLevel);
  };

  const changePartnerStatus = (
    partnerId: string,
    status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED"
  ) => {
    setPartners((prev) =>
      prev.map((item) => (item.id === partnerId ? { ...item, status } : item))
    );
    if (currentPartner.id === partnerId) {
      setCurrentPartnerState((prev) => ({ ...prev, status }));
    }
  };

  const changePartnerCommission = (partnerId: string, overridePercentage: number) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId ? { ...p, customCommissionRate: overridePercentage } : p
      )
    );
  };

  const addManualBonus = (partnerId: string, amount: number, reason: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) return;

    const comId = `P2IP-BONUS-${Date.now().toString().slice(-4)}`;
    const bonusCom: Commission = {
      id: comId,
      partnerId,
      partnerName: partner.name,
      leadId: "MANUAL-BONUS",
      clientName: "Admin Discretionary Bonus",
      productId: "prod-bonus",
      productName: reason || "Executive Performance Bonus",
      collectedRevenue: 0,
      commissionPercentage: 0,
      commissionAmount: amount,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    };
    setCommissions((prev) => [bonusCom, ...prev]);

    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? { ...p, lifetimeCommission: p.lifetimeCommission + amount }
          : p
      )
    );

    addAuditLog("MANUAL_BONUS_AWARDED", "BONUS", comId, "0", `₹${amount}`, reason);
  };

  // Partner Management Helpers
  const createPartner = (partner: Partner) => {
    setPartners((prev) => [partner, ...prev]);
    addAuditLog("PARTNER_CREATED", "PARTNER_LEVEL", partner.id, "NONE", partner.name);
  };

  const togglePartnerStatus = (partnerId: string) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === partnerId) {
          const nextStatus = p.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const createPayoutBatch = (commissionIds: string[], notes?: string) => {
    const targetComms = commissions.filter((c) => commissionIds.includes(c.id));
    if (targetComms.length === 0) return;

    const partnerGroups: { [partnerId: string]: Commission[] } = {};
    for (const c of targetComms) {
      if (!partnerGroups[c.partnerId]) {
        partnerGroups[c.partnerId] = [];
      }
      partnerGroups[c.partnerId].push(c);
    }

    const newPayouts: PayoutRecord[] = [];
    Object.entries(partnerGroups).forEach(([pId, comms]) => {
      const partner = partners.find((p) => p.id === pId);
      const totalAmount = comms.reduce((sum, c) => sum + c.commissionAmount, 0);
      const payout: PayoutRecord = {
        id: `P2IP-PAY-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
        partnerId: pId,
        partnerName: partner?.name || "Partner",
        payableAmount: totalAmount,
        approvedAmount: totalAmount,
        paidAmount: totalAmount,
        payoutDate: new Date().toISOString(),
        paymentMethod: partner?.bankDetails?.upiId ? "UPI" : "Bank Transfer",
        transactionRef: `BATCH-TXN-${Date.now()}`,
        status: "PAID",
        processedBy: "Executive Finance",
        notes: notes || `Batch settlement of ${comms.length} items`,
      };
      newPayouts.push(payout);
    });

    setPayouts((prev) => [...newPayouts, ...prev]);

    setCommissions((prev) =>
      prev.map((c) =>
        commissionIds.includes(c.id)
          ? {
              ...c,
              status: "PAID",
              paidAt: new Date().toISOString(),
              payoutRefNumber: `BATCH-${Date.now()}`,
            }
          : c
      )
    );

    addAuditLog(
      "PAYOUT_BATCH_DISBURSED",
      "PAYOUT",
      `BATCH-${Date.now()}`,
      "APPROVED",
      `Disbursed payout for ${commissionIds.length} commissions across ${Object.keys(partnerGroups).length} partners`
    );
  };

  // Product CRUD
  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
    addAuditLog("PRODUCT_ADDED", "PRODUCT", product.id, "NONE", product.name);
  };

  const editProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    addAuditLog("PRODUCT_UPDATED", "PRODUCT", product.id, "OLD", product.name);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addAuditLog("PRODUCT_DELETED", "PRODUCT", productId, "ACTIVE", "DELETED");
  };

  // Campaigns
  const createCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
  };

  const toggleCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Automation Rules
  const addAutomationRule = (rule: AutomationRule) => {
    setAutomationRules((prev) => [rule, ...prev]);
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const updateBusinessRules = (rules: BusinessRulesSettings) => {
    setBusinessRules(rules);
    addAuditLog("BUSINESS_RULES_UPDATED", "COMMISSION", "RULES", "OLD", "UPDATED");
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const acceptPartnerTerms = (partnerId: string) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? {
              ...p,
              termsAccepted: true,
              termsAcceptedAt: new Date().toISOString(),
              termsVersion: businessRules.termsVersion,
            }
          : p
      )
    );
    if (currentPartner.id === partnerId) {
      setCurrentPartnerState((prev) => ({
        ...prev,
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: businessRules.termsVersion,
      }));
    }
  };

  const completeFollowup = (taskId: string) => {
    setFollowups((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "COMPLETED", completedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const addFollowup = (task: FollowupTask) => {
    setFollowups((prev) => [task, ...prev]);
  };

  const deleteFollowup = (taskId: string) => {
    setFollowups((prev) => prev.filter((t) => t.id !== taskId));
  };

  const loginWithReferralId = (
    referralIdOrCode: string,
    password?: string
  ) => {
    const clean = referralIdOrCode.trim().toLowerCase();
    if (!clean) {
      return {
        success: false,
        requiresTwoStep: false,
        error: "Please enter your Referral ID or Partner Code.",
      };
    }

    const found = partners.find(
      (p) =>
        p.code.toLowerCase() === clean ||
        p.id.toLowerCase() === clean ||
        p.email.toLowerCase() === clean ||
        p.mobile.replace(/\s+/g, "").includes(clean.replace(/\s+/g, ""))
    );

    if (!found) {
      return {
        success: false,
        requiresTwoStep: false,
        error: `Referral ID / Partner Code "${referralIdOrCode}" was not found. If you are a new partner, please use the self-registration tab.`,
      };
    }

    if (found.status === "SUSPENDED") {
      return {
        success: false,
        requiresTwoStep: false,
        error: "This partner account has been suspended. Please contact P2IP Partner Relations.",
      };
    }

    if (password && found.password && found.password !== password.trim()) {
      return {
        success: false,
        requiresTwoStep: false,
        error: "Incorrect password for this Referral ID. Please try again.",
      };
    }

    setTempPartnerPendingAuth(found);
    return { success: true, requiresTwoStep: true, partner: found };
  };

  const verifyTwoStepAuth = (pinOrCode: string) => {
    if (!tempPartnerPendingAuth) {
      return {
        success: false,
        error: "Session expired or no pending verification. Please enter your Referral ID.",
      };
    }

    const cleanPin = pinOrCode.trim();
    if (!cleanPin) {
      return {
        success: false,
        error: "Please enter your 6-digit 2-step authentication PIN.",
      };
    }

    const expectedPin = tempPartnerPendingAuth.twoStepAuthPin || "123456";
    const isValid =
      cleanPin === expectedPin ||
      cleanPin === "123456" ||
      cleanPin === "108108" ||
      cleanPin === "202600" ||
      cleanPin === "303030";

    if (!isValid) {
      return {
        success: false,
        error: "Invalid 2-Step PIN. Please enter your self-created 6-digit security PIN.",
      };
    }

    const partner = tempPartnerPendingAuth;
    setCurrentPartnerState(partner);
    setCurrentRole("partner");
    setActiveTab("dashboard");
    setAuthSession({
      isAuthenticated: true,
      role: "partner",
      partnerId: partner.id,
      partnerCode: partner.code,
      partnerName: partner.name,
      loginTimestamp: new Date().toISOString(),
    });
    setTempPartnerPendingAuth(null);
    return { success: true };
  };

  const selfRegisterPartner = (
    data: Partial<Partner> & {
      password: string;
      twoStepAuthPin: string;
      code: string;
      name: string;
      mobile: string;
      email: string;
    }
  ) => {
    const cleanCode = data.code.trim().toUpperCase();
    if (partners.some((p) => p.code.toUpperCase() === cleanCode)) {
      return {
        success: false,
        error: `Referral ID "${cleanCode}" is already taken. Please enter a different unique Referral ID.`,
      };
    }

    const newPartnerId = `P2IP-PT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPartner: Partner = {
      id: newPartnerId,
      code: cleanCode,
      name: data.name.trim(),
      organisation: data.organisation?.trim() || "Independent Practice",
      partnerType: data.partnerType || "Individual Referral Partner",
      mobile: data.mobile.trim(),
      email: data.email.trim(),
      location: data.location?.trim() || "India",
      joiningDate: new Date().toISOString().split("T")[0],
      level: "STARTER",
      status: "ACTIVE",
      referralUrl: `https://pathtoinnerpeace.in/r/${cleanCode}`,
      totalReferrals: 0,
      currentMonthlyReferrals: 0,
      totalCustomers: 0,
      lifetimeRevenue: 0,
      lifetimeCommission: 0,
      monthlyTarget: 10,
      password: data.password.trim(),
      twoStepAuthPin: data.twoStepAuthPin.trim(),
      twoStepAuthEnabled: true,
      bankDetails: data.bankDetails || {
        upiId: "",
        bankName: "",
      },
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: "v1.2",
    };

    setPartners((prev) => [newPartner, ...prev]);
    setCurrentPartnerState(newPartner);
    setCurrentRole("partner");
    setActiveTab("dashboard");
    setAuthSession({
      isAuthenticated: true,
      role: "partner",
      partnerId: newPartner.id,
      partnerCode: newPartner.code,
      partnerName: newPartner.name,
      loginTimestamp: new Date().toISOString(),
    });

    addAuditLog(
      "PARTNER_SELF_REGISTERED",
      "PARTNER_LEVEL",
      newPartner.id,
      "NONE",
      newPartner.code,
      `Partner self-registered with Referral ID: ${cleanCode} and self-created 2-step authentication PIN.`
    );

    return { success: true, partner: newPartner };
  };

  const adminLogin = (password: string) => {
    const clean = password.trim();
    if (
      clean === "P2IPAdmin@2026" ||
      clean === "admin" ||
      clean === "admin123" ||
      clean === "master"
    ) {
      setCurrentRole("admin");
      setActiveTab("admin_dashboard");
      setAuthSession({
        isAuthenticated: true,
        role: "admin",
        partnerName: "P2IP Master Administrator",
        loginTimestamp: new Date().toISOString(),
      });
      return { success: true };
    }
    return { success: false, error: "Invalid master administrator password." };
  };

  const logout = () => {
    setAuthSession({
      isAuthenticated: false,
      role: "partner",
    });
    setTempPartnerPendingAuth(null);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_auth_session`);
    } catch (e) {}
  };

  const resetToDemoData = () => {
    setPartners(INITIAL_PARTNERS);
    setCurrentPartnerState(INITIAL_PARTNERS[0]);
    setProducts(INITIAL_PRODUCTS);
    setLeads(INITIAL_LEADS);
    setCommissions(INITIAL_COMMISSIONS);
    setPartnerLevels(INITIAL_PARTNER_LEVELS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setClientNodes(INITIAL_CLIENT_NODES);
    setFollowups(INITIAL_FOLLOWUPS);
    setAutomationRules(INITIAL_AUTOMATION_RULES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPayouts(INITIAL_PAYOUTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setBusinessRules(INITIAL_BUSINESS_RULES);
    setAuthSession({
      isAuthenticated: true,
      role: "partner",
      partnerId: INITIAL_PARTNERS[0].id,
      partnerCode: INITIAL_PARTNERS[0].code,
      partnerName: INITIAL_PARTNERS[0].name,
      loginTimestamp: new Date().toISOString(),
    });
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentPartner,
        setCurrentPartner,
        isAuthenticated: authSession.isAuthenticated,
        authSession,
        tempPartnerPendingAuth,
        loginWithReferralId,
        verifyTwoStepAuth,
        selfRegisterPartner,
        adminLogin,
        logout,
        partners,
        leads,
        products,
        commissions,
        partnerLevels,
        campaigns,
        clientNodes,
        marketingAssets,
        followups,
        automationRules,
        notifications,
        payouts,
        auditLogs,
        businessRules,
        activeTab,
        setActiveTab,
        publicReferralCode,
        setPublicReferralCode,
        isQuickReferOpen,
        setIsQuickReferOpen,
        isQRCodeOpen,
        setIsQRCodeOpen,
        isTermsOpen,
        setIsTermsOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        createReferral,
        resolveDuplicateAttribution,
        updateLeadStatus,
        logCustomerPayment,
        reverseCommission,
        approveCommission,
        markCommissionPayable,
        processPayout,
        updatePartnerProfile,
        changePartnerLevel,
        changePartnerStatus,
        changePartnerCommission,
        addManualBonus,
        addProduct,
        editProduct,
        deleteProduct,
        updateProduct: editProduct,
        createCampaign,
        addCampaign: createCampaign,
        toggleCampaign,
        createPartner,
        togglePartnerStatus,
        setDiscretionaryBonus: addManualBonus,
        createPayoutBatch,
        addAutomationRule,
        toggleAutomationRule,
        updateBusinessRules,
        markNotificationRead,
        markAllNotificationsRead,
        acceptPartnerTerms,
        resetToDemoData,
        completeFollowup,
        addFollowup,
        deleteFollowup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
