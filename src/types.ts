/**
 * P2IP PartnerSphere™ - Domain & State Types
 * Path to Inner Peace (www.pathtoinnerpeace.in)
 */

export type UserRole = "partner" | "admin";

export type PartnerLevelKey = "STARTER" | "BUILDER" | "GROWTH" | "PRO" | "ELITE";

export type PartnerStatus = "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED";

export type PartnerType =
  | "Gym & Fitness Studio"
  | "Fitness Trainer"
  | "Yoga Instructor"
  | "School"
  | "College & University"
  | "Corporate / HR"
  | "Psychologist / Counsellor"
  | "Wellness & Life Coach"
  | "Apartment / Community Manager"
  | "Social Club"
  | "NGO / Foundation"
  | "Influencer / Creator"
  | "Existing P2IP Client"
  | "Individual Referral Partner"
  | "Corporate Channel Partner";

export interface Partner {
  id: string; // e.g. "P2IP-PT-00123"
  code: string; // e.g. "P2IP123"
  name: string;
  organisation: string;
  partnerType: PartnerType;
  mobile: string;
  email: string;
  location: string;
  avatarUrl?: string;
  joiningDate: string;
  level: PartnerLevelKey;
  status: PartnerStatus;
  referralUrl: string; // https://pathtoinnerpeace.in/r/P2IP123
  totalReferrals: number;
  currentMonthlyReferrals: number;
  totalCustomers: number;
  lifetimeRevenue: number;
  lifetimeCommission: number;
  monthlyTarget: number;
  customCommissionRate?: number; // Override if specified by admin (e.g. 50%)
  bankDetails?: {
    upiId?: string;
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    accountType?: "SAVINGS" | "CURRENT";
    razorpayId?: string; // Razorpay Linked Account / Contact / VPA ID
    isVerified?: boolean;
    verifiedAt?: string;
  };
  termsAccepted: boolean;
  termsAcceptedAt?: string;
  termsVersion?: string;
  password?: string;
  twoStepAuthPin?: string;
  twoStepAuthEnabled?: boolean;
  panNumber?: string;
  aadhaarNumber?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  role: UserRole | "public_referral";
  partnerId?: string;
  partnerCode?: string;
  partnerName?: string;
  loginTimestamp?: string;
}

export type BillingType = "free" | "monthly" | "quarterly" | "annual" | "one_time";

export type ProgramCategory =
  | "5-Day Challenge"
  | "Mind Mastery"
  | "Stress Management"
  | "Meditation & Mindfulness"
  | "Emotional Well-being"
  | "Relationship Wellness"
  | "Career Clarity"
  | "Corporate Wellness"
  | "Personal Transformation"
  | "Inner Revolution";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in INR (₹)
  billingType: BillingType;
  duration: string;
  category: ProgramCategory;
  partnerCommissionPercentage: number; // e.g. 50%
  partnerActivationReward?: number; // e.g. ₹49 for free challenge
  partnerBonus?: number;
  isActive: boolean;
  eligibility?: string;
  referralRules?: string;
}

export type ReferralStatus =
  | "NEW"
  | "CONTACTED"
  | "REGISTERED"
  | "CHALLENGE_ATTENDED"
  | "CHALLENGE_COMPLETED"
  | "PAID_CUSTOMER"
  | "RENEWAL"
  | "LOST";

export type AttributionStatus = "NORMAL" | "DUPLICATE_FLAGGED" | "UNDER_REVIEW" | "RESOLVED";

export type AttributionDecision =
  | "EXISTING_CUSTOMER"
  | "FIRST_PARTNER"
  | "LAST_PARTNER"
  | "MANUAL"
  | "NO_COMMISSION";

export interface DuplicateMatchInfo {
  detectedAt: string;
  matchedField: "mobile" | "email" | "both";
  existingLeadId: string;
  originalPartnerId: string;
  originalPartnerName: string;
  originalReferralDate: string;
  newPartnerId: string;
  newPartnerName: string;
  adminDecision?: AttributionDecision;
  decisionNotes?: string;
  decisionBy?: string;
  decisionDate?: string;
}

export interface Lead {
  id: string; // e.g. "P2IP-REF-000183"
  clientName: string;
  mobile: string;
  email: string;
  location: string;
  interestedProgramId: string;
  interestedProgramName: string;
  referralSource: string;
  notes?: string;
  preferredContactTime?: string;
  consent: boolean;
  partnerId: string;
  partnerName: string;
  referringClientId?: string; // If referred through Inner Circle client loop
  status: ReferralStatus;
  createdAt: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  followUpNote?: string;
  attributionStatus: AttributionStatus;
  duplicateInfo?: DuplicateMatchInfo;
  paidAmount?: number;
  commissionEarned?: number;
  convertedDate?: string;
  owner?: string; // P2IP Counselor / Coordinator
}

