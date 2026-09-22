/**
 * FormSubmit Service
 * Automatically pushes all new partner & new client registrations to FormSubmit
 * Target Email: mchatterjee69@gmail.com
 */

const FORMSUBMIT_EMAIL = "mchatterjee69@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;

export interface PartnerRegistrationPayload {
  partnerId: string;
  name: string;
  code: string;
  email: string;
  mobile: string;
  partnerType?: string;
  organisation?: string;
  location?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  upiId?: string;
  bankName?: string;
  referralUrl?: string;
  registrationDate?: string;
}

export interface ClientRegistrationPayload {
  leadId: string;
  clientName: string;
  email?: string;
  mobile: string;
  location?: string;
  interestedProgramName?: string;
  partnerName?: string;
  partnerCode?: string;
  partnerId?: string;
  referralSource?: string;
  preferredContactTime?: string;
  notes?: string;
  consent?: boolean;
  registrationDate?: string;
}

/**
 * Pushes new partner registration details to FormSubmit (mchatterjee69@gmail.com)
 */
export async function pushPartnerRegistrationToFormSubmit(
  data: PartnerRegistrationPayload
): Promise<boolean> {
  const timestamp = data.registrationDate || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  
  const payload = {
    _subject: `🌿 New Partner Registered: ${data.name} (${data.code}) - P2IP PartnerSphere`,
    _template: "table",
    _captcha: "false",
    "Registration Type": "NEW PARTNER ONBOARDING",
    "Partner Name": data.name,
    "Partner ID": data.partnerId,
    "Referral Code": data.code,
    "Email Address": data.email,
    "Mobile / WhatsApp": data.mobile,
    "Partner Type": data.partnerType || "Individual Referral Partner",
    "Organisation": data.organisation || "Independent Practice",
    "Location / City": data.location || "India",
    "PAN Card Number": data.panNumber || "Not Provided",
    "Aadhaar Number": data.aadhaarNumber || "Not Provided",
    "UPI ID": data.upiId || "Not Provided",
    "Bank Name": data.bankName || "Not Provided",
    "Referral URL": data.referralUrl || `https://pathtoinnerpeace.in/r/${data.code}`,
    "Registered At": timestamp,
    "System": "P2IP PartnerSphere CRM (Production)",
  };

  try {
    // 1. Direct client-side push to FormSubmit
    const clientPromise = fetch(FORMSUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("Client-side FormSubmit notice:", err);
      return null;
    });

    // 2. Server-side backup relay to ensure delivery
    const serverPromise = fetch("/api/notify/formsubmit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("Server relay FormSubmit notice:", err);
      return null;
    });

    await Promise.race([clientPromise, serverPromise]);
    console.log("✅ Partner registration dispatched to FormSubmit (mchatterjee69@gmail.com)");
    return true;
  } catch (error) {
    console.error("❌ Failed to push partner registration to FormSubmit:", error);
    return false;
  }
}

/**
 * Pushes new client / referral registration details to FormSubmit (mchatterjee69@gmail.com)
 */
export async function pushClientRegistrationToFormSubmit(
  data: ClientRegistrationPayload
): Promise<boolean> {
  const timestamp = data.registrationDate || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const payload = {
    _subject: `🌿 New Client / Referral Registered: ${data.clientName} - P2IP PartnerSphere`,
    _template: "table",
    _captcha: "false",
    "Registration Type": "NEW CLIENT / REFERRAL REGISTRATION",
    "Client Name": data.clientName,
    "Client Mobile": data.mobile,
    "Client Email": data.email || "Not Provided",
    "City / Location": data.location || "India",
    "Interested Program": data.interestedProgramName || "FREE 5-Day Mind Reset Challenge",
    "Referred By Partner": data.partnerName ? `${data.partnerName} (${data.partnerCode || data.partnerId || ""})` : "Direct P2IP",
    "Partner ID": data.partnerId || "N/A",
    "Partner Code": data.partnerCode || "N/A",
    "Referral Source": data.referralSource || "Direct Partner Referral",
    "Preferred Contact Time": data.preferredContactTime || "Anytime",
    "Notes / Context": data.notes || "None",
    "Consent Given": data.consent ? "Yes" : "No",
    "Referral ID": data.leadId,
    "Registered At": timestamp,
    "System": "P2IP PartnerSphere CRM (Production)",
  };

  try {
    // 1. Direct client-side push to FormSubmit
    const clientPromise = fetch(FORMSUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("Client-side FormSubmit notice:", err);
      return null;
    });

    // 2. Server-side backup relay to ensure delivery
    const serverPromise = fetch("/api/notify/formsubmit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("Server relay FormSubmit notice:", err);
      return null;
    });

    await Promise.race([clientPromise, serverPromise]);
    console.log("✅ Client registration dispatched to FormSubmit (mchatterjee69@gmail.com)");
    return true;
  } catch (error) {
    console.error("❌ Failed to push client registration to FormSubmit:", error);
    return false;
  }
}
