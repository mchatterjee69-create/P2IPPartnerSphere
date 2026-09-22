import { db } from "./db";

export interface PartnerRegistrationInput {
  id?: string;
  fullName?: string;
  name?: string;
  organisation?: string;
  organization?: string;
  partnerType?: string;
  mobile: string;
  email: string;
  city?: string;
  state?: string;
  location?: string;
  password?: string;
  twoStepPin?: string;
  twoStepAuthPin?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  code?: string;
  referralCode?: string;
  consent?: boolean;
  bankDetails?: {
    upiId?: string;
    accountHolderName?: string;
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    accountType?: "SAVINGS" | "CURRENT";
  };
  preferredRate?: number;
  notes?: string;
}

export interface CreateReferralInput {
  partnerId: string;
  partnerName?: string;
  clientName: string;
  mobile: string;
  email: string;
  location?: string;
  programId: string;
  programName?: string;
  source?: string;
  notes?: string;
  preferredContactTime?: string;
  consent?: boolean;
  referringClientId?: string;
}

export interface CustomerPaymentInput {
  customerId?: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
  partnerId?: string;
  referralId?: string;
  productId: string;
  productName?: string;
  amount?: number;
  amountPaid?: number;
  gateway?: "MANUAL_VERIFIED" | "RAZORPAY" | "UPI";
  gatewayTransactionId?: string;
  paymentDate?: string;
}

export interface PayoutAccountInput {
  partnerId: string;
  method: "BANK_ACCOUNT" | "UPI";
  accountHolderName: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType?: "SAVINGS" | "CURRENT";
  upiId?: string;
  isPrimary?: boolean;
}

export interface ManualPayoutExecutionInput {
  payoutId: string;
  actualPaidAmount: number;
  paymentMethod: "UPI" | "BANK_TRANSFER" | "RAZORPAYX";
  utr: string;
  paymentDate?: string;
  notes?: string;
  proofUrl?: string;
  adminUser?: string;
}

// ----------------------------------------------------
// SEQUENTIAL ID GENERATORS
// ----------------------------------------------------
function getNextReferralId(): string {
  const row = db.prepare("SELECT COUNT(*) as count FROM referrals").get() as { count: number };
  const nextNum = (row?.count || 0) + 1;
  return `P2IP-REF-${new Date().getFullYear()}-${String(nextNum).padStart(6, "0")}`;
}

function getNextPayoutId(): string {
  const row = db.prepare("SELECT COUNT(*) as count FROM payouts").get() as { count: number };
  const nextNum = (row?.count || 0) + 1;
  return `P2IP-PAY-${new Date().getFullYear()}-${String(nextNum).padStart(6, "0")}`;
}

function getNextPaymentId(): string {
  const row = db.prepare("SELECT COUNT(*) as count FROM payments").get() as { count: number };
  const nextNum = (row?.count || 0) + 1;
  return `P2IP-PAYMENT-${new Date().getFullYear()}-${String(nextNum).padStart(6, "0")}`;
}

function getNextCommissionId(): string {
  const row = db.prepare("SELECT COUNT(*) as count FROM commissions").get() as { count: number };
  const nextNum = (row?.count || 0) + 1;
  return `P2IP-COM-${new Date().getFullYear()}-${String(nextNum).padStart(6, "0")}`;
}

function getNextTransactionId(): string {
  const row = db.prepare("SELECT COUNT(*) as count FROM commission_transactions").get() as { count: number };
  const nextNum = (row?.count || 0) + 1;
  return `TXN-${new Date().getFullYear()}-${String(nextNum).padStart(6, "0")}`;
}

function generatePartnerCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4) || "P2IP";
  const row = db.prepare("SELECT COUNT(*) as count FROM partners").get() as { count: number };
  return `${clean}${100 + (row?.count || 0) + 1}`;
}

// ----------------------------------------------------
// WALLET LEDGER CALCULATION (SINGLE SOURCE OF TRUTH)
// ----------------------------------------------------
export function getPartnerWallet(partnerId: string) {
  // Sum of all valid commission additions
  const commRow = db.prepare(`
    SELECT COALESCE(SUM(commission_amount), 0) as total
    FROM commissions
    WHERE partner_id = ? AND status != 'REVERSED'
  `).get(partnerId) as { total: number };

  const totalEarned = commRow?.total || 0;

  // Sum of pending / approved (not yet marked payable)
  const pendingRow = db.prepare(`
    SELECT COALESCE(SUM(commission_amount), 0) as pending
    FROM commissions
    WHERE partner_id = ? AND status IN ('PENDING', 'APPROVED')
  `).get(partnerId) as { pending: number };
  const pendingBalance = pendingRow?.pending || 0;

  // Sum of all paid payouts
  const paidRow = db.prepare(`
    SELECT COALESCE(SUM(actual_paid_amount), 0) as paid
    FROM payouts
    WHERE partner_id = ? AND status = 'PAID'
  `).get(partnerId) as { paid: number };
  const lifetimePaid = paidRow?.paid || 0;

  // Sum of pending payout reservations (requested, under review, approved, processing)
  const reservedRow = db.prepare(`
    SELECT COALESCE(SUM(requested_amount), 0) as reserved
    FROM payouts
    WHERE partner_id = ? AND status IN ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING')
  `).get(partnerId) as { reserved: number };
  const reservedForPayout = reservedRow?.reserved || 0;

  // Reversals
  const reversedRow = db.prepare(`
    SELECT COALESCE(SUM(commission_amount), 0) as reversed
    FROM commissions
    WHERE partner_id = ? AND status = 'REVERSED'
  `).get(partnerId) as { reversed: number };
  const lifetimeReversed = reversedRow?.reversed || 0;

  // Available balance is:
  // (Total approved/payable earnings) - (Paid Payouts) - (Reserved Payouts Currently in Flight)
  // Let's ensure non-negative
  const grossAvailable = Math.max(0, totalEarned - lifetimePaid - reservedForPayout);

  return {
    partnerId,
    availableBalance: grossAvailable,
    pendingBalance,
    lifetimeEarned: totalEarned,
    lifetimePaid,
    lifetimeReversed,
    reservedForPayout,
  };
}

