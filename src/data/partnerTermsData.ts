export interface PartnerTermClause {
  id: string;
  clauseNumber: number;
  title: string;
  category:
    | "PURPOSE"
    | "STATUS"
    | "EARNINGS"
    | "INTEGRITY"
    | "COMMUNICATION"
    | "HEALTH_CLAIMS"
    | "DISCLOSURE"
    | "REPRESENTATION"
    | "PRIVACY"
    | "COMMISSIONS"
    | "REFUNDS"
    | "IP_RIGHTS"
    | "SOCIAL_CONDUCT"
    | "TESTIMONIALS"
    | "FINANCIAL"
    | "RESPONSIBILITY"
    | "EXCLUSIVITY"
    | "CONFIDENTIALITY"
    | "TERMINATION"
    | "CHANGES"
    | "COMPLIANCE"
    | "RESULTS";
  badge: string;
  summary: string;
  fullText: string;
  bulletPoints?: string[];
}

export interface CampaignCommissionRule {
  id: string;
  campaignName: string;
  targetAudience: string;
  programPrice: string;
  commissionStructure: string;
  starterRate: string;
  eliteRate: string;
  qualifyingAction: string;
  payoutTimeline: string;
  refundPolicy: string;
}

export interface MandatoryDisclosure {
  id: string;
  label: string;
  format: string;
  usage: string;
}

export const P2IP_PARTNERSPHERE_HEADER = {
  title: "P2IP PARTNERSPHERE",
  subtitle: "Partner Terms & Conditions & Disclosure",
  program: "P2IP PartnerSphere",
  organisation: "Path to Inner Peace",
  tagline: "Partner • Refer • Transform • Earn",
  preamble:
    "By joining P2IP PartnerSphere, the Partner confirms that they have read, understood, and agreed to the following Terms & Conditions.",
  legalReviewNotice:
    "LEGAL NOTICE: Before making this legally binding, have an Indian lawyer review the final version — especially the commission, privacy/data, refund, termination, and dispute-resolution clauses.",
};

