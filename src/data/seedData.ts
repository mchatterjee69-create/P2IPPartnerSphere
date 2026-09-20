/**
 * P2IP PartnerSphere™ - Production Data Configuration
 * Path to Inner Peace (www.pathtoinnerpeace.in)
 *
 * ZERO FAKE DATA MANDATE:
 * Production starts with strictly:
 * Partners = 0, Referrals = 0, Customers = 0, Revenue = ₹0, Commission = ₹0, Payouts = ₹0
 * All numbers originate exclusively from the SQLite database transactions.
 */

import {
  Partner,
  Product,
  Lead,
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
} from "../types";
import { PARTNER_TERMS_FULL_TEXT } from "./partnerTermsData";

export const INITIAL_PARTNER_LEVELS: PartnerLevelConfig[] = [
  {
    key: "STARTER",
    name: "Starter",
    minReferrals: 1,
    maxReferrals: 4,
    commissionPercentage: 50,
    monthlyPerformanceBonus: 0,
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Ideal for new partners beginning their journey with Path to Inner Peace.",
  },
  {
    key: "BUILDER",
    name: "Builder",
    minReferrals: 5,
    maxReferrals: 9,
    commissionPercentage: 50,
    monthlyPerformanceBonus: 250,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    description: "Consistent referral activity unlocking monthly performance bonuses.",
  },
  {
    key: "GROWTH",
    name: "Growth",
    minReferrals: 10,
    maxReferrals: 19,
    commissionPercentage: 50,
    monthlyPerformanceBonus: 750,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "High impact community referral partner with enhanced milestone rewards.",
  },
  {
    key: "PRO",
    name: "Pro",
    minReferrals: 20,
    maxReferrals: 39,
    commissionPercentage: 50,
    monthlyPerformanceBonus: 1500,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    description: "Institutional & seasoned wellness leaders driving strong transformation volume.",
  },
  {
    key: "ELITE",
    name: "Elite",
    minReferrals: 40,
    maxReferrals: null,
    commissionPercentage: 50,
    monthlyPerformanceBonus: 3000,
    badgeColor: "bg-yellow-100 text-yellow-900 border-yellow-400 font-semibold",
    description: "Top-tier corporate & regional wellness leaders enjoying VIP benefits & maximum bonuses.",
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-free-reset",
    name: "FREE 5-Day Mind Reset Challenge",
    tagline: "Break free from stress and rediscover mental stillness in 15 mins daily.",
    description:
      "A transformative zero-cost 5-day guided experiential challenge featuring daily mindfulness audio, breathwork, and evening reflection circles.",
    price: 0,
    billingType: "free",
    duration: "5 Days",
    category: "5-Day Challenge",
    partnerCommissionPercentage: 0,
    partnerActivationReward: 49,
    partnerBonus: 0,
    isActive: true,
    eligibility: "Open to all prospective participants",
    referralRules: "Partner receives ₹49 Activation Reward upon verified attendance.",
  },
  {
    id: "prod-basic-shift",
    name: "Basic Shift",
    tagline: "Foundational mindset conditioning & daily emotional grounding.",
    description:
      "Weekly guided live resets, digital inner peace workbook, access to the Path to Inner Peace community sanctuary, and audio meditations.",
    price: 199,
    billingType: "monthly",
    duration: "Monthly Subscription",
    category: "Mind Mastery",
    partnerCommissionPercentage: 50,
    partnerActivationReward: 0,
    isActive: true,
    eligibility: "Participants completing the 5-Day Mind Reset or direct referral",
    referralRules: "Standard 50% commission (₹99.50/month) credited on each billing cycle.",
  },
  {
    id: "prod-mind-mastery",
    name: "Mind Mastery",
    tagline: "Deep neuro-emotional reprogramming and holistic stress resilience.",
    description:
      "Bi-weekly live masterclasses with senior counselors, custom sound frequency therapies, subconscious alignment techniques, and personalized stress trackers.",
    price: 499,
    billingType: "monthly",
    duration: "Monthly Subscription",
    category: "Stress Management",
    partnerCommissionPercentage: 50,
    partnerActivationReward: 0,
    isActive: true,
    eligibility: "Individuals seeking dedicated mindfulness practice",
    referralRules: "Standard 50% commission (₹249.50/month) credited on verified collection.",
  },
  {
    id: "prod-inner-elite",
    name: "Inner Transformation Elite",
    tagline: "The premier executive transformation sanctuary & 1-on-1 mentorship.",
    description:
      "Comprehensive holistic wellness mentorship with private counseling sessions, personalized cognitive blueprint, VIP retreat invitations, and corporate leadership wellness modules.",
    price: 1499,
    billingType: "monthly",
    duration: "Monthly Subscription",
    category: "Personal Transformation",
    partnerCommissionPercentage: 50,
    partnerActivationReward: 0,
    isActive: true,
    eligibility: "Executives, leaders, and high-commitment seekers",
    referralRules: "Standard 50% commission (₹749.50/month) credited on verified collection.",
  },
  {
    id: "prod-executive-stress",
    name: "Executive Stress Protocol",
    tagline: "Targeted burnout recovery for high-pressure corporate professionals.",
    description:
      "Intensive 4-week protocol combining somatic breathing, cortisol balance education, and workplace cognitive agility drills.",
    price: 2999,
    billingType: "one_time",
    duration: "4 Weeks Intensive",
    category: "Corporate Wellness",
    partnerCommissionPercentage: 50,
    partnerActivationReward: 0,
    isActive: true,
    eligibility: "Corporate executives and professionals",
    referralRules: "50% commission (₹1,499.50) upon enrollment verification.",
  },
];