export type CommissionStatus =
  | "PENDING"
  | "APPROVED"
  | "PAYABLE"
  | "PAID"
  | "REVERSED"
  | "CANCELLED";

export interface Commission {
  id: string; // e.g. "P2IP-COM-00021"
  partnerId: string;
  partnerName: string;
  leadId: string;
  clientName: string;
  productId: string;
  productName: string;
  collectedRevenue: number;
  commissionPercentage: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: string;
  approvedAt?: string;
  payableAt?: string;
  paidAt?: string;
  reversedAt?: string;
  reversalReason?: string;
  payoutRefNumber?: string;
  isInnerCircleCredit?: boolean;
}

export interface WalletSummary {
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  paidEarnings: number;
  reversedEarnings: number;
}

export interface PartnerLevelConfig {
  key: PartnerLevelKey;
  name: string;
  minReferrals: number;
  maxReferrals: number | null;
  commissionPercentage: number;
  monthlyPerformanceBonus: number; // in INR
  badgeColor: string;
  description: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetReferrals: number;
  bonusAmount: number;
  eligibleProgramIds: string[];
  eligiblePartnerTypes?: PartnerType[];
  isActive: boolean;
  badgeText?: string;
}

export interface ClientReferralNode {
  clientId: string;
  clientName: string;
  inviteCode: string;
  inviteUrl: string;
  originalPartnerId: string;
  originalPartnerName: string;
  joinedAt: string;
  innerPeaceCreditBalance: number; // ₹49 credits
  subReferrals: {
    referredClientId: string;
    referredClientName: string;
    referredDate: string;
    status: ReferralStatus;
    rewardPaidToClient: boolean;
    rewardPaidToPartner: boolean;
  }[];
}

export type AssetCategory =
  | "5-Day Mind Reset"
  | "Stress Management"
  | "Mind Mastery"
  | "Corporate Wellness"
  | "Meditation & Mindfulness"
  | "Relationship Wellness"
  | "Career Clarity"
  | "Personal Transformation"
  | "Inner Revolution Programs";

export type AssetType =
  | "Instagram Post"
  | "Instagram Story"
  | "WhatsApp Poster"
  | "Facebook Post"
  | "LinkedIn Post"
  | "Corporate Brochure"
  | "Digital Flyer"
  | "QR Poster"
  | "WhatsApp Message"
  | "Email Template";

export interface MarketingAsset {
  id: string;
  title: string;
  category: AssetCategory;
  type: AssetType;
  description: string;
  imageUrl?: string;
  copyText?: string;
  previewGradient?: string;
  dimensions?: string;
  downloadsCount: number;
}

export type FollowupPriority = "HIGH" | "MEDIUM" | "LOW";

export interface FollowupTask {
  id: string;
  leadId: string;
  leadName: string;
  partnerId: string;
  title: string;
  dueDate: string;
  priority: FollowupPriority;
  status: "PENDING" | "COMPLETED";
  completedAt?: string;
  actionType: "CALL" | "WHATSAPP" | "EMAIL" | "MEETING";
}

export interface AutomationRule {
  id: string;
  title: string;
  triggerEvent:
    | "LEAD_CREATED"
    | "CHALLENGE_COMPLETED"
    | "PAYMENT_SUCCESSFUL"
    | "REFUND_RECEIVED"
    | "PARTNER_REACHED_TARGET"
    | "SUBSCRIPTION_EXPIRING";
  actionResult: string;
  isActive: boolean;
  description: string;
}

export interface AppNotification {
  id: string;
  recipientRole: "partner" | "admin" | "all";
  recipientPartnerId?: string;
  title: string;
  message: string;
  type: "referral" | "commission" | "bonus" | "lead" | "campaign" | "alert";
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface PayoutRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  payableAmount: number;
  approvedAmount: number;
  paidAmount: number;
  payoutDate?: string;
  paymentMethod: "UPI" | "NEFT / IMPS" | "Bank Transfer" | "Razorpay Instant Payout";
  transactionRef?: string;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
  processedBy?: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  entityType: "COMMISSION" | "ATTRIBUTION" | "PARTNER_LEVEL" | "BONUS" | "PAYOUT" | "PRODUCT" | "LEAD";
  entityId: string;
  oldValue: string;
  newValue: string;
  reason?: string;
}

export interface BusinessRulesSettings {
  defaultCommissionPercentage: number; // 50%
  challengeActivationReward: number; // ₹49
  clientInnerCircleCredit: number; // ₹49
  partnerInnerCircleCredit: number; // ₹49
  validationPeriodDays: number; // 7 days refund buffer
  leaderboardVisible: boolean;
  duplicateProtectionStrict: boolean;
  termsVersion: string;
  partnerTermsContent: string;
}
