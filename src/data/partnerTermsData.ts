export interface PartnerTermClause {
  id: string;
  clauseNumber: number;
  title: string;
  category: "ELIGIBILITY" | "CLINICAL_DISCLAIMER" | "CONSENT" | "ANTI_SPAM" | "COMMERCIALS" | "TAX_TDS" | "DATA_PRIVACY" | "FRAUD_PREVENTION" | "IP_RIGHTS" | "TERMINATION";
  badge: string;
  summary: string;
  fullText: string;
}

export const PARTNER_CLIENT_REFERRAL_TERMS: PartnerTermClause[] = [
  {
    id: "clause-1-client-designation",
    clauseNumber: 1,
    title: "Scope of Client Referral & Explicit Designation as 'Clients'",
    category: "ELIGIBILITY",
    badge: "Core Mandate",
    summary: "All referred individuals are designated and treated strictly as 'Clients'. Referring partners must never classify or refer to them as students.",
    fullText:
      "All individuals referred to Path to Inner Peace (P2IP) programs and courses are formally recognized, enrolled, and serviced strictly as 'Clients'. The Accredited Partner is authorized to refer prospective adult clients—including working professionals, corporate executives, yoga practitioners, entrepreneurs, and wellness seekers—who seek emotional resilience, breathwork mastery, and stress transformation. Under no circumstances shall referred individuals be labeled, treated, or contracted as 'students' or academic pupils.",
  },
  {
    id: "clause-2-non-clinical-disclaimer",
    clauseNumber: 2,
    title: "Strict Non-Clinical Scope & Practice Boundaries",
    category: "CLINICAL_DISCLAIMER",
    badge: "Medical Boundary",
    summary: "P2IP programs represent holistic lifestyle education and guided breathwork. Partners must never claim or substitute them for clinical psychotherapy or psychiatric care.",
    fullText:
      "Path to Inner Peace programs (Mind Mastery 21-Day Daily Immersion, Guided Breathwork & Deep Sleep Reset, Free 5-Day Mind Reset Challenge) constitute holistic lifestyle education, stress management, breath regulation, and mindfulness practices. The Partner explicitly covenants never to diagnose medical or psychological conditions, prescribe therapies, or represent P2IP offerings as clinical psychiatry, medical psychotherapy, emergency crisis intervention, or hospital treatment.",
  },
  {
    id: "clause-3-client-consent",
    clauseNumber: 3,
    title: "Prior Client Consent & Respectful Engagement",
    category: "CONSENT",
    badge: "Consent Mandate",
    summary: "Partners must obtain explicit prior consent from prospective clients before submitting their contact details or initiating referral outreach.",
    fullText:
      "The Partner must obtain explicit, verifiable prior consent (written or oral) from every prospective client before submitting their name, email address, or mobile number into the P2IP Partner Portal or referral engine. Submitting unverified contact information, fabricated identities, or third-party details without prior knowledge and permission is strictly forbidden and constitutes a material breach of accreditation.",
  },
  {
    id: "clause-4-anti-spam",
    clauseNumber: 4,
    title: "Zero Tolerance for Spam, Cold Blasts & Aggressive Solicitation",
    category: "ANTI_SPAM",
    badge: "Anti-Spam",
    summary: "Bulk automated SMS/WhatsApp blasting, scraping contact lists, purchasing third-party databases, and deceptive outreach are strictly barred.",
    fullText:
      "The Partner agrees to conduct client outreach exclusively through professional, respectful, and relationship-based channels. The Partner shall not engage in unsolicited bulk WhatsApp broadcasts, automated robocalls, cold SMS blasting, unauthorized forum spamming, or the acquisition of third-party phone/email directories. All promotional messaging must clearly disclose the Partner's accredited referral relationship with Path to Inner Peace.",
  },
  {
    id: "clause-5-pricing-integrity",
    clauseNumber: 5,
    title: "Truthful Representation & Official Pricing Integrity",
    category: "COMMERCIALS",
    badge: "Pricing Integrity",
    summary: "Partners must only publish authorized program descriptions and standard pricing. Exaggerated cure claims or unauthorized discounts are prohibited.",
    fullText:
      "The Partner agrees to represent P2IP course structures, masterclass dates, curriculum contents, and instructor credentials accurately and honestly, using only official P2IP marketing collateral. The Partner shall never make deceptive or supernatural claims (such as guaranteed cures for clinical illnesses) and shall not publish unauthorized price markdowns, predatory rebates, or misleading commercial terms.",
  },
  {
    id: "clause-6-revenue-share-refund-hold",
    clauseNumber: 6,
    title: "50% Revenue Share & Mandatory 7-Day Client Refund Hold",
    category: "COMMERCIALS",
    badge: "50% Revenue Share",
    summary: "Partners earn standard 50% revenue share on collected course fees. A 7-day validation hold applies to accommodate client satisfaction refund rights.",
    fullText:
      "Accredited Partners in good standing earn fifty percent (50%) of net collected revenue on standard paid program enrollments attributed to their unique referral code, link, or QR scan. The Free 5-Day Mind Reset Challenge provides a forty-nine rupee (₹49) Activation Reward per verified attending client. To honor P2IP's 7-day client satisfaction money-back guarantee, all commissions are held in 'Pending' status for a 7-day cooling period. In the event of a client refund or chargeback, any associated pending commission is immediately cancelled.",
  },
  {
    id: "clause-7-payout-tax-tds",
    clauseNumber: 7,
    title: "Weekly Friday Payouts & Statutory Section 194H TDS Compliance",
    category: "TAX_TDS",
    badge: "Sec 194H TDS",
    summary: "Commissions are disbursed on Fridays via Bank NEFT/IMPS or UPI. Statutory Income Tax TDS under Section 194H is deducted based on valid PAN.",
    fullText:
      "Payable commissions that have completed the 7-day validation buffer are disbursed on weekly Friday payment cycles directly to the Partner's verified bank account or UPI / Razorpay ID. In strict compliance with the Indian Income Tax Act 1961, statutory Tax Deducted at Source (TDS) under Section 194H is deducted on all commission earnings against the Partner's valid 10-character PAN Card. Failure to maintain an active PAN triggers higher statutory TDS deduction under Section 206AA or temporary withholding of disbursals.",
  },
  {
    id: "clause-8-client-data-privacy",
    clauseNumber: 8,
    title: "Client Confidentiality & Strict Data Protection",
    category: "DATA_PRIVACY",
    badge: "Data Privacy",
    summary: "All client contact details, enrollment statuses, and personal data accessed via the partner portal must be guarded with total confidentiality.",
    fullText:
      "All client data—including names, email addresses, phone numbers, course attendance, and interaction notes—accessed through the Partner Portal constitutes confidential business information protected by applicable data protection laws. The Partner is strictly forbidden from selling, renting, sharing, or repurposing client records for external commercial endeavors or cross-selling unauthorized services.",
  },
  {
    id: "clause-9-fraud-prevention",
    clauseNumber: 9,
    title: "Anti-Fraud, Self-Referral Prevention & Zero Attribution Abuse",
    category: "FRAUD_PREVENTION",
    badge: "Zero Abuse",
    summary: "Self-enrollments under one's own code, dummy accounts, referral cartels, or cookie stuffing are strictly banned and lead to immediate termination.",
    fullText:
      "Self-referrals (enrolling oneself under one's own referral code), circular referral rings, creating dummy or ghost client profiles, and manipulating browser cookies or attribution redirects are strictly forbidden. Any fraudulent attempt to manipulate the attribution engine or generate artificial commission claims will trigger immediate revocation of Partner accreditation, permanent account suspension, and complete forfeiture of unpaid balances.",
  },
  {
    id: "clause-10-termination-ip",
    clauseNumber: 10,
    title: "Intellectual Property Rights & Termination of Accreditation",
    category: "TERMINATION",
    badge: "Accreditation",
    summary: "P2IP proprietary materials belong exclusively to Path to Inner Peace. Any breach gives P2IP the right to terminate accreditation and portal access.",
    fullText:
      "All course materials, video recordings, guided pranayama audio tracks, slide decks, logos, trademarks, and branding assets are the exclusive intellectual property of Path to Inner Peace. The Partner is granted a revocable, non-exclusive license to share official referral assets solely for client referral activities during active accreditation. Any breach of these Client Referral Terms empowers Path to Inner Peace to terminate Partner accreditation with immediate effect and deactivate the Partner Portal.",
  },
];

export const PARTNER_TERMS_FULL_TEXT = `PATH TO INNER PEACE - ACCREDITED PARTNER CLIENT REFERRAL CODE OF CONDUCT (v1.3)

${PARTNER_CLIENT_REFERRAL_TERMS.map(
  (c) => `CLAUSE ${c.clauseNumber}: ${c.title.toUpperCase()}
[${c.badge}]
${c.fullText}`
).join("\n\n")}

---
By registering and accessing the Path to Inner Peace Partner Portal, you solemnly agree to observe and adhere strictly to all the above 10 clauses for referring clients.`;
