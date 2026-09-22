import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { db, initDatabase } from "./server/db";
import {
  getAdminMetrics,
  getPartnerMetrics,
  getPartnerWallet,
  registerPartner,
  getAllPartners,
  getPartnerById,
  updatePartnerStatus,
  createReferral,
  getAllReferrals,
  updateReferralStatus,
  recordCustomerPayment,
  getAllPayments,
  getAllCommissions,
  getCommissionTransactions,
  addPayoutAccount,
  getPayoutAccounts,
  requestPayout,
  approvePayout,
  recordManualPayoutExecution,
  getAllPayouts,
  getFinancialReconciliation,
  resetToCleanProduction,
} from "./server/crmService";

dotenv.config();

// Ensure DB is ready
initDatabase();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// SYSTEM & HEALTH
// ----------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "P2IP PartnerSphere™",
    tagline: "Partner. Refer. Transform. Earn.",
    organization: "Path to Inner Peace",
    website: "https://www.pathtoinnerpeace.in",
    hasGemini: !!process.env.GEMINI_API_KEY,
    database: "SQLite Single Source of Truth",
    productionMode: process.env.NODE_ENV === "production" || process.env.DEMO_MODE !== "true",
  });
});

app.post("/api/system/reset-clean", (req, res) => {
  try {
    const result = resetToCleanProduction();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// DASHBOARDS & COMMERCIAL METRICS
// ----------------------------------------------------
app.get("/api/dashboard/admin", (req, res) => {
  try {
    const metrics = getAdminMetrics();
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/dashboard/partner/:partnerId", (req, res) => {
  try {
    const data = getPartnerMetrics(req.params.partnerId);
    if (!data) return res.status(404).json({ error: "Partner not found" });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to automatically push notifications to FormSubmit in Gmail (mchatterjee69@gmail.com)
async function forwardToFormSubmit(payload: Record<string, any>) {
  try {
    await fetch("https://formsubmit.co/ajax/mchatterjee69@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("[Server FormSubmit] Dispatched to mchatterjee69@gmail.com for:", payload._subject);
  } catch (err: any) {
    console.warn("[Server FormSubmit Notice]:", err.message);
  }
}

// ----------------------------------------------------
// PARTNERS
// ----------------------------------------------------
app.get("/api/partners", (req, res) => {
  try {
    const partners = getAllPartners();
    res.json(partners);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/partners/register", (req, res) => {
  try {
    const partner = registerPartner(req.body);

    if (partner) {
      // Automatically push to FormSubmit in Gmail (mchatterjee69@gmail.com)
      forwardToFormSubmit({
        _subject: `🌿 New Partner Registered: ${partner.name} (${partner.code || partner.id}) - P2IP PartnerSphere`,
        _template: "table",
        _captcha: "false",
        "Registration Type": "NEW PARTNER ONBOARDING",
        "Partner Name": partner.name,
        "Partner ID": partner.id,
        "Referral Code": partner.code,
        "Email Address": partner.email,
        "Mobile / WhatsApp": partner.mobile,
        "Partner Type": partner.partnerType || "Individual Referral Partner",
        "Organisation": partner.organisation || "Independent Practice",
        "City / Location": partner.location || "India",
        "PAN Number": partner.panNumber || "Not Provided",
        "Aadhaar Number": partner.aadhaarNumber || "Not Provided",
        "Referral Link": `https://pathtoinnerpeace.in/r/${partner.code}`,
        "Registered At": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        "Source": "PartnerSphere Registration API / Portal",
      });
    }

    res.json({ success: true, partner });
  } catch (err: any) {
    const status = err.message?.includes("Duplicate registration prohibited") ? 409 : 400;
    res.status(status).json({ error: err.message, isDuplicate: status === 409 });
  }
});

app.get("/api/partners/:id", (req, res) => {
  try {
    const partner = getPartnerById(req.params.id);
    if (!partner) return res.status(404).json({ error: "Partner not found" });
    res.json(partner);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/partners/:id/status", (req, res) => {
  try {
    const { status, adminUser } = req.body;
    const updated = updatePartnerStatus(req.params.id, status, adminUser);
    res.json({ success: true, partner: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/partners/:id/wallet", (req, res) => {
  try {
    const wallet = getPartnerWallet(req.params.id);
    res.json(wallet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/partners/:id/payout-accounts", (req, res) => {
  try {
    const accounts = getPayoutAccounts(req.params.id);
    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/partners/:id/payout-accounts", (req, res) => {
  try {
    const account = addPayoutAccount({
      partnerId: req.params.id,
      ...req.body,
    });
    res.json({ success: true, account });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// REFERRALS
// ----------------------------------------------------
app.get("/api/referrals", (req, res) => {
  try {
    const partnerId = req.query.partnerId as string | undefined;
    const referrals = getAllReferrals(partnerId);
    res.json(referrals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/referrals", (req, res) => {
  try {
    const referral = createReferral(req.body);

    if (referral) {
      // Automatically push to FormSubmit in Gmail (mchatterjee69@gmail.com)
      forwardToFormSubmit({
        _subject: `🌿 New Client / Referral Registered: ${referral.clientName} - P2IP PartnerSphere`,
        _template: "table",
        _captcha: "false",
        "Registration Type": "NEW CLIENT / REFERRAL REGISTRATION",
        "Client Name": referral.clientName,
        "Client Mobile": referral.mobile,
        "Client Email": referral.email || "Not Provided",
        "City / Location": referral.location || "India",
        "Interested Program": referral.interestedProgramName || "FREE 5-Day Mind Reset Challenge",
        "Referred By Partner ID": referral.partnerId,
        "Partner Name": referral.partnerName || req.body.partnerName || "P2IP Partner",
        "Referral Source": referral.referralSource || "Direct Partner Referral",
        "Notes / Comments": referral.notes || "None",
        "Referral ID": referral.id,
        "Registered At": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        "Source": "PartnerSphere Referral API / Web Form",
      });
    }

    res.json({ success: true, referral });
  } catch (err: any) {
    const status = err.message?.includes("Duplicate registration prohibited") ? 409 : 400;
    res.status(status).json({ error: err.message, isDuplicate: status === 409 });
  }
});

app.patch("/api/referrals/:id/status", (req, res) => {
  try {
    const { status, adminUser } = req.body;
    const updated = updateReferralStatus(req.params.id, status, adminUser);
    res.json({ success: true, referral: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// PAYMENTS & COMMISSIONS
// ----------------------------------------------------
app.get("/api/payments", (req, res) => {
  try {
    const payments = getAllPayments();
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payments", (req, res) => {
  try {
    const result = recordCustomerPayment(req.body);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/commissions", (req, res) => {
  try {
    const partnerId = req.query.partnerId as string | undefined;
    const commissions = getAllCommissions(partnerId);
    res.json(commissions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/commissions/transactions/:partnerId", (req, res) => {
  try {
    const txns = getCommissionTransactions(req.params.partnerId);
    res.json(txns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// PAYOUTS
// ----------------------------------------------------
app.get("/api/payouts", (req, res) => {
  try {
    const partnerId = req.query.partnerId as string | undefined;
    const payouts = getAllPayouts(partnerId);
    res.json(payouts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payouts/request", (req, res) => {
  try {
    const { partnerId, requestedAmount, payoutAccountId } = req.body;
    const payout = requestPayout(partnerId, Number(requestedAmount), payoutAccountId);
    res.json({ success: true, payout });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/payouts/:id/approve", (req, res) => {
  try {
    const { adminUser } = req.body;
    const payout = approvePayout(req.params.id, adminUser);
    res.json({ success: true, payout });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/payouts/:id/record-manual-payment", (req, res) => {
  try {
    const payout = recordManualPayoutExecution({
      payoutId: req.params.id,
      ...req.body,
    });
    res.json({ success: true, payout });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// PRODUCTS CATALOGUE
// ----------------------------------------------------
app.get("/api/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM products WHERE is_active = 1").all();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// FINANCIAL RECONCILIATION
// ----------------------------------------------------
app.get("/api/reconciliation", (req, res) => {
  try {
    const recon = getFinancialReconciliation();
    res.json(recon);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// AUDIT LOGS
// ----------------------------------------------------
app.get("/api/audit-logs", (req, res) => {
  try {
    const logs = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100").all();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// AI ASSISTANTS (STRICTLY GROUNDED IN DATABASE FIGURES)
// ----------------------------------------------------
app.post("/api/ai/partner-assistant", async (req, res) => {
  try {
    const { prompt, partnerId, partnerContext, catalogueContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Retrieve real partner metrics from database
    const realMetrics = partnerId ? getPartnerMetrics(partnerId) : null;

    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are P2IP Partner AI, the dedicated assistant for referral partners of Path to Inner Peace (P2IP PartnerSphere™).
Brand: Path to Inner Peace (Website: https://www.pathtoinnerpeace.in)
Positioning: Holistic Inner Transformation (Stress Management, Mind Mastery, Meditation, Mindfulness, Emotional Well-being).
CRITICAL RULES:
1. Ground all financial and referral figures strictly on the Real Database Metrics provided.
2. NEVER invent fake earnings, referrals, or arbitrary numbers. If earnings or referrals are 0, state 0.
3. Standard commission is 50% on paid programs. Free 5-Day Mind Reset Challenge pays ₹49 activation reward.
4. Tone: Premium, encouraging, professional, wellness-focused.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Real Database Partner Metrics:\n${JSON.stringify(realMetrics || partnerContext || {}, null, 2)}\n\nCatalogue:\n${JSON.stringify(catalogueContext || [], null, 2)}\n\nPartner Query: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return res.json({ response: response.text });
    } else {
      // Deterministic real fallback
      const earned = realMetrics ? `₹${realMetrics.wallet.lifetimeEarned.toLocaleString("en-IN")}` : "₹0";
      const available = realMetrics ? `₹${realMetrics.wallet.availableBalance.toLocaleString("en-IN")}` : "₹0";
      const refs = realMetrics ? realMetrics.totalReferrals : 0;
      const target = realMetrics ? realMetrics.monthlyTarget : 20;

      const p = prompt.toLowerCase();
      if (p.includes("earn") || p.includes("commission") || p.includes("wallet")) {
        return res.json({
          response: `### 💰 Your Real Database Earnings Summary\n- **Lifetime Earned:** ${earned}\n- **Available for Payout:** ${available}\n- **Standard Commission:** 50% of verified collected customer revenue.\n- **Activation Reward:** ₹49 for every verified Free 5-Day Mind Reset Challenge registration.\n\nAll numbers are computed from the real transaction ledger.`,
          fallback: true,
        });
      }
      if (p.includes("referral") || p.includes("target") || p.includes("lead")) {
        return res.json({
          response: `### 🎯 Referral Progress (Real Database Count)\n- **Verified Referrals:** ${refs} / ${target}\n- **Remaining for Monthly Target:** ${Math.max(0, target - refs)}\n\nAll figures reflect live records stored in the database.`,
          fallback: true,
        });
      }
      return res.json({
        response: `### 🌿 P2IP Partner AI\nI am connected directly to your live database profile.\n- Current Verified Referrals: ${refs}\n- Available Balance: ${available}\n\nAsk me about your earnings, referral links, or ready-to-share WhatsApp invitations.`,
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error("Error in partner assistant:", error);
    return res.status(500).json({ error: "Failed to generate response", details: error.message });
  }
});

app.post("/api/ai/admin-assistant", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Retrieve real commercial metrics from database
    const realMetrics = getAdminMetrics();

    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are P2IP Admin AI, executive AI assistant for Path to Inner Peace leadership.
CRITICAL RULES:
1. Ground every single number strictly on the provided Real Commercial Database Metrics.
2. NEVER invent fake revenue or fake partner counts. If revenue is ₹0, state ₹0. If partners are 0, state 0.
3. Tone: Executive, concise, data-driven, strategic.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Real Commercial Database Metrics:\n${JSON.stringify(realMetrics, null, 2)}\n\nExecutive Admin Query: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.1,
        },
      });

      return res.json({ response: response.text });
    } else {
      return res.json({
        response: `### 📊 Real Commercial Database Summary\n- **Total Registered Partners:** ${realMetrics.totalPartners}\n- **Total Logged Referrals:** ${realMetrics.totalReferrals}\n- **Gross Customer Revenue:** ₹${realMetrics.grossRevenue.toLocaleString("en-IN")}\n- **Partner Commission Liability:** ₹${realMetrics.partnerCommissionLiability.toLocaleString("en-IN")}\n- **Paid Payouts:** ₹${realMetrics.paidPayouts.toLocaleString("en-IN")}\n- **Outstanding Payable:** ₹${realMetrics.outstandingPartnerPayable.toLocaleString("en-IN")}\n\nZero simulated data. Every figure is audited from database tables.`,
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error("Error in admin assistant:", error);
    return res.status(500).json({ error: "Failed to generate response", details: error.message });
  }
});

// ----------------------------------------------------
// FORMSUBMIT NOTIFICATION RELAY (mchatterjee69@gmail.com)
// ----------------------------------------------------
app.post("/api/notify/formsubmit", async (req, res) => {
  try {
    const payload = req.body;
    const response = await fetch("https://formsubmit.co/ajax/mchatterjee69@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    console.log("[FormSubmit Relay] Dispatched notification to mchatterjee69@gmail.com, status:", response.status);
    res.json({ success: response.ok, status: response.status, data });
  } catch (err: any) {
    console.error("[FormSubmit Relay Error]:", err.message);
    res.status(500).json({ error: "Failed to dispatch FormSubmit notification", details: err.message });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE (DEV) OR STATIC ASSETS (PROD)
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[P2IP PartnerSphere] Production Database Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