export const EMPTY_GENUINE_PARTNER: Partner = {
  id: "P2IP-PT-NEW",
  code: "PENDING_REGISTRATION",
  name: "Authenticating Partner",
  organisation: "Independent Practice",
  partnerType: "Individual Referral Partner",
  mobile: "",
  email: "",
  location: "India",
  joiningDate: new Date().toISOString().split("T")[0],
  level: "STARTER",
  status: "ACTIVE",
  referralUrl: "https://pathtoinnerpeace.in",
  totalReferrals: 0,
  currentMonthlyReferrals: 0,
  totalCustomers: 0,
  lifetimeRevenue: 0,
  lifetimeCommission: 0,
  monthlyTarget: 10,
  password: "",
  twoStepAuthPin: "",
  twoStepAuthEnabled: true,
  bankDetails: {
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "SAVINGS",
    upiId: "",
    razorpayId: "",
    isVerified: false,
  },
  termsAccepted: true,
  termsAcceptedAt: new Date().toISOString(),
  termsVersion: "v1.3",
};

// -------------------------------------------------------------
// ZERO FAKE DATA LAYER: ALL INITIAL ARRAYS ARE EMPTY IN PRODUCTION
// -------------------------------------------------------------
export const INITIAL_PARTNERS: Partner[] = [];
export const INITIAL_LEADS: Lead[] = [];
export const INITIAL_COMMISSIONS: Commission[] = [];
export const INITIAL_CLIENT_NODES: ClientReferralNode[] = [];
export const INITIAL_PAYOUTS: PayoutRecord[] = [];
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [];
export const INITIAL_FOLLOWUPS: FollowupTask[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-mind-reset-sept",
    name: "5-Day Mind Reset Challenge Booster",
    description: "Refer 5 participants to the upcoming Free Mind Reset Challenge cohort and earn an extra ₹500 bonus.",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    targetReferrals: 5,
    bonusAmount: 500,
    eligibleProgramIds: ["prod-free-reset"],
    isActive: true,
    badgeText: "High Impact",
  },
];