export const P2IP_PARTNERSPHERE_CLAUSES: PartnerTermClause[] = [
  {
    id: "clause-1",
    clauseNumber: 1,
    title: "Purpose of the Partnership",
    category: "PURPOSE",
    badge: "Purpose & Mission",
    summary:
      "The Partner joins P2IP PartnerSphere as an independent referral/community partner to introduce eligible individuals to Path to Inner Peace offerings.",
    fullText:
      "The Partner joins P2IP PartnerSphere as an independent referral/community partner to introduce eligible individuals or communities to Path to Inner Peace programs, workshops, challenges, consultations, or other approved offerings. The partnership is intended to create mutually beneficial opportunities while providing audiences with access to relevant wellness and personal-development experiences.",
  },
  {
    id: "clause-2",
    clauseNumber: 2,
    title: "Independent Partner Status",
    category: "STATUS",
    badge: "Independent Status",
    summary:
      "The Partner is an independent referral associate, not an employee, agent, therapist, or legal spokesperson.",
    fullText:
      "The Partner is an independent partner/referral associate and is not an employee, agent, legal representative, franchisee, or joint-venture partner of Path to Inner Peace. The Partner must not represent themselves as an employee, psychologist, therapist, authorised counsellor, or official spokesperson of Path to Inner Peace unless separately authorised in writing.",
  },
  {
    id: "clause-3",
    clauseNumber: 3,
    title: "No Guaranteed Earnings",
    category: "EARNINGS",
    badge: "No Earning Guarantee",
    summary:
      "Joining PartnerSphere does not guarantee any income, leads, clients, or commissions. Earnings depend on genuine, verified referrals.",
    fullText:
      "Joining PartnerSphere does not guarantee any income, number of leads, registrations, clients, commissions, or other financial benefits. Partner earnings depend on genuine, verified referrals and the applicable commission structure communicated by Path to Inner Peace.",
  },
  {
    id: "clause-4",
    clauseNumber: 4,
    title: "Referral Integrity",
    category: "INTEGRITY",
    badge: "Referral Integrity",
    summary:
      "The Partner agrees to generate only genuine referrals. Fake registrations, self-referrals, bot traffic, and database scraping are strictly prohibited.",
    fullText:
      "The Partner agrees to generate only genuine referrals. The Partner must not: create fake registrations or duplicate accounts; register themselves or others solely to generate incentives; use bots, automated registrations, misleading traffic, or fabricated information; spam individuals or groups; purchase or use third-party databases without appropriate permission; or misrepresent the identity or requirements of prospective participants. Path to Inner Peace may reject, reverse, or withhold incentives associated with invalid, fraudulent, duplicate, cancelled, refunded, or otherwise non-qualifying referrals.",
    bulletPoints: [
      "Create fake registrations or duplicate accounts.",
      "Register themselves or others solely to generate incentives.",
      "Use bots, automated registrations, misleading traffic, or fabricated information.",
      "Spam individuals or groups.",
      "Purchase or use third-party databases without appropriate permission.",
      "Misrepresent the identity or requirements of prospective participants.",
    ],
  },
  {
    id: "clause-5",
    clauseNumber: 5,
    title: "Approved Promotional Communication",
    category: "COMMUNICATION",
    badge: "Approved Creatives",
    summary:
      "The Partner may only use promotional materials, brand assets, and claims approved or supplied by Path to Inner Peace.",
    fullText:
      "The Partner may use only promotional materials, logos, photographs, videos, descriptions, pricing information, claims, and other brand assets approved or supplied by Path to Inner Peace. Any significant modification to official promotional material requires prior approval. The Partner must not make claims that are medically, psychologically, scientifically, financially, or otherwise misleading.",
  },
  {
    id: "clause-6",
    clauseNumber: 6,
    title: "Wellness & Health-Related Claims",
    category: "HEALTH_CLAIMS",
    badge: "Non-Clinical Boundary",
    summary:
      "P2IP programs are intended for wellness, mindfulness, and personal development. Partners must never claim programs diagnose, cure, or replace medical care.",
    fullText:
      "Path to Inner Peace's programs are intended for wellness, education, mindfulness, personal development, stress management, and related purposes. Where an individual's situation appears to require professional medical or mental-health support, the Partner should encourage the individual to seek an appropriately qualified professional.",
    bulletPoints: [
      "Diagnoses or treats a medical or psychiatric condition.",
      "Cures depression, anxiety, trauma, addiction, or any disease.",
      "Guarantees a specific psychological, financial, relationship, career, or health outcome.",
      "Replaces professional medical, psychological, psychiatric, or emergency care.",
    ],
  },
  {
    id: "clause-7",
    clauseNumber: 7,
    title: "Transparent Partnership Disclosure",
    category: "DISCLOSURE",
    badge: "Mandatory Disclosure",
    summary:
      "Partners must clearly disclose their commercial/referral relationship to their audience whenever sharing links or promotional content.",
    fullText:
      "Where the Partner promotes P2IP and may receive a commission, incentive, reward, benefit, or other consideration for referrals, the Partner agrees to make the commercial relationship clear and understandable to the audience. The disclosure should be visible and understandable and should not be hidden in a way that prevents the audience from reasonably noticing it.",
    bulletPoints: [
      '“Paid Partnership with Path to Inner Peace”',
      '“Referral Partnership with Path to Inner Peace”',
      '“I may receive a referral benefit if you join through my link.”',
    ],
  },
  {
    id: "clause-8",
    clauseNumber: 8,
    title: "No Misrepresentation of P2IP",
    category: "REPRESENTATION",
    badge: "No Misrepresentation",
    summary:
      "Partners must not alter P2IP brand identity, make unauthorized promises, guarantee results, or claim to be founders or staff.",
    fullText:
      "The Partner must not: alter the name or identity of Path to Inner Peace; make unauthorised promises on behalf of P2IP; guarantee admission, results, refunds, discounts, or commissions; present personal opinions as official P2IP statements; or claim that they are a founder, employee, therapist, psychologist, representative, or authorised professional of P2IP unless expressly authorised.",
    bulletPoints: [
      "Alter the name or identity of Path to Inner Peace.",
      "Make unauthorised promises on behalf of P2IP.",
      "Guarantee admission, results, refunds, discounts, or commissions.",
      "Present personal opinions as official P2IP statements.",
      "Claim that they are a founder, employee, therapist, psychologist, representative, or authorised professional of P2IP unless expressly authorised.",
    ],
  },
  {
    id: "clause-9",
    clauseNumber: 9,
    title: "Participant Information & Privacy",
    category: "PRIVACY",
    badge: "Data Privacy & Consent",
    summary:
      "Participant data must be handled responsibly and solely for legitimate referral purposes. Data selling, sharing, or unauthorized scraping is barred.",
    fullText:
      "Any participant information obtained through the partnership must be handled responsibly and only for legitimate partnership-related purposes. The Partner must not sell, publish, share, misuse, or transfer participant information to unrelated third parties without appropriate consent or legal basis. Where P2IP provides a registration/referral system, the Partner should direct participants to the official registration process wherever possible.",
  },
  {
    id: "clause-10",
    clauseNumber: 10,
    title: "Commission & Incentive Terms",
    category: "COMMISSIONS",
    badge: "Commission Terms",
    summary:
      "Commissions are payable only on verified and qualifying transactions. P2IP reserves the right to review transactions for fraud or duplication.",
    fullText:
      "Commission rates, qualifying actions, payment timelines, minimum payout thresholds, cancellation/refund treatment, and applicable eligibility requirements will be communicated through the PartnerSphere system or applicable program-specific terms. Unless specifically stated otherwise, commission is payable only on verified and qualifying transactions/referrals. Path to Inner Peace reserves the right to review transactions for fraud, duplication, cancellation, refund, or other irregularities before releasing payment.",
  },
  {
    id: "clause-11",
    clauseNumber: 11,
    title: "Refunds & Reversals",
    category: "REFUNDS",
    badge: "Clawback & Reversals",
    summary:
      "If a referred participant cancels or receives a refund, the associated commission is cancelled or adjusted against future payouts.",
    fullText:
      "Where a referred customer cancels, receives a refund, reverses a payment, or otherwise ceases to qualify under the applicable commission rules, any associated commission may be cancelled or adjusted. If a commission has already been paid, the corresponding amount may be adjusted against future eligible commissions, subject to applicable law.",
  },
  {
    id: "clause-12",
    clauseNumber: 12,
    title: "Brand & Intellectual Property",
    category: "IP_RIGHTS",
    badge: "Intellectual Property",
    summary:
      "All logos, course materials, videos, and names remain the property of P2IP. Partners receive a limited, revocable license for authorized promotion.",
    fullText:
      "The Path to Inner Peace name, logo, PartnerSphere name, program names, designs, written content, videos, photographs, educational materials, and other intellectual property remain the property of their respective owners. The Partner receives a limited, non-exclusive, revocable permission to use approved P2IP materials solely for authorised promotional activities during the partnership.",
  },
  {
    id: "clause-13",
    clauseNumber: 13,
    title: "Social Media Conduct",
    category: "SOCIAL_CONDUCT",
    badge: "Social Media Rules",
    summary:
      "Partners must not promote P2IP through discriminatory speech, offensive content, misleading ads, fake testimonials, or spam.",
    fullText:
      "The Partner agrees not to promote P2IP through: hate speech or discriminatory content; offensive or unlawful content; misleading advertising; fake testimonials or fabricated success stories; spam or harassment; or content that could reasonably damage the reputation of Path to Inner Peace.",
    bulletPoints: [
      "Hate speech or discriminatory content.",
      "Offensive or unlawful content.",
      "Misleading advertising.",
      "Fake testimonials or fabricated success stories.",
      "Spam or harassment.",
      "Content that could reasonably damage the reputation of Path to Inner Peace.",
    ],
  },
  {
    id: "clause-14",
    clauseNumber: 14,
    title: "Testimonials & Participant Stories",
    category: "TESTIMONIALS",
    badge: "Authentic Stories",
    summary:
      "Partners must never fabricate testimonials. Real photos, videos, or stories may only be published with verified participant consent.",
    fullText:
      "A Partner must not create, edit, fabricate, or publish a participant testimonial as though it were an independent genuine statement. Any participant photograph, video, name, testimonial, or personal story should be published only where appropriate consent has been obtained.",
  },
  {
    id: "clause-15",
    clauseNumber: 15,
    title: "No Unauthorised Collection of Money",
    category: "FINANCIAL",
    badge: "Direct Payments",
    summary:
      "Partners must never collect fees or cash directly from participants; all payments must flow through official P2IP gateways.",
    fullText:
      "The Partner must not collect payments on behalf of Path to Inner Peace unless specifically authorised in writing. Participants should generally be directed to the official P2IP payment/registration channels.",
  },
  {
    id: "clause-16",
    clauseNumber: 16,
    title: "Partner Responsibilities",
    category: "RESPONSIBILITY",
    badge: "Partner Scope",
    summary:
      "The Partner's role is introducing audiences and sharing accurate information; they are not responsible for delivering sessions or clinical care.",
    fullText:
      "The Partner's primary responsibility is to introduce relevant audiences and communicate approved information accurately. Unless separately agreed, the Partner is not responsible for conducting P2IP sessions, providing therapy/counselling, handling participant complaints, or delivering P2IP's services.",
  },
  {
    id: "clause-17",
    clauseNumber: 17,
    title: "P2IP Responsibilities",
    category: "RESPONSIBILITY",
    badge: "P2IP Commitments",
    summary:
      "P2IP provides approved marketing creatives, registration systems, program delivery, participant communication, and commission tracking.",
    fullText:
      "Subject to the applicable program, Path to Inner Peace may provide: official promotional creatives; registration/referral mechanisms; program information; participant communication; program delivery; partner tracking; and applicable referral incentives/commissions. Specific services may vary by campaign or partnership.",
    bulletPoints: [
      "Official promotional creatives.",
      "Registration/referral mechanisms.",
      "Program information.",
      "Participant communication.",
      "Program delivery.",
      "Partner tracking.",
      "Applicable referral incentives/commissions.",
    ],
  },
  {
    id: "clause-18",
    clauseNumber: 18,
    title: "No Exclusivity",
    category: "EXCLUSIVITY",
    badge: "Non-Exclusive",
    summary:
      "The partnership is non-exclusive; partners may work with other organizations provided confidential information and IP are protected.",
    fullText:
      "Unless separately agreed in writing, the partnership is non-exclusive. The Partner may work with other organisations, provided that doing so does not involve misuse of P2IP confidential information, intellectual property, participant information, or brand assets.",
  },
  {
    id: "clause-19",
    clauseNumber: 19,
    title: "Confidentiality",
    category: "CONFIDENTIALITY",
    badge: "Confidentiality",
    summary:
      "Non-public pricing, partner data, participant details, and internal business methodologies must be kept strictly confidential.",
    fullText:
      "The Partner agrees to keep confidential any non-public business information, pricing arrangements, partner data, participant information, internal materials, or other confidential information received through PartnerSphere.",
  },
  {
    id: "clause-20",
    clauseNumber: 20,
    title: "Suspension or Termination",
    category: "TERMINATION",
    badge: "Termination Rules",
    summary:
      "Either party may terminate. P2IP may suspend access for fraud, brand misuse, spam, or breaches without prejudice to verified commissions.",
    fullText:
      "Either party may discontinue the partnership subject to the applicable terms. Path to Inner Peace may suspend or terminate a Partner's access where there is reasonable concern regarding fraudulent referrals, misleading claims, brand misuse, harassment/spam, privacy violations, unauthorized financial collection, misconduct, or breach of these Terms & Conditions. Termination does not automatically cancel legitimate commissions already earned, subject to verification, refunds, reversals, and the applicable commission rules.",
    bulletPoints: [
      "Fraudulent referrals.",
      "Misleading claims.",
      "Brand misuse.",
      "Harassment or spam.",
      "Privacy violations.",
      "Unauthorised financial collection.",
      "Misconduct.",
      "Breach of these Terms & Conditions.",
    ],
  },
  {
    id: "clause-21",
    clauseNumber: 21,
    title: "Changes to Terms",
    category: "CHANGES",
    badge: "Policy Updates",
    summary:
      "P2IP may update policies, commissions, or terms periodically; material updates will be notified through PartnerSphere.",
    fullText:
      "Path to Inner Peace may update PartnerSphere policies, commission structures, promotional rules, or program-specific terms from time to time. Material changes will be communicated through appropriate channels. Continued participation after the effective date of revised terms may constitute acceptance where legally permitted.",
  },
  {
    id: "clause-22",
    clauseNumber: 22,
    title: "Compliance With Law",
    category: "COMPLIANCE",
    badge: "Statutory Compliance",
    summary:
      "Partners must strictly comply with all applicable advertising standards, consumer protection, privacy regulations, and Indian tax laws (TDS Sec 194H).",
    fullText:
      "The Partner agrees to comply with all applicable laws, regulations, advertising standards, consumer-protection requirements, privacy requirements, and platform-specific rules applicable to their promotional activities.",
  },
  {
    id: "clause-23",
    clauseNumber: 23,
    title: "No Guarantee of Results",
    category: "RESULTS",
    badge: "Honest Outcomes",
    summary:
      "Participation in P2IP programs does not guarantee particular personal, financial, emotional, or health outcomes. Partners must communicate this honestly.",
    fullText:
      "Participation in P2IP programs does not guarantee a particular personal, professional, relationship, financial, emotional, or wellness outcome. Partners must communicate this principle honestly when promoting P2IP.",
  },
];