// ----------------------------------------------------
// ADMIN COMMERCIAL METRICS (ZERO FAKE DATA)
// ----------------------------------------------------
export function getAdminMetrics() {
  const totalPartnersRow = db.prepare("SELECT COUNT(*) as count FROM partners").get() as { count: number };
  const totalPartners = totalPartnersRow?.count || 0;

  const activePartnersRow = db.prepare("SELECT COUNT(*) as count FROM partners WHERE status = 'ACTIVE'").get() as { count: number };
  const activePartners = activePartnersRow?.count || 0;

  const newPartnersRow = db.prepare("SELECT COUNT(*) as count FROM partners WHERE joining_date >= date('now', '-90 days')").get() as { count: number };
  const newPartners = newPartnersRow?.count || 0;

  const totalReferralsRow = db.prepare("SELECT COUNT(*) as count FROM referrals").get() as { count: number };
  const totalReferrals = totalReferralsRow?.count || 0;

  const challengeRegRow = db.prepare(`
    SELECT COUNT(*) as count FROM referrals
    WHERE program_id = 'prod-free-reset' OR status IN ('REGISTERED', 'CHALLENGE_ATTENDED', 'CHALLENGE_COMPLETED', 'PAID_CUSTOMER', 'RENEWAL')
  `).get() as { count: number };
  const challengeRegistrations = challengeRegRow?.count || 0;

  const paidCustomersRow = db.prepare(`
    SELECT COUNT(DISTINCT customer_email) as count FROM payments WHERE payment_status = 'SUCCESS'
  `).get() as { count: number };
  const paidCustomers = paidCustomersRow?.count || 0;

  // Financials from actual verified payments
  const revenueRow = db.prepare(`
    SELECT 
      COALESCE(SUM(amount), 0) as gross,
      COALESCE(SUM(refunded_amount), 0) as refunds
    FROM payments
    WHERE payment_status = 'SUCCESS'
  `).get() as { gross: number; refunds: number };
  const grossRevenue = revenueRow?.gross || 0;
  const refunds = revenueRow?.refunds || 0;
  const netRevenue = grossRevenue - refunds;

  // Partner commission liabilities
  const commRow = db.prepare(`
    SELECT 
      COALESCE(SUM(commission_amount), 0) as totalLiability,
      COALESCE(SUM(CASE WHEN status IN ('PENDING', 'APPROVED') THEN commission_amount ELSE 0 END), 0) as pending,
      COALESCE(SUM(CASE WHEN status = 'PAYABLE' THEN commission_amount ELSE 0 END), 0) as payable
    FROM commissions
    WHERE status != 'REVERSED'
  `).get() as { totalLiability: number; pending: number; payable: number };
  const partnerCommissionLiability = commRow?.totalLiability || 0;
  const pendingCommission = commRow?.pending || 0;
  const payableCommission = commRow?.payable || 0;

  // Payout totals
  const payoutRow = db.prepare(`
    SELECT 
      COALESCE(SUM(CASE WHEN status = 'PAID' THEN actual_paid_amount ELSE 0 END), 0) as paidOut,
      COALESCE(SUM(CASE WHEN status IN ('REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING') THEN requested_amount ELSE 0 END), 0) as pendingPayouts,
      COUNT(CASE WHEN status = 'PAID' THEN 1 END) as paidCount,
      COUNT(CASE WHEN status IN ('REQUESTED', 'UNDER_REVIEW') THEN 1 END) as pendingCount,
      COUNT(CASE WHEN status = 'PROCESSING' THEN 1 END) as processingCount,
      COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failedCount,
      COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejectedCount
    FROM payouts
  `).get() as {
    paidOut: number;
    pendingPayouts: number;
    paidCount: number;
    pendingCount: number;
    processingCount: number;
    failedCount: number;
    rejectedCount: number;
  };

  const paidPayouts = payoutRow?.paidOut || 0;
  const pendingPayoutAmount = payoutRow?.pendingPayouts || 0;
  const outstandingPartnerPayable = Math.max(0, partnerCommissionLiability - paidPayouts);
  const netP2IPRevenue = grossRevenue - partnerCommissionLiability;

  const conversionRate = totalReferrals > 0 ? ((paidCustomers / totalReferrals) * 100).toFixed(1) : "0";

  // Attention items
  const duplicateAlertsRow = db.prepare("SELECT COUNT(*) as count FROM referrals WHERE attribution_status = 'DUPLICATE_FLAGGED'").get() as { count: number };
  const duplicateAlerts = duplicateAlertsRow?.count || 0;

  return {
    totalPartners,
    activePartners,
    newPartners,
    activeRate: totalPartners > 0 ? Math.round((activePartners / totalPartners) * 100) : 0,
    totalReferrals,
    challengeRegistrations,
    paidCustomers,
    grossRevenue,
    refunds,
    netRevenue,
    partnerCommissionLiability,
    pendingCommission,
    payableCommission,
    paidPayouts,
    pendingPayoutAmount,
    outstandingPartnerPayable,
    netP2IPRevenue,
    overallConversionRate: conversionRate,
    duplicateAlerts,
    payoutCounts: {
      pending: payoutRow?.pendingCount || 0,
      processing: payoutRow?.processingCount || 0,
      paid: payoutRow?.paidCount || 0,
      failed: payoutRow?.failedCount || 0,
      rejected: payoutRow?.rejectedCount || 0,
    },
  };
}