export const INITIAL_MARKETING_ASSETS: MarketingAsset[] = [
  {
    id: "asset-1",
    title: "5-Day Mind Reset Challenge - Square Instagram Poster",
    category: "5-Day Mind Reset",
    type: "Instagram Post",
    description: "High-contrast emerald & gold aesthetic visual with key benefit bullet points.",
    copyText: `🌿 Discover the Power of Stillness.
Join Path to Inner Peace for the FREE 5-Day Mind Reset Challenge.
✨ 15 Minutes a Day
✨ Guided Breathwork & Mental Clarity
✨ 100% Complimentary

Claim your free spot using my invite link below:
{{PARTNER_REFERRAL_URL}}`,
    previewGradient: "from-emerald-900 via-emerald-800 to-teal-950",
    dimensions: "1080 x 1080 px",
    downloadsCount: 0,
  },
  {
    id: "asset-2",
    title: "WhatsApp Personal Transformation Invite Template",
    category: "5-Day Mind Reset",
    type: "WhatsApp Message",
    description: "Gentle, non-intrusive personal invitation copy tailored for 1-on-1 sharing.",
    copyText: `Namaste 🙏

I wanted to personally share an initiative by Path to Inner Peace: the FREE 5-Day Mind Reset Challenge.

It takes just 15 minutes each evening with certified breathwork and stress-relief guidance. It's completely complimentary.

Here is my direct invitation link to reserve your spot:
{{PARTNER_REFERRAL_URL}}

Wishing you inner calm and mental clarity!`,
    downloadsCount: 0,
  },
  {
    id: "asset-3",
    title: "Executive Stress Protocol - LinkedIn Thought Leadership",
    category: "Corporate Wellness",
    type: "LinkedIn Post",
    description: "Executive-grade perspective on executive cognitive fatigue and sustainable high performance.",
    copyText: `Burnout isn't solved by another vacation. It's addressed by resetting your nervous system.

Path to Inner Peace offers structured neuro-emotional resilience and mindfulness programs for leaders.

Learn more or book an introductory session here:
{{PARTNER_REFERRAL_URL}}`,
    previewGradient: "from-slate-900 via-emerald-950 to-stone-900",
    dimensions: "1200 x 627 px",
    downloadsCount: 0,
  },
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: "auto-1",
    title: "Auto-Create Welcome Follow-up",
    triggerEvent: "LEAD_CREATED",
    actionResult: "Schedule contact reminder within 24 hours and assign to lead counselor.",
    isActive: true,
    description: "Ensures every new referral is contacted swiftly while interest is highest.",
  },
  {
    id: "auto-2",
    title: "Post-Challenge Paid Conversion Follow-up",
    triggerEvent: "CHALLENGE_COMPLETED",
    actionResult: "Trigger automated paid program consultation offer and notify referring partner.",
    isActive: true,
    description: "Capitalizes on high engagement immediately after completing the 5-Day Reset.",
  },
  {
    id: "auto-3",
    title: "Real-time Commission Creation",
    triggerEvent: "PAYMENT_SUCCESSFUL",
    actionResult: "Calculate 50% revenue commission, create pending ledger entry, and notify partner.",
    isActive: true,
    description: "Instant financial transparency for all partner-attributed collections.",
  },
  {
    id: "auto-4",
    title: "Refund Commission Auto-Reversal",
    triggerEvent: "REFUND_RECEIVED",
    actionResult: "Reverse corresponding commission entry with full audit log and deduct from wallet.",
    isActive: true,
    description: "Prevents commission leakage during the 7-day money-back window.",
  },
  {
    id: "auto-5",
    title: "Monthly Target Bonus Auto-Credit",
    triggerEvent: "PARTNER_REACHED_TARGET",
    actionResult: "Auto-credit monthly performance bonus (e.g. ₹1,500 PRO Bonus) to partner wallet.",
    isActive: true,
    description: "Rewards high-performing partners immediately when target is achieved.",
  },
];

export const INITIAL_BUSINESS_RULES: BusinessRulesSettings = {
  defaultCommissionPercentage: 50,
  challengeActivationReward: 49,
  clientInnerCircleCredit: 49,
  partnerInnerCircleCredit: 49,
  validationPeriodDays: 7,
  leaderboardVisible: true,
  duplicateProtectionStrict: true,
  termsVersion: "v1.3",
  partnerTermsContent: PARTNER_TERMS_FULL_TEXT,
};