export const P2IP_ACKNOWLEDGEMENT_CHECKBOXES = [
  {
    id: "ack-1",
    label: "I have read and understood these Terms & Conditions.",
  },
  {
    id: "ack-2",
    label:
      "I understand that I am an independent Partner and not an employee of Path to Inner Peace.",
  },
  {
    id: "ack-3",
    label: "I agree to promote P2IP honestly and responsibly.",
  },
  {
    id: "ack-4",
    label: "I will not create fake or fraudulent referrals.",
  },
  {
    id: "ack-5",
    label:
      "I will not make unauthorised medical, psychological, therapeutic, or guaranteed-result claims.",
  },
  {
    id: "ack-6",
    label:
      "I will disclose any applicable referral/commission relationship to my audience.",
  },
  {
    id: "ack-7",
    label: "I will protect participant information and use it responsibly.",
  },
  {
    id: "ack-8",
    label: "I will use P2IP's brand and promotional materials only as authorised.",
  },
  {
    id: "ack-9",
    label:
      "I understand that earnings are not guaranteed and depend on qualifying referrals/actions.",
  },
  {
    id: "ack-10",
    label:
      "I agree to comply with the PartnerSphere Terms & Conditions and applicable laws.",
  },
];

export const P2IP_CAMPAIGN_COMMISSION_RULES: CampaignCommissionRule[] = [
  {
    id: "camp-free-reset",
    campaignName: "FREE 5-Day Mind Reset Challenge",
    targetAudience:
      "Stress relief seekers, beginner breathwork, corporate professionals",
    programPrice: "FREE (₹0)",
    commissionStructure:
      "₹50 activation reward per verified active participant + counts toward monthly milestone bonuses",
    starterRate: "₹50 / verified participant",
    eliteRate: "₹100 / verified participant + milestone multiplier",
    qualifyingAction:
      "Participant completes onboarding registration and attends at least 1 live session",
    payoutTimeline: "Monthly settlement by 5th of subsequent calendar month",
    refundPolicy: "Non-reversable once attendance is verified by P2IP Care Team",
  },
  {
    id: "camp-mind-mastery-21",
    campaignName: "Mind Mastery: 21-Day Daily Immersion",
    targetAudience:
      "Individuals wanting habitual meditation, anxiety regulation, emotional fitness",
    programPrice: "₹2,499",
    commissionStructure: "20% to 35% revenue share based on partner tier level",
    starterRate: "20% (₹500 / enrollment)",
    eliteRate: "35% (₹875 / enrollment)",
    qualifyingAction:
      "Successful paid enrollment through partner link/code after 7-day refund cooling window",
    payoutTimeline: "Monthly via direct NEFT/UPI with statutory Sec 194H TDS",
    refundPolicy:
      "If client cancels within 7-day guarantee, commission is reversed/clawed back",
  },
  {
    id: "camp-sleep-intensive",
    campaignName: "Guided Breathwork & Deep Sleep Reset",
    targetAudience:
      "Insomnia, chronic fatigue, night anxiety, shift-work professionals",
    programPrice: "₹4,999",
    commissionStructure: "20% to 35% tiered commission structure",
    starterRate: "20% (₹1,000 / enrollment)",
    eliteRate: "35% (₹1,750 / enrollment)",
    qualifyingAction:
      "Client completes full course checkout through partner referral code",
    payoutTimeline: "Monthly via direct bank transfer / UPI",
    refundPolicy:
      "Subject to 7-day cooling period; deducted if client requests full refund",
  },
  {
    id: "camp-executive-coaching",
    campaignName: "1-on-1 Emotional Transformation & Executive Coaching",
    targetAudience:
      "Founders, C-suite executives, high-performance professionals requiring private consultation",
    programPrice: "₹15,000",
    commissionStructure: "High-ticket advisory commission (20% to 35%)",
    starterRate: "20% (₹3,000 / client)",
    eliteRate: "35% (₹5,250 / client)",
    qualifyingAction:
      "Paid consultation booking validated and attended by certified P2IP lead facilitator",
    payoutTimeline: "Within 14 days of successful consultation delivery",
    refundPolicy:
      "Clawed back only if consultation is cancelled before commencement",
  },
];