// ----------------------------------------------------
// PARTNER INDIVIDUAL METRICS
// ----------------------------------------------------
export function getPartnerMetrics(partnerId: string) {
  const partner = db.prepare("SELECT * FROM partners WHERE id = ?").get(partnerId) as any;
  if (!partner) return null;

  const referralsCountRow = db.prepare("SELECT COUNT(*) as count FROM referrals WHERE partner_id = ?").get(partnerId) as { count: number };
  const totalReferrals = referralsCountRow?.count || 0;

  const challengeRegRow = db.prepare(`
    SELECT COUNT(*) as count FROM referrals 
    WHERE partner_id = ? AND (program_id = 'prod-free-reset' OR status IN ('REGISTERED', 'CHALLENGE_ATTENDED', 'CHALLENGE_COMPLETED', 'PAID_CUSTOMER'))
  `).get(partnerId) as { count: number };
  const challengeRegistrations = challengeRegRow?.count || 0;

  const challengeAttendedRow = db.prepare(`
    SELECT COUNT(*) as count FROM referrals 
    WHERE partner_id = ? AND status IN ('CHALLENGE_ATTENDED', 'CHALLENGE_COMPLETED', 'PAID_CUSTOMER')
  `).get(partnerId) as { count: number };
  const challengeAttended = challengeAttendedRow?.count || 0;

  const paidConversionsRow = db.prepare(`
    SELECT COUNT(*) as count FROM referrals 
    WHERE partner_id = ? AND status IN ('PAID_CUSTOMER', 'RENEWAL')
  `).get(partnerId) as { count: number };
  const paidConversions = paidConversionsRow?.count || 0;

  const revenueRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE partner_id = ? AND payment_status = 'SUCCESS'
  `).get(partnerId) as { total: number };
  const totalRevenueGenerated = revenueRow?.total || 0;

  const wallet = getPartnerWallet(partnerId);

  const target = partner.monthly_target || 20;
  const progressPercent = target > 0 ? Math.min(100, Math.round((totalReferrals / target) * 100)) : 0;
  const referralsNeeded = Math.max(0, target - totalReferrals);

  return {
    partner,
    totalReferrals,
    challengeRegistrations,
    challengeAttended,
    paidConversions,
    totalRevenueGenerated,
    wallet,
    monthlyTarget: target,
    progressPercent,
    referralsNeeded,
  };
}

export function formatPartnerToCamel(p: any) {
  if (!p) return null;
  const wallet = getPartnerWallet(p.id);
  const refCount = db.prepare("SELECT COUNT(*) as count FROM referrals WHERE partner_id = ?").get(p.id) as { count: number };
  const custCount = db.prepare("SELECT COUNT(DISTINCT referral_id) as count FROM payments WHERE partner_id = ? AND payment_status = 'SUCCESS'").get(p.id) as { count: number };
  const revRow = db.prepare("SELECT COALESCE(SUM(amount), 0) as rev FROM payments WHERE partner_id = ? AND payment_status = 'SUCCESS'").get(p.id) as { rev: number };

  // Fetch payout account / bank details if available
  const bankRow = db.prepare("SELECT * FROM payout_accounts WHERE partner_id = ? ORDER BY is_primary DESC LIMIT 1").get(p.id) as any;

  return {
    id: p.id,
    code: p.code,
    name: p.name,
    organisation: p.organisation || p.name,
    partnerType: p.partner_type || "Individual Referral Partner",
    mobile: p.mobile,
    email: p.email,
    location: p.location || "India",
    joiningDate: p.joining_date || (p.created_at ? p.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
    level: p.level || "STARTER",
    status: p.status || "ACTIVE",
    referralUrl: p.referral_url || `https://pathtoinnerpeace.in/r/${p.code}`,
    totalReferrals: refCount?.count || 0,
    currentMonthlyReferrals: refCount?.count || 0,
    totalCustomers: custCount?.count || 0,
    lifetimeRevenue: revRow?.rev || 0,
    lifetimeCommission: wallet.lifetimeEarned,
    availableBalance: wallet.availableBalance,
    pendingCommission: wallet.pendingBalance,
    paidCommission: wallet.lifetimePaid,
    monthlyTarget: p.monthly_target || 10,
    customCommissionRate: p.custom_commission_rate ?? undefined,
    password: p.password || "p2ip@partner",
    twoStepAuthPin: p.two_step_pin || "123456",
    twoStepAuthEnabled: p.two_step_enabled === 1 || p.two_step_enabled === true,
    termsAccepted: p.terms_accepted === 1 || p.terms_accepted === true,
    termsAcceptedAt: p.terms_accepted_at || p.created_at || new Date().toISOString(),
    termsVersion: p.terms_version || "v1.3",
    panNumber: p.pan_number || undefined,
    aadhaarNumber: p.aadhaar_number || undefined,
    bankDetails: {
      accountHolderName: bankRow?.account_holder_name || p.name,
      bankName: bankRow?.bank_name || "",
      accountNumber: bankRow?.account_number_raw || bankRow?.account_number_masked || "",
      ifscCode: bankRow?.ifsc_code || "",
      accountType: bankRow?.account_type || "SAVINGS",
      upiId: bankRow?.upi_id || "",
      razorpayId: "",
      isVerified: bankRow?.is_verified === 1,
    },
  };
}

