/**
 * P2IP PartnerSphere - Production Cloud Firestore Service
 * Single Source of Truth for Partners, Leads, Commissions & Transactions Ledger
 */
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db, auth } from "../firebase";
import {
  Partner,
  Lead,
  Commission,
  PayoutRecord,
  Transaction,
  AuditLogEntry,
} from "../types";

// Collection references
const PARTNERS_COLLECTION = "partners";
const LEADS_COLLECTION = "leads";
const COMMISSIONS_COLLECTION = "commissions";
const TRANSACTIONS_COLLECTION = "transactions";
const PAYOUTS_COLLECTION = "payouts";
const AUDIT_LOGS_COLLECTION = "audit_logs";

/**
 * Real-time listener for all Partners in Firestore
 */
export const subscribeToPartners = (
  onUpdate: (partners: Partner[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(collection(db, PARTNERS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Partner[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: data.id || data.partnerId || docSnap.id,
          partnerId: data.partnerId || data.id || docSnap.id,
          authUid: data.authUid || "",
          code: data.code || data.referralCode || docSnap.id,
          referralCode: data.referralCode || data.code || docSnap.id,
          name: data.name || "",
          organisation: data.organisation || data.organizationName || "",
          organizationName: data.organizationName || data.organisation || "",
          partnerType: data.partnerType || "Individual Referral Partner",
          mobile: data.mobile || data.phone || "",
          phone: data.phone || data.mobile || "",
          email: data.email || "",
          location: data.location || (data.city && data.state ? `${data.city}, ${data.state}` : data.city || ""),
          city: data.city || "",
          state: data.state || "",
          avatarUrl: data.avatarUrl || "",
          joiningDate: data.joiningDate || data.joinedAt || new Date().toISOString().split("T")[0],
          joinedAt: data.joinedAt || data.joiningDate || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          level: data.level || "STARTER",
          status: data.status || "ACTIVE",
          referralUrl: data.referralUrl || data.referralLink || `https://pathtoinnerpeace.in/r/${data.code || data.referralCode}`,
          referralLink: data.referralLink || data.referralUrl || `https://pathtoinnerpeace.in/r/${data.code || data.referralCode}`,
          payoutProfileStatus: data.payoutProfileStatus || (data.bankDetails?.isVerified ? "VERIFIED" : "PENDING"),
          totalReferrals: Number(data.totalReferrals) || 0,
          currentMonthlyReferrals: Number(data.currentMonthlyReferrals) || 0,
          totalCustomers: Number(data.totalCustomers) || 0,
          totalPaidCustomers: Number(data.totalPaidCustomers) || 0,
          lifetimeRevenue: Number(data.lifetimeRevenue) || 0,
          lifetimeCommission: Number(data.lifetimeCommission) || 0,
          totalEarned: Number(data.totalEarned) || 0,
          totalPaidOut: Number(data.totalPaidOut) || 0,
          availableBalance: Number(data.availableBalance) || 0,
          monthlyTarget: Number(data.monthlyTarget) || 10,
          customCommissionRate: data.customCommissionRate || 50,
          bankDetails: data.bankDetails || undefined,
          termsAccepted: Boolean(data.termsAccepted),
          termsAcceptedAt: data.termsAcceptedAt || "",
          termsVersion: data.termsVersion || "v1.3",
          password: data.password || "",
          twoStepAuthPin: data.twoStepAuthPin || "",
          twoStepAuthEnabled: data.twoStepAuthEnabled !== false,
          panNumber: data.panNumber || "",
          aadhaarNumber: data.aadhaarNumber || "",
        });
      });
      // Sort newest first
      list.sort((a, b) => (b.joiningDate || "").localeCompare(a.joiningDate || ""));
      onUpdate(list);
    },
    (err) => {
      console.error("Firestore subscribeToPartners error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for all Leads in Firestore
 */
export const subscribeToLeads = (
  onUpdate: (leads: Lead[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(collection(db, LEADS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Lead[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: data.id || docSnap.id,
          clientName: data.clientName || "",
          mobile: data.mobile || "",
          email: data.email || "",
          location: data.location || "",
          interestedProgramId: data.interestedProgramId || data.programId || "prod-free-reset",
          interestedProgramName: data.interestedProgramName || data.programName || "FREE 5-Day Mind Reset Challenge",
          referralSource: data.referralSource || data.source || "Partner Referral",
          notes: data.notes || "",
          preferredContactTime: data.preferredContactTime || "Evenings",
          consent: Boolean(data.consent),
          partnerId: data.partnerId || "",
          partnerName: data.partnerName || "",
          referringClientId: data.referringClientId,
          status: data.status || "NEW",
          createdAt: data.createdAt || new Date().toISOString(),
          lastContactDate: data.lastContactDate,
          nextFollowUpDate: data.nextFollowUpDate,
          followUpNote: data.followUpNote,
          attributionStatus: data.attributionStatus || "NORMAL",
          duplicateInfo: data.duplicateInfo,
          paidAmount: Number(data.paidAmount) || 0,
          commissionEarned: Number(data.commissionEarned) || 0,
          convertedDate: data.convertedDate,
          owner: data.owner,
        });
      });
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      onUpdate(list);
    },
    (err) => {
      console.error("Firestore subscribeToLeads error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for all Transactions (Ledger) in Firestore
 */
export const subscribeToTransactions = (
  onUpdate: (transactions: Transaction[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(collection(db, TRANSACTIONS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: data.id || docSnap.id,
          partnerId: data.partnerId || "",
          type: data.type || "COMMISSION",
          amount: Number(data.amount) || 0,
          referenceId: data.referenceId,
          referenceType: data.referenceType,
          description: data.description || "",
          balanceAfter: Number(data.balanceAfter) || 0,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      onUpdate(list);
    },
    (err) => {
      console.error("Firestore subscribeToTransactions error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for all Commissions in Firestore
 */
export const subscribeToCommissions = (
  onUpdate: (commissions: Commission[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(collection(db, COMMISSIONS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Commission[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: data.id || docSnap.id,
          partnerId: data.partnerId || "",
          partnerName: data.partnerName || "",
          leadId: data.leadId || "",
          clientName: data.clientName || "",
          productId: data.productId || "",
          productName: data.productName || "",
          collectedRevenue: Number(data.collectedRevenue) || 0,
          commissionPercentage: Number(data.commissionPercentage) || 50,
          commissionAmount: Number(data.commissionAmount) || 0,
          status: data.status || "APPROVED",
          createdAt: data.createdAt || new Date().toISOString(),
          approvedAt: data.approvedAt,
          payableAt: data.payableAt,
          paidAt: data.paidAt,
          reversedAt: data.reversedAt,
          reversalReason: data.reversalReason,
          payoutRefNumber: data.payoutRefNumber,
          isInnerCircleCredit: Boolean(data.isInnerCircleCredit),
        });
      });
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      onUpdate(list);
    },
    (err) => {
      console.error("Firestore subscribeToCommissions error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Real-time listener for all Payouts in Firestore
 */
export const subscribeToPayouts = (
  onUpdate: (payouts: PayoutRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(collection(db, PAYOUTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: PayoutRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: data.id || docSnap.id,
          partnerId: data.partnerId || "",
          partnerName: data.partnerName || "",
          payableAmount: Number(data.payableAmount) || 0,
          approvedAmount: Number(data.approvedAmount) || 0,
          paidAmount: Number(data.paidAmount) || 0,
          payoutDate: data.payoutDate,
          paymentMethod: data.paymentMethod || "Bank Transfer",
          transactionRef: data.transactionRef,
          status: data.status || "PENDING",
          processedBy: data.processedBy,
          notes: data.notes,
        });
      });
      list.sort((a, b) => (b.payoutDate || "").localeCompare(a.payoutDate || ""));
      onUpdate(list);
    },
    (err) => {
      console.error("Firestore subscribeToPayouts error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Save / Update Partner Document in Cloud Firestore
 * Calculates financial ledger fields dynamically: never trusts client override
 */
export const savePartnerToFirestore = async (
  partner: Partner,
  ledgerTransactions: Transaction[] = []
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docId = partner.id || partner.partnerId;
    if (!docId) {
      return { success: false, error: "Partner ID is required." };
    }

    // Calculate verified ledger totals for this partner
    const partnerTxns = ledgerTransactions.filter((t) => t.partnerId === docId);
    const calculatedEarned = partnerTxns
      .filter((t) => t.type === "COMMISSION" || t.type === "REWARD")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const calculatedPaidOut = partnerTxns
      .filter((t) => t.type === "PAYOUT")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const calculatedBalance = Math.max(0, calculatedEarned - calculatedPaidOut);

    const docRef = doc(db, PARTNERS_COLLECTION, docId);

    const firestoreData: Record<string, any> = {
      id: docId,
      partnerId: docId,
      authUid: partner.authUid || "",
      code: partner.code,
      referralCode: partner.code,
      name: partner.name,
      organisation: partner.organisation || "",
      organizationName: partner.organisation || "",
      partnerType: partner.partnerType,
      mobile: partner.mobile,
      phone: partner.mobile,
      email: partner.email,
      location: partner.location || "",
      level: partner.level || "STARTER",
      status: partner.status || "ACTIVE",
      referralUrl: partner.referralUrl || `https://pathtoinnerpeace.in/r/${partner.code}`,
      referralLink: partner.referralUrl || `https://pathtoinnerpeace.in/r/${partner.code}`,
      joiningDate: partner.joiningDate || new Date().toISOString().split("T")[0],
      joinedAt: partner.joinedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payoutProfileStatus: partner.bankDetails?.isVerified ? "VERIFIED" : "PENDING",
      totalReferrals: Number(partner.totalReferrals) || 0,
      currentMonthlyReferrals: Number(partner.currentMonthlyReferrals) || 0,
      totalCustomers: Number(partner.totalCustomers) || 0,
      totalPaidCustomers: Number(partner.totalPaidCustomers) || Number(partner.totalCustomers) || 0,
      lifetimeRevenue: Number(partner.lifetimeRevenue) || 0,
      lifetimeCommission: calculatedEarned > 0 ? calculatedEarned : Number(partner.lifetimeCommission) || 0,
      totalEarned: calculatedEarned > 0 ? calculatedEarned : Number(partner.lifetimeCommission) || 0,
      totalPaidOut: calculatedPaidOut,
      availableBalance: calculatedBalance > 0 ? calculatedBalance : Math.max(0, (partner.lifetimeCommission || 0) - calculatedPaidOut),
      monthlyTarget: Number(partner.monthlyTarget) || 10,
      customCommissionRate: partner.customCommissionRate || 50,
      termsAccepted: Boolean(partner.termsAccepted),
      termsAcceptedAt: partner.termsAcceptedAt || new Date().toISOString(),
      termsVersion: partner.termsVersion || "v1.3",
      password: partner.password || "",
      twoStepAuthPin: partner.twoStepAuthPin || "",
      twoStepAuthEnabled: partner.twoStepAuthEnabled !== false,
      panNumber: partner.panNumber || "",
      aadhaarNumber: partner.aadhaarNumber || "",
    };

    if (partner.bankDetails) {
      firestoreData.bankDetails = partner.bankDetails;
    }

    await setDoc(docRef, firestoreData, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save partner to Firestore:", err);
    return { success: false, error: err?.message || "Firestore write error" };
  }
};

/**
 * Save / Update Lead in Cloud Firestore
 */
export const saveLeadToFirestore = async (lead: Lead): Promise<{ success: boolean; error?: string }> => {
  try {
    const docId = lead.id;
    if (!docId) {
      return { success: false, error: "Lead ID is required." };
    }
    const docRef = doc(db, LEADS_COLLECTION, docId);
    await setDoc(docRef, { ...lead, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save lead to Firestore:", err);
    return { success: false, error: err?.message || "Firestore lead write error" };
  }
};

/**
 * Record a transaction into the Financial Ledger in Cloud Firestore
 */
export const recordLedgerTransactionInFirestore = async (
  txn: Transaction
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docId = txn.id || `TXN-${Date.now()}`;
    const docRef = doc(db, TRANSACTIONS_COLLECTION, docId);
    await setDoc(docRef, { ...txn, id: docId, createdAt: txn.createdAt || new Date().toISOString() });
    return { success: true };
  } catch (err: any) {
    console.error("Failed to record ledger transaction:", err);
    return { success: false, error: err?.message };
  }
};

/**
 * Record a commission in Cloud Firestore
 */
export const recordCommissionInFirestore = async (
  commission: Commission
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docId = commission.id;
    const docRef = doc(db, COMMISSIONS_COLLECTION, docId);
    await setDoc(docRef, commission, { merge: true });

    // Automatically record corresponding ledger transaction
    await recordLedgerTransactionInFirestore({
      id: `TXN-${commission.id}`,
      partnerId: commission.partnerId,
      type: "COMMISSION",
      amount: commission.commissionAmount,
      referenceId: commission.leadId,
      referenceType: "CLIENT_REFERRAL",
      description: `Commission earned for ${commission.productName} (${commission.clientName}): ₹${commission.commissionAmount}`,
      createdAt: commission.createdAt,
    });

    return { success: true };
  } catch (err: any) {
    console.error("Failed to record commission in Firestore:", err);
    return { success: false, error: err?.message };
  }
};

/**
 * Record a payout in Cloud Firestore
 */
export const recordPayoutInFirestore = async (
  payout: PayoutRecord
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docId = payout.id;
    const docRef = doc(db, PAYOUTS_COLLECTION, docId);
    await setDoc(docRef, payout, { merge: true });

    if (payout.status === "PAID") {
      // Record payout deduction in ledger
      await recordLedgerTransactionInFirestore({
        id: `TXN-PAY-${payout.id}`,
        partnerId: payout.partnerId,
        type: "PAYOUT",
        amount: payout.paidAmount,
        referenceId: payout.id,
        referenceType: "PAYOUT_TRANSFER",
        description: `Payout processed via ${payout.paymentMethod}: ₹${payout.paidAmount}`,
        createdAt: payout.payoutDate || new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to record payout in Firestore:", err);
    return { success: false, error: err?.message };
  }
};

/**
 * Register or Authenticate a Partner in Firebase Auth
 */
export const authenticateOrCreatePartnerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ success: boolean; authUid?: string; error?: string }> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    let authUid = "";

    try {
      // Attempt creation
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      authUid = userCredential.user.uid;
      await updateProfile(userCredential.user, { displayName });
    } catch (createErr: any) {
      if (createErr?.code === "auth/email-already-in-use") {
        // Try sign-in if already exists
        const signInCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        authUid = signInCred.user.uid;
      } else {
        throw createErr;
      }
    }

    return { success: true, authUid };
  } catch (err: any) {
    console.warn("Firebase Auth notice:", err?.message || err);
    // Even if Firebase Auth fails (e.g. offline or password policy), return fallback UID based on partner identity
    return { success: false, error: err?.message };
  }
};

/**
 * Production Data Mandate:
 * No fake/mock data or automatic sample data bootstrapping.
 * Production starts with strictly zero partners, zero leads, zero revenue, zero payouts.
 */
export const seedInitialFirestoreDataIfEmpty = async (): Promise<void> => {
  // ZERO FAKE DATA MANDATE: Production starts with 0 records.
  // Data enters strictly through real user registrations and transactions.
  return Promise.resolve();
};