export const P2IP_MANDATORY_DISCLOSURES: MandatoryDisclosure[] = [
  {
    id: "disc-1",
    label: "Standard Social Media / Post Disclosure",
    format: "“Paid Partnership with Path to Inner Peace”",
    usage:
      "Use when posting reels, Instagram stories, LinkedIn articles, or video content featuring P2IP.",
  },
  {
    id: "disc-2",
    label: "Referral Link / Bio Disclosure",
    format: "“Referral Partnership with Path to Inner Peace”",
    usage:
      "Place in link trees, email signatures, blog post banners, or message footers.",
  },
  {
    id: "disc-3",
    label: "Direct Messaging / WhatsApp Disclosure",
    format:
      "“I may receive a referral benefit if you join through my link.”",
    usage:
      "Include when personally messaging friends, colleagues, community members, or wellness groups.",
  },
];

// Backwards-compatible aliases for existing components
export const PARTNER_CLIENT_REFERRAL_TERMS = P2IP_PARTNERSPHERE_CLAUSES;

export const P2IP_PARTNERSPHERE_FULL_TEXT = `P2IP PARTNERSPHERE

Partner Terms & Conditions & Disclosure

Program: P2IP PartnerSphere
Organisation: Path to Inner Peace
Tagline: Partner • Refer • Transform • Earn

By joining P2IP PartnerSphere, the Partner confirms that they have read, understood, and agreed to the following Terms & Conditions.

1. Purpose of the Partnership
The Partner joins P2IP PartnerSphere as an independent referral/community partner to introduce eligible individuals or communities to Path to Inner Peace programs, workshops, challenges, consultations, or other approved offerings.
The partnership is intended to create mutually beneficial opportunities while providing audiences with access to relevant wellness and personal-development experiences.

2. Independent Partner Status
The Partner is an independent partner/referral associate and is not an employee, agent, legal representative, franchisee, or joint-venture partner of Path to Inner Peace.
The Partner must not represent themselves as an employee, psychologist, therapist, authorised counsellor, or official spokesperson of Path to Inner Peace unless separately authorised in writing.

3. No Guaranteed Earnings
Joining PartnerSphere does not guarantee any income, number of leads, registrations, clients, commissions, or other financial benefits.
Partner earnings depend on genuine, verified referrals and the applicable commission structure communicated by Path to Inner Peace.

4. Referral Integrity
The Partner agrees to generate only genuine referrals.
The Partner must not:
- Create fake registrations or duplicate accounts.
- Register themselves or others solely to generate incentives.
- Use bots, automated registrations, misleading traffic, or fabricated information.
- Spam individuals or groups.
- Purchase or use third-party databases without appropriate permission.
- Misrepresent the identity or requirements of prospective participants.
Path to Inner Peace may reject, reverse, or withhold incentives associated with invalid, fraudulent, duplicate, cancelled, refunded, or otherwise non-qualifying referrals.

5. Approved Promotional Communication
The Partner may use only promotional materials, logos, photographs, videos, descriptions, pricing information, claims, and other brand assets approved or supplied by Path to Inner Peace.
Any significant modification to official promotional material requires prior approval.
The Partner must not make claims that are medically, psychologically, scientifically, financially, or otherwise misleading.

6. Wellness & Health-Related Claims
Path to Inner Peace's programs are intended for wellness, education, mindfulness, personal development, stress management, and related purposes.
The Partner must not claim that any P2IP program:
- Diagnoses or treats a medical or psychiatric condition.
- Cures depression, anxiety, trauma, addiction, or any disease.
- Guarantees a specific psychological, financial, relationship, career, or health outcome.
- Replaces professional medical, psychological, psychiatric, or emergency care.
Where an individual's situation appears to require professional medical or mental-health support, the Partner should encourage the individual to seek an appropriately qualified professional.

7. Transparent Partnership Disclosure
Where the Partner promotes P2IP and may receive a commission, incentive, reward, benefit, or other consideration for referrals, the Partner agrees to make the commercial relationship clear and understandable to the audience.
Appropriate disclosures may include:
“Paid Partnership with Path to Inner Peace”
“Referral Partnership with Path to Inner Peace”
“I may receive a referral benefit if you join through my link.”
The disclosure should be visible and understandable and should not be hidden in a way that prevents the audience from reasonably noticing it.

8. No Misrepresentation of P2IP
The Partner must not:
- Alter the name or identity of Path to Inner Peace.
- Make unauthorised promises on behalf of P2IP.
- Guarantee admission, results, refunds, discounts, or commissions.
- Present personal opinions as official P2IP statements.
- Claim that they are a founder, employee, therapist, psychologist, representative, or authorised professional of P2IP unless expressly authorised.

9. Participant Information & Privacy
Any participant information obtained through the partnership must be handled responsibly and only for legitimate partnership-related purposes.
The Partner must not sell, publish, share, misuse, or transfer participant information to unrelated third parties without appropriate consent or legal basis.
Where P2IP provides a registration/referral system, the Partner should direct participants to the official registration process wherever possible.

10. Commission & Incentive Terms
Commission rates, qualifying actions, payment timelines, minimum payout thresholds, cancellation/refund treatment, and applicable eligibility requirements will be communicated through the PartnerSphere system or applicable program-specific terms.
Unless specifically stated otherwise, commission is payable only on verified and qualifying transactions/referrals.
Path to Inner Peace reserves the right to review transactions for fraud, duplication, cancellation, refund, or other irregularities before releasing payment.

11. Refunds & Reversals
Where a referred customer cancels, receives a refund, reverses a payment, or otherwise ceases to qualify under the applicable commission rules, any associated commission may be cancelled or adjusted.
If a commission has already been paid, the corresponding amount may be adjusted against future eligible commissions, subject to applicable law.

12. Brand & Intellectual Property
The Path to Inner Peace name, logo, PartnerSphere name, program names, designs, written content, videos, photographs, educational materials, and other intellectual property remain the property of their respective owners.
The Partner receives a limited, non-exclusive, revocable permission to use approved P2IP materials solely for authorised promotional activities during the partnership.

13. Social Media Conduct
The Partner agrees not to promote P2IP through:
- Hate speech or discriminatory content.
- Offensive or unlawful content.
- Misleading advertising.
- Fake testimonials or fabricated success stories.
- Spam or harassment.
- Content that could reasonably damage the reputation of Path to Inner Peace.

14. Testimonials & Participant Stories
A Partner must not create, edit, fabricate, or publish a participant testimonial as though it were an independent genuine statement.
Any participant photograph, video, name, testimonial, or personal story should be published only where appropriate consent has been obtained.

15. No Unauthorised Collection of Money
The Partner must not collect payments on behalf of Path to Inner Peace unless specifically authorised in writing.
Participants should generally be directed to the official P2IP payment/registration channels.

16. Partner Responsibilities
The Partner's primary responsibility is to introduce relevant audiences and communicate approved information accurately.
Unless separately agreed, the Partner is not responsible for conducting P2IP sessions, providing therapy/counselling, handling participant complaints, or delivering P2IP's services.

17. P2IP Responsibilities
Subject to the applicable program, Path to Inner Peace may provide:
- Official promotional creatives.
- Registration/referral mechanisms.
- Program information.
- Participant communication.
- Program delivery.
- Partner tracking.
- Applicable referral incentives/commissions.
Specific services may vary by campaign or partnership.

18. No Exclusivity
Unless separately agreed in writing, the partnership is non-exclusive.
The Partner may work with other organisations, provided that doing so does not involve misuse of P2IP confidential information, intellectual property, participant information, or brand assets.

19. Confidentiality
The Partner agrees to keep confidential any non-public business information, pricing arrangements, partner data, participant information, internal materials, or other confidential information received through PartnerSphere.

20. Suspension or Termination
Either party may discontinue the partnership subject to the applicable terms.
Path to Inner Peace may suspend or terminate a Partner's access where there is reasonable concern regarding:
- Fraudulent referrals.
- Misleading claims.
- Brand misuse.
- Harassment or spam.
- Privacy violations.
- Unauthorised financial collection.
- Misconduct.
- Breach of these Terms & Conditions.
Termination does not automatically cancel legitimate commissions already earned, subject to verification, refunds, reversals, and the applicable commission rules.

21. Changes to Terms
Path to Inner Peace may update PartnerSphere policies, commission structures, promotional rules, or program-specific terms from time to time.
Material changes will be communicated through appropriate channels. Continued participation after the effective date of revised terms may constitute acceptance where legally permitted.

22. Compliance With Law
The Partner agrees to comply with all applicable laws, regulations, advertising standards, consumer-protection requirements, privacy requirements, and platform-specific rules applicable to their promotional activities.

23. No Guarantee of Results
Participation in P2IP programs does not guarantee a particular personal, professional, relationship, financial, emotional, or wellness outcome.
Partners must communicate this principle honestly when promoting P2IP.

24. Acknowledgement
By selecting “I Agree & Join PartnerSphere”, the Partner confirms that:
☐ I have read and understood these Terms & Conditions.
☐ I understand that I am an independent Partner and not an employee of Path to Inner Peace.
☐ I agree to promote P2IP honestly and responsibly.
☐ I will not create fake or fraudulent referrals.
☐ I will not make unauthorised medical, psychological, therapeutic, or guaranteed-result claims.
☐ I will disclose any applicable referral/commission relationship to my audience.
☐ I will protect participant information and use it responsibly.
☐ I will use P2IP's brand and promotional materials only as authorised.
☐ I understand that earnings are not guaranteed and depend on qualifying referrals/actions.
☐ I agree to comply with the PartnerSphere Terms & Conditions and applicable laws.
`;

export const PARTNER_TERMS_FULL_TEXT = P2IP_PARTNERSPHERE_FULL_TEXT;