// ----------------------------------------------------
// PARTNER CRUD & AUTH
// ----------------------------------------------------
export function registerPartner(input: PartnerRegistrationInput) {
  const partnerName = (input.name || input.fullName || "Partner").trim();
  const cleanMobile = (input.mobile || "").replace(/[^0-9]/g, "");
  const cleanEmail = (input.email || "").trim().toLowerCase();
  const cleanCode = (input.code || input.referralCode || "").trim().toUpperCase();
  const cleanPan = input.panNumber ? input.panNumber.trim().toUpperCase() : "";
  const cleanAadhaar = input.aadhaarNumber ? input.aadhaarNumber.replace(/[^0-9]/g, "") : "";

  // Strict duplicate partner registration check: analyze email, normalized mobile (last 10 digits), code, PAN
  const allPartners = db.prepare("SELECT id, code, name, mobile, email, pan_number, aadhaar_number FROM partners").all() as any[];
  const existing = allPartners.find((p) => {
    const pMobile = (p.mobile || "").replace(/[^0-9]/g, "");
    const matchMobile = cleanMobile.length >= 10 && (pMobile.endsWith(cleanMobile.slice(-10)) || cleanMobile.endsWith(pMobile.slice(-10)));
    const matchEmail = cleanEmail.length > 3 && (p.email || "").trim().toLowerCase() === cleanEmail;
    const matchCode = cleanCode && (p.code || "").toUpperCase() === cleanCode;
    const matchPan = cleanPan && (p.pan_number || "").toUpperCase() === cleanPan;
    const matchAadhaar = cleanAadhaar && (p.aadhaar_number || "").replace(/[^0-9]/g, "") === cleanAadhaar;
    return matchMobile || matchEmail || matchCode || matchPan || matchAadhaar;
  });

  if (existing) {
    throw new Error(
      `Duplicate registration prohibited: A partner account is already registered with this mobile number or email under Partner Code: ${existing.code} (${existing.name}). Once your unique partner code is generated, you can log in directly and cannot register once again.`
    );
  }

  const countRow = db.prepare("SELECT COUNT(*) as count FROM partners").get() as { count: number };
  const partnerId = input.id && input.id.startsWith("P2IP-PT-")
    ? input.id
    : `P2IP-PT-${String(Number(countRow?.count || 0) + 1).padStart(4, "0")}`;

  const code = cleanCode || generatePartnerCode(partnerName);
  const location = input.location || (input.city ? `${input.city}, ${input.state || "India"}` : "India");
  const referralUrl = `https://pathtoinnerpeace.in/r/${code}`;
  const now = new Date().toISOString();
  const org = (input.organisation || input.organization || "Independent Practice").trim();
  const pType = input.partnerType || "Individual Referral Partner";
  const password = (input.password || "p2ip@partner").trim();
  const twoStepPin = (input.twoStepAuthPin || input.twoStepPin || "123456").trim();
  const status = "ACTIVE";

  db.prepare(`
    INSERT INTO partners (
      id, code, name, organisation, partner_type, mobile, email, location,
      joining_date, level, status, referral_url, monthly_target, password,
      two_step_pin, two_step_enabled, terms_accepted, terms_accepted_at,
      terms_version, pan_number, aadhaar_number, custom_commission_rate, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'STARTER', ?, ?, 10, ?, ?, 1, 1, ?, 'v1.3', ?, ?, ?, ?)
  `).run(
    partnerId,
    code,
    partnerName,
    org,
    pType,
    input.mobile,
    input.email,
    location,
    now.split("T")[0],
    status,
    referralUrl,
    password,
    twoStepPin,
    now,
    cleanPan || null,
    cleanAadhaar || null,
    input.preferredRate ?? null,
    now
  );

  // If bank details provided, store in payout_accounts
  if (input.bankDetails && (input.bankDetails.upiId || input.bankDetails.accountNumber)) {
    const isUpi = Boolean(input.bankDetails.upiId && !input.bankDetails.accountNumber);
    const maskedAcct = input.bankDetails.accountNumber
      ? `XXXX${input.bankDetails.accountNumber.slice(-4)}`
      : "";
    db.prepare(`
      INSERT INTO payout_accounts (
        id, partner_id, method, account_holder_name, bank_name,
        account_number_masked, account_number_raw, ifsc_code,
        account_type, upi_id, is_primary, is_verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
    `).run(
      `acc_${partnerId}`,
      partnerId,
      isUpi ? "UPI" : "BANK_ACCOUNT",
      input.bankDetails.accountHolderName || partnerName,
      input.bankDetails.bankName || "",
      maskedAcct,
      input.bankDetails.accountNumber || "",
      input.bankDetails.ifscCode || "",
      input.bankDetails.accountType || "SAVINGS",
      input.bankDetails.upiId || "",
      now,
      now
    );
  }

  // Also create user record
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, role, partner_id, created_at)
    VALUES (?, ?, ?, 'partner', ?, ?)
  `).run(`usr_${partnerId}`, input.email, password, partnerId, now);

  // Create audit log
  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actor, actor_role, action, entity_type, entity_id, old_value, new_value, reason)
    VALUES (?, ?, ?, 'partner', 'REGISTER_PARTNER', 'PARTNER_LEVEL', ?, '', ?, ?)
  `).run(`log_${Date.now()}`, now, partnerName, partnerId, status, input.notes || "Self registration");

  const row = db.prepare("SELECT * FROM partners WHERE id = ?").get(partnerId);
  return formatPartnerToCamel(row);
}

export function getAllPartners() {
  const partners = db.prepare("SELECT * FROM partners ORDER BY created_at DESC").all() as any[];
  return partners.map(formatPartnerToCamel);
}

export function getPartnerById(partnerId: string) {
  const p = db.prepare("SELECT * FROM partners WHERE id = ? OR code = ?").get(partnerId, partnerId);
  return formatPartnerToCamel(p);
}

export function updatePartnerStatus(partnerId: string, status: "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "REJECTED", adminUser = "Admin") {
  const old = db.prepare("SELECT status FROM partners WHERE id = ?").get(partnerId) as any;
  if (!old) throw new Error("Partner not found");

  db.prepare("UPDATE partners SET status = ? WHERE id = ?").run(status, partnerId);

  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actor, actor_role, action, entity_type, entity_id, old_value, new_value, reason)
    VALUES (?, ?, ?, 'admin', 'CHANGE_STATUS', 'PARTNER_LEVEL', ?, ?, ?, 'Admin status update')
  `).run(`log_${Date.now()}`, new Date().toISOString(), adminUser, partnerId, old.status, status);

  return db.prepare("SELECT * FROM partners WHERE id = ?").get(partnerId);
}

export function formatLeadToCamel(r: any) {
  if (!r) return null;
  return {
    id: r.id,
    clientName: r.client_name,
    mobile: r.mobile,
    email: r.email,
    location: r.location || "India",
    interestedProgramId: r.program_id,
    interestedProgramName: r.program_name || "FREE 5-Day Mind Reset Challenge",
    referralSource: r.source || "Direct Partner Referral",
    notes: r.notes || "",
    preferredContactTime: r.preferred_contact_time || "Anytime",
    consent: r.consent === 1 || r.consent === true,
    partnerId: r.partner_id,
    partnerName: r.partner_name,
    referringClientId: r.client_id || undefined,
    status: r.status,
    createdAt: r.created_at,
    attributionStatus: r.attribution_status || "NORMAL",
    paidAmount: r.paid_amount || 0,
    commissionEarned: r.commission_earned || 0,
    convertedDate: r.converted_date || r.converted_at || undefined,
    owner: r.owner || "P2IP Care Team",
  };
}

export function formatCommissionToCamel(c: any) {
  if (!c) return null;
  return {
    id: c.id,
    partnerId: c.partner_id,
    partnerName: c.partner_name,
    leadId: c.referral_id || "",
    clientName: c.client_name || c.customer_name || "Enrolled Client",
    productId: c.product_id,
    productName: c.product_name || "Program",
    collectedRevenue: c.collected_revenue || 0,
    commissionPercentage: c.commission_percentage || 50,
    commissionAmount: c.commission_amount || 0,
    status: c.status || "APPROVED",
    createdAt: c.created_at,
    approvedAt: c.approved_at || undefined,
    payableAt: c.payable_at || undefined,
    paidAt: c.paid_at || undefined,
    reversedAt: c.reversed_at || undefined,
    reversalReason: c.reversal_reason || undefined,
    payoutRefNumber: c.payout_ref_number || c.payout_id || undefined,
  };
}

export function formatPayoutToCamel(p: any) {
  if (!p) return null;
  return {
    id: p.id,
    partnerId: p.partner_id,
    partnerName: p.partner_name,
    payableAmount: p.approved_amount || p.requested_amount || 0,
    approvedAmount: p.approved_amount || p.requested_amount || 0,
    paidAmount: p.actual_paid_amount || (p.status === "PAID" ? p.requested_amount : 0),
    payoutDate: p.paid_at ? p.paid_at.split("T")[0] : p.requested_at ? p.requested_at.split("T")[0] : new Date().toISOString().split("T")[0],
    paymentMethod: p.payment_method === "UPI" ? "UPI" : "Bank Transfer",
    transactionRef: p.utr || "PENDING",
    status: p.status === "PAID" ? "PAID" : p.status === "REJECTED" ? "FAILED" : "PENDING",
    processedBy: p.processed_by || "Admin",
    notes: p.admin_notes || p.notes || "",
    proofUrl: p.proof_url || "",
  };
}

// ----------------------------------------------------
// REFERRAL MANAGEMENT
// ----------------------------------------------------
export function createReferral(input: CreateReferralInput) {
  let partner = db.prepare("SELECT * FROM partners WHERE id = ?").get(input.partnerId) as any;
  if (!partner && input.partnerId) {
    partner = db.prepare("SELECT * FROM partners WHERE code = ?").get(input.partnerId) as any;
  }
  if (!partner && input.partnerName) {
    partner = db.prepare("SELECT * FROM partners WHERE name = ?").get(input.partnerName) as any;
  }
  if (!partner) {
    const firstPartner = db.prepare("SELECT * FROM partners LIMIT 1").get() as any;
    if (firstPartner) {
      partner = firstPartner;
    } else {
      throw new Error("Referral partner not found. Please register a partner first.");
    }
  }

  // Anti-fraud: prevent self-referral
  const cleanPartnerMobile = (partner.mobile || "").replace(/[^0-9]/g, "");
  const cleanClientMobile = (input.mobile || "").replace(/[^0-9]/g, "");
  const cleanPartnerEmail = (partner.email || "").trim().toLowerCase();
  const cleanClientEmail = (input.email || "").trim().toLowerCase();

  if (
    (cleanPartnerMobile.length >= 10 && cleanPartnerMobile.slice(-10) === cleanClientMobile.slice(-10)) ||
    (cleanPartnerEmail.length > 3 && cleanPartnerEmail === cleanClientEmail)
  ) {
    throw new Error("Anti-fraud validation failed: Self-referrals are not permitted.");
  }

  // Strict Duplicate Collision Check: Prohibit duplicate client registration
  const allReferrals = db.prepare("SELECT id, client_name, mobile, email, partner_name FROM referrals").all() as any[];
  const duplicate = allReferrals.find((r) => {
    const rMobile = (r.mobile || "").replace(/[^0-9]/g, "");
    const matchMobile = cleanClientMobile.length >= 10 && (rMobile.endsWith(cleanClientMobile.slice(-10)) || cleanClientMobile.endsWith(rMobile.slice(-10)));
    const matchEmail = cleanClientEmail.length > 3 && (r.email || "").trim().toLowerCase() === cleanClientEmail;
    return matchMobile || matchEmail;
  });

  if (duplicate) {
    throw new Error(
      `Duplicate registration prohibited: A client with mobile '${input.mobile}' or email '${input.email}' is already registered in P2IP under Referral ID ${duplicate.id} (${duplicate.client_name}, attributed to: ${duplicate.partner_name}). Duplicate client registrations are strictly prohibited.`
    );
  }

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(input.programId) as any;
  const programName = product?.name || input.programName || "FREE 5-Day Mind Reset Challenge";

  const referralId = getNextReferralId();
  const now = new Date().toISOString();

  // Insert into clients table if not exists
  const clientRow = db.prepare("SELECT id FROM clients WHERE mobile = ?").get(input.mobile) as any;
  const clientId = clientRow?.id || `CLT-${Date.now()}`;
  if (!clientRow) {
    db.prepare(`
      INSERT INTO clients (id, name, mobile, email, location, partner_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(clientId, input.clientName, input.mobile, input.email, input.location || "India", partner.id, now);
  }

  // Initial referral status
  const isChallenge = input.programId === "prod-free-reset" || programName.toLowerCase().includes("mind reset");
  const initialStatus = isChallenge ? "REGISTERED" : "NEW";
  const commissionEarned = isChallenge ? 49 : 0;

  db.prepare(`
    INSERT INTO referrals (
      id, partner_id, partner_name, client_id, client_name, mobile, email,
      location, program_id, program_name, source, notes, preferred_contact_time,
      consent, status, attribution_status, duplicate_partner_id, commission_earned, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NORMAL', null, ?, ?, ?)
  `).run(
    referralId,
    partner.id,
    partner.name,
    clientId,
    input.clientName,
    input.mobile,
    input.email,
    input.location || "India",
    input.programId,
    programName,
    input.source || "Direct Partner Referral",
    input.notes || "",
    input.preferredContactTime || "Evenings",
    input.consent !== false ? 1 : 0,
    initialStatus,
    commissionEarned,
    now,
    now
  );

  // ₹49 MIND RESET ACTIVATION REWARD:
  if (isChallenge) {
    const activationReward = product?.partner_activation_reward || 49;
    const commId = getNextCommissionId();

    db.prepare(`
      INSERT INTO commissions (
        id, partner_id, partner_name, referral_id, client_name, product_id,
        product_name, collected_revenue, commission_percentage, commission_amount,
        status, created_at, approved_at, payable_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 'APPROVED', ?, ?, ?)
    `).run(
      commId,
      partner.id,
      partner.name,
      referralId,
      input.clientName,
      input.programId,
      programName,
      activationReward,
      now,
      now,
      now
    );

    // Write ledger transaction
    db.prepare(`
      INSERT INTO commission_transactions (
        id, partner_id, type, amount, reference_id, reference_type, description, created_at
      ) VALUES (?, ?, 'COMMISSION', ?, ?, 'REFERRAL_REWARD', ?, ?)
    `).run(
      getNextTransactionId(),
      partner.id,
      activationReward,
      referralId,
      `₹${activationReward} Mind Reset Activation Reward for verified client registration (${input.clientName})`,
      now
    );
  }

  // Create notification
  db.prepare(`
    INSERT INTO notifications (id, recipient_role, recipient_partner_id, title, message, type, timestamp, is_read, link_tab)
    VALUES (?, 'partner', ?, 'New Client Referral Logged', ?, 'referral', ?, 0, 'leads')
  `).run(
    `notif_${Date.now()}`,
    partner.id,
    `Referral for ${input.clientName} (${programName}) successfully recorded with ID ${referralId}.`,
    now
  );

  const newRef = db.prepare("SELECT * FROM referrals WHERE id = ?").get(referralId);
  return formatLeadToCamel(newRef);
}

export function getAllReferrals(partnerId?: string) {
  let rows: any[];
  if (partnerId) {
    rows = db.prepare("SELECT * FROM referrals WHERE partner_id = ? ORDER BY created_at DESC").all(partnerId) as any[];
  } else {
    rows = db.prepare("SELECT * FROM referrals ORDER BY created_at DESC").all() as any[];
  }
  return rows.map(formatLeadToCamel);
}

export function updateReferralStatus(referralId: string, status: string, adminUser = "Admin") {
  const ref = db.prepare("SELECT * FROM referrals WHERE id = ?").get(referralId) as any;
  if (!ref) throw new Error("Referral not found");

  const now = new Date().toISOString();
  db.prepare("UPDATE referrals SET status = ?, updated_at = ? WHERE id = ?").run(status, now, referralId);

  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actor, actor_role, action, entity_type, entity_id, old_value, new_value, reason)
    VALUES (?, ?, ?, 'admin', 'UPDATE_REFERRAL_STATUS', 'LEAD', ?, ?, ?, 'Status progression')
  `).run(`log_${Date.now()}`, now, adminUser, referralId, ref.status, status);

  const updated = db.prepare("SELECT * FROM referrals WHERE id = ?").get(referralId);
  return formatLeadToCamel(updated);
}

// ----------------------------------------------------
// CUSTOMER PAYMENT & COMMISSION GENERATION
// ----------------------------------------------------
export function recordCustomerPayment(input: CustomerPaymentInput) {
  let partnerId = input.partnerId;
  let customerName = input.customerName;
  let customerMobile = input.customerMobile;
  let customerEmail = input.customerEmail;
  let referralId = input.referralId || null;
  const amount = input.amount || input.amountPaid || 0;

  if (referralId) {
    const ref = db.prepare("SELECT * FROM referrals WHERE id = ?").get(referralId) as any;
    if (ref) {
      partnerId = partnerId || ref.partner_id;
      customerName = customerName || ref.client_name;
      customerMobile = customerMobile || ref.mobile;
      customerEmail = customerEmail || ref.email;
    }
  }

  let partner = db.prepare("SELECT * FROM partners WHERE id = ?").get(partnerId || "") as any;
  if (!partner && partnerId) {
    partner = db.prepare("SELECT * FROM partners WHERE code = ?").get(partnerId) as any;
  }
  if (!partner) {
    partner = db.prepare("SELECT * FROM partners LIMIT 1").get() as any;
  }
  if (!partner) throw new Error("Partner not found for payment processing");

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(input.productId) as any;
  const productName = product?.name || input.productName || "Enrolled Program";

  const paymentId = getNextPaymentId();
  const now = new Date().toISOString();
  const paymentDate = input.paymentDate || now;

  // Insert payment record
  db.prepare(`
    INSERT INTO payments (
      id, customer_id, customer_name, customer_mobile, customer_email,
      partner_id, partner_name, referral_id, product_id, product_name,
      amount, currency, gateway, gateway_transaction_id, payment_status,
      payment_date, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'INR', ?, ?, 'SUCCESS', ?, ?)
  `).run(
    paymentId,
    input.customerId || `CUST-${Date.now()}`,
    customerName || "Customer",
    customerMobile || "N/A",
    customerEmail || "N/A",
    partner.id,
    partner.name,
    referralId,
    input.productId,
    productName,
    amount,
    input.gateway || "MANUAL_VERIFIED",
    input.gatewayTransactionId || `GW-${Date.now()}`,
    paymentDate,
    now
  );

  // Compute 50% commission (or custom rate if configured)
  const commissionPercentage = partner.custom_commission_rate || product?.partner_commission_percentage || 50;
  const commissionAmount = Number(((amount * commissionPercentage) / 100).toFixed(2));

  const commId = getNextCommissionId();
  db.prepare(`
    INSERT INTO commissions (
      id, payment_id, partner_id, partner_name, referral_id, client_name,
      product_id, product_name, collected_revenue, commission_percentage,
      commission_amount, status, created_at, approved_at, payable_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'APPROVED', ?, ?, ?)
  `).run(
    commId,
    paymentId,
    partner.id,
    partner.name,
    referralId,
    customerName || "Customer",
    input.productId,
    productName,
    amount,
    commissionPercentage,
    commissionAmount,
    now,
    now,
    now
  );

  // Write to ledger
  db.prepare(`
    INSERT INTO commission_transactions (
      id, partner_id, type, amount, reference_id, reference_type, description, created_at
    ) VALUES (?, ?, 'COMMISSION', ?, ?, 'CUSTOMER_PAYMENT', ?, ?)
  `).run(
    getNextTransactionId(),
    partner.id,
    commissionAmount,
    paymentId,
    `${commissionPercentage}% commission for ${productName} (${customerName}): ₹${commissionAmount}`,
    now
  );

  // If referral exists, update its status to PAID_CUSTOMER
  if (referralId) {
    db.prepare(`
      UPDATE referrals 
      SET status = 'PAID_CUSTOMER', paid_amount = paid_amount + ?, commission_earned = commission_earned + ?, converted_date = ?, updated_at = ?
      WHERE id = ?
    `).run(amount, commissionAmount, now, now, referralId);
  }

  // Partner Notification
  db.prepare(`
    INSERT INTO notifications (id, recipient_role, recipient_partner_id, title, message, type, timestamp, is_read, link_tab)
    VALUES (?, 'partner', ?, 'Payment & Commission Credited!', ?, 'commission', ?, 0, 'wallet')
  `).run(
    `notif_${Date.now()}`,
    partner.id,
    `₹${commissionAmount} commission credited for ${customerName} enrolling in ${productName}.`,
    now
  );

  return {
    paymentId,
    commissionId: commId,
    commissionAmount,
    partnerId: partner.id,
    partnerName: partner.name,
    rate: commissionPercentage,
  };
}

export function getAllPayments() {
  return db.prepare("SELECT * FROM payments ORDER BY created_at DESC").all() as any[];
}

export function getAllCommissions(partnerId?: string) {
  let rows: any[];
  if (partnerId) {
    rows = db.prepare("SELECT * FROM commissions WHERE partner_id = ? ORDER BY created_at DESC").all(partnerId) as any[];
  } else {
    rows = db.prepare("SELECT * FROM commissions ORDER BY created_at DESC").all() as any[];
  }
  return rows.map(formatCommissionToCamel);
}

export function getCommissionTransactions(partnerId: string) {
  return db.prepare("SELECT * FROM commission_transactions WHERE partner_id = ? ORDER BY created_at DESC").all(partnerId) as any[];
}

// ----------------------------------------------------
// PAYOUT ACCOUNTS (SENSITIVE & MASKED)
// ----------------------------------------------------
export function addPayoutAccount(input: PayoutAccountInput) {
  const partner = db.prepare("SELECT id FROM partners WHERE id = ?").get(input.partnerId);
  if (!partner) throw new Error("Partner not found");

  const accountId = `ACC-${Date.now()}`;
  const now = new Date().toISOString();

  let maskedNumber = "";
  if (input.method === "BANK_ACCOUNT" && input.accountNumber) {
    const last4 = input.accountNumber.slice(-4);
    maskedNumber = `XXXX XXXX ${last4}`;
  } else if (input.method === "UPI") {
    maskedNumber = input.upiId || "";
  }

  // If this is set as primary, unmark others
  if (input.isPrimary !== false) {
    db.prepare("UPDATE payout_accounts SET is_primary = 0 WHERE partner_id = ?").run(input.partnerId);
  }

  db.prepare(`
    INSERT INTO payout_accounts (
      id, partner_id, method, account_holder_name, bank_name,
      account_number_masked, account_number_raw, ifsc_code, account_type,
      upi_id, is_primary, is_verified, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
  `).run(
    accountId,
    input.partnerId,
    input.method,
    input.accountHolderName,
    input.bankName || "",
    maskedNumber,
    input.accountNumber || "",
    input.ifscCode || "",
    input.accountType || "SAVINGS",
    input.upiId || "",
    now,
    now
  );

  return db.prepare("SELECT * FROM payout_accounts WHERE id = ?").get(accountId) as any;
}

export function getPayoutAccounts(partnerId: string) {
  return db.prepare("SELECT * FROM payout_accounts WHERE partner_id = ? ORDER BY is_primary DESC, created_at DESC").all(partnerId) as any[];
}

// ----------------------------------------------------
// PAYOUT REQUEST & EXECUTION WORKFLOW
// ----------------------------------------------------
export function requestPayout(partnerId: string, requestedAmount: number, payoutAccountId?: string) {
  const partner = db.prepare("SELECT * FROM partners WHERE id = ?").get(partnerId) as any;
  if (!partner) throw new Error("Partner not found");

  const wallet = getPartnerWallet(partnerId);
  if (requestedAmount <= 0) {
    throw new Error("Payout amount must be greater than zero.");
  }
  if (requestedAmount > wallet.availableBalance) {
    throw new Error(`Insufficient available balance. You requested ₹${requestedAmount}, but only ₹${wallet.availableBalance} is available.`);
  }

  // Find destination
  let destination = "UPI / Bank Transfer";
  let method = "UPI";
  if (payoutAccountId) {
    const acc = db.prepare("SELECT * FROM payout_accounts WHERE id = ?").get(payoutAccountId) as any;
    if (acc) {
      destination = acc.method === "BANK_ACCOUNT" ? `Bank: ${acc.bank_name} (${acc.account_number_masked})` : `UPI: ${acc.upi_id}`;
      method = acc.method === "BANK_ACCOUNT" ? "BANK_TRANSFER" : "UPI";
    }
  } else {
    // Check primary account
    const primary = db.prepare("SELECT * FROM payout_accounts WHERE partner_id = ? AND is_primary = 1").get(partnerId) as any;
    if (primary) {
      destination = primary.method === "BANK_ACCOUNT" ? `Bank: ${primary.bank_name} (${primary.account_number_masked})` : `UPI: ${primary.upi_id}`;
      method = primary.method === "BANK_ACCOUNT" ? "BANK_TRANSFER" : "UPI";
    }
  }

  const payoutId = getNextPayoutId();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO payouts (
      id, partner_id, partner_name, payout_account_id, requested_amount,
      approved_amount, actual_paid_amount, payment_method, destination_masked,
      gateway, status, requested_at
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, 'MANUAL_UPI', 'REQUESTED', ?)
  `).run(
    payoutId,
    partnerId,
    partner.name,
    payoutAccountId || null,
    requestedAmount,
    requestedAmount,
    method,
    destination,
    now
  );

  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actor, actor_role, action, entity_type, entity_id, old_value, new_value, reason)
    VALUES (?, ?, ?, 'partner', 'REQUEST_PAYOUT', 'PAYOUT', ?, '', ?, 'Partner requested payout')
  `).run(`log_${Date.now()}`, now, partner.name, payoutId, `₹${requestedAmount}`);

  return db.prepare("SELECT * FROM payouts WHERE id = ?").get(payoutId) as any;
}

export function approvePayout(payoutId: string, adminUser = "Admin") {
  const payout = db.prepare("SELECT * FROM payouts WHERE id = ?").get(payoutId) as any;
  if (!payout) throw new Error("Payout request not found");

  const now = new Date().toISOString();
  db.prepare("UPDATE payouts SET status = 'APPROVED', approved_at = ? WHERE id = ?").run(now, payoutId);

  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actor, actor_role, action, entity_type, entity_id, old_value, new_value, reason)
    VALUES (?, ?, ?, 'admin', 'APPROVE_PAYOUT', 'PAYOUT', ?, 'REQUESTED', 'APPROVED', 'Admin approved payout request')
  `).run(`log_${Date.now()}`, now, adminUser, payoutId);

  return db.prepare("SELECT * FROM payouts WHERE id = ?").get(payoutId);
}

export function recordManualPayoutExecution(input: ManualPayoutExecutionInput) {
  const payout = db.prepare("SELECT * FROM payouts WHERE id = ?").get(input.payoutId) as any;
  if (!payout) throw new Error("Payout request not found");
  if (!input.utr || input.utr.trim().length === 0) {
    throw new Error("A valid transaction reference / UTR number is required to confirm payment sent.");
  }

  const now = new Date().toISOString();
  const paidDate = input.paymentDate || now;
  const adminUser = input.adminUser || "Admin";
  const actualPaidAmount = Number(input.actualPaidAmount ?? (input as any).paidAmount ?? payout.approved_amount ?? 0);

  // Mark payout as PAID
  db.prepare(`
    UPDATE payouts 
    SET status = 'PAID', actual_paid_amount = ?, utr = ?, payment_method = ?,
        paid_at = ?, admin_notes = ?, proof_url = ?, processed_by = ?
    WHERE id = ?
  `).run(
    actualPaidAmount,
    input.utr,
    input.paymentMethod || "UPI",
    paidDate,
    input.notes || "Settled via manual transfer",
    input.proofUrl || null,
    adminUser,
    input.payoutId
  );

  // Write PAYOUT entry to ledger (deducts from balance)
  db.prepare(`
    INSERT INTO commission_transactions (
      id, partner_id, type, amount, reference_id, reference_type, description, created_at
    ) VALUES (?, ?, 'PAYOUT', ?, ?, 'PAYOUT', ?, ?)
  `).run(
    getNextTransactionId(),
    payout.partner_id,
    -actualPaidAmount,
    input.payoutId,
    `Payout settled via ${input.paymentMethod || "UPI"} (UTR: ${input.utr})`,
    now
  );

  // Notify Partner
  db.prepare(`
    INSERT INTO notifications (id, recipient_role, recipient_partner_id, title, message, type, timestamp, is_read, link_tab)
    VALUES (?, 'partner', ?, 'Payout Sent Successfully!', ?, 'commission', ?, 0, 'wallet')
  `).run(
    `notif_${Date.now()}`,
    payout.partner_id,
    `Your payout of ₹${input.actualPaidAmount} has been processed via ${input.paymentMethod}. Transaction Reference / UTR: ${input.utr}.`,
    now
  );

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actor, actor_role, action, entity_type, entity_id, old_value, new_value, reason)
    VALUES (?, ?, ?, 'admin', 'CONFIRM_PAYOUT_PAID', 'PAYOUT', ?, ?, 'PAID', ?)
  `).run(`log_${Date.now()}`, now, adminUser, input.payoutId, payout.status, `UTR: ${input.utr}`);

  return db.prepare("SELECT * FROM payouts WHERE id = ?").get(input.payoutId);
}

export function getAllPayouts(partnerId?: string) {
  let rows: any[];
  if (partnerId) {
    rows = db.prepare("SELECT * FROM payouts WHERE partner_id = ? ORDER BY requested_at DESC").all(partnerId) as any[];
  } else {
    rows = db.prepare("SELECT * FROM payouts ORDER BY requested_at DESC").all() as any[];
  }
  return rows.map(formatPayoutToCamel);
}

// ----------------------------------------------------
// PRODUCTION DATA MANDATE: NO SAMPLE DATA BOOTSTRAPPING
// ----------------------------------------------------
export function seedInitialDataIfEmpty() {
  // ZERO FAKE DATA MANDATE: Production starts with 0 partners and 0 leads.
  // Data enters strictly through real user registrations and transactions.
  return;
}

// ----------------------------------------------------
// FINANCIAL RECONCILIATION
// ----------------------------------------------------
export function getFinancialReconciliation() {
  const revRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as gross, COALESCE(SUM(refunded_amount), 0) as refunds
    FROM payments WHERE payment_status = 'SUCCESS'
  `).get() as { gross: number; refunds: number };

  const commRow = db.prepare(`
    SELECT COALESCE(SUM(commission_amount), 0) as liability
    FROM commissions WHERE status != 'REVERSED'
  `).get() as { liability: number };

  const payoutRow = db.prepare(`
    SELECT COALESCE(SUM(actual_paid_amount), 0) as paid
    FROM payouts WHERE status = 'PAID'
  `).get() as { paid: number };

  const ledgerRow = db.prepare(`
    SELECT 
      COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as totalCredits,
      COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) as totalDebits
    FROM commission_transactions
  `).get() as { totalCredits: number; totalDebits: number };

  const grossRevenue = revRow?.gross || 0;
  const refunds = revRow?.refunds || 0;
  const netRevenue = grossRevenue - refunds;
  const expectedPartnerLiability = commRow?.liability || 0;
  const actualPaidOut = payoutRow?.paid || 0;
  const outstandingLiability = expectedPartnerLiability - actualPaidOut;
  const ledgerOutstanding = (ledgerRow?.totalCredits || 0) - (ledgerRow?.totalDebits || 0);

  const difference = Math.abs(outstandingLiability - ledgerOutstanding);

  return {
    grossRevenue,
    refunds,
    netRevenue,
    expectedPartnerLiability,
    actualPaidOut,
    outstandingLiability,
    ledgerTotalCredits: ledgerRow?.totalCredits || 0,
    ledgerTotalDebits: ledgerRow?.totalDebits || 0,
    ledgerOutstanding,
    difference,
    isReconciled: difference < 0.01,
  };
}

// ----------------------------------------------------
// RESET TO CLEAN PRODUCTION (ZERO DATA)
// ----------------------------------------------------
export function resetToCleanProduction() {
  db.exec(`
    DELETE FROM referrals;
    DELETE FROM clients;
    DELETE FROM payments;
    DELETE FROM commissions;
    DELETE FROM commission_transactions;
    DELETE FROM payouts;
    DELETE FROM payout_accounts;
    DELETE FROM bonuses;
    DELETE FROM followups;
    DELETE FROM notifications;
    DELETE FROM audit_logs;
    DELETE FROM users WHERE role != 'admin';
    DELETE FROM partners;
  `);

  return { success: true, message: "Database wiped to pristine zero production state." };
}
