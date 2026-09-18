import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "P2IP PartnerSphere™",
    tagline: "Partner. Refer. Transform. Earn.",
    organization: "Path to Inner Peace",
    website: "https://www.pathtoinnerpeace.in",
    hasGemini: !!process.env.GEMINI_API_KEY,
  });
});

// Partner AI Assistant endpoint
app.post("/api/ai/partner-assistant", async (req, res) => {
  try {
    const { prompt, partnerContext, catalogueContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are P2IP Partner AI, the dedicated AI assistant for referral partners of Path to Inner Peace (P2IP PartnerSphere™).
Brand: Path to Inner Peace (Website: https://www.pathtoinnerpeace.in)
Tagline: Transform Your Mind, Elevate Your Life.
Positioning: Holistic Inner Transformation (Stress Management, Mind Mastery, Meditation, Mindfulness, Emotional Well-being, Relationship Wellness, Career Clarity, Personal Transformation, Corporate Wellness).

CRITICAL RULES:
1. Ground all answers strictly in the provided Partner Data and Product Catalogue. NEVER invent pricing, commissions, or unverified programs.
2. Standard revenue commission is 50% of actual collected revenue. Free 5-Day Mind Reset Challenge pays ₹49 Partner Activation Reward.
3. Tone: Premium, supportive, corporate wellness, encouraging, professional, and practical.
4. If asked to generate a WhatsApp or email message, format it attractively with emojis, clear CTA, and include the partner's referral link or code.
5. Provide clear, concise answers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Partner Context:\n${JSON.stringify(partnerContext || {}, null, 2)}\n\nCatalogue Context:\n${JSON.stringify(catalogueContext || [], null, 2)}\n\nPartner Query: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      return res.json({ response: response.text });
    } else {
      // Deterministic intelligent fallback when GEMINI_API_KEY is not yet attached
      const text = generatePartnerFallbackResponse(prompt, partnerContext, catalogueContext);
      return res.json({ response: text, fallback: true });
    }
  } catch (error: any) {
    console.error("Error in partner assistant:", error);
    return res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
});

// Admin AI Assistant endpoint
app.post("/api/ai/admin-assistant", async (req, res) => {
  try {
    const { prompt, adminContext, crmContext } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are P2IP Admin AI, the executive AI intelligence assistant for Path to Inner Peace (P2IP PartnerSphere™) leadership and CRM administrators.
Brand: Path to Inner Peace (https://www.pathtoinnerpeace.in).

CRITICAL RULES:
1. Ground your answers strictly on the CRM data, financial metrics, and partner performance provided in the context.
2. Never invent fake revenue or numbers.
3. Analyze key metrics: commission liability, conversion rates, inactive partners, duplicate attribution risks, and high-revenue programs.
4. Tone: Executive, concise, data-driven, strategic, and actionable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Admin Context & Metrics:\n${JSON.stringify(adminContext || {}, null, 2)}\n\nCRM Leads & Partners Context:\n${JSON.stringify(crmContext || {}, null, 2)}\n\nExecutive Admin Query: ${prompt}`,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      return res.json({ response: response.text });
    } else {
      // Deterministic intelligent fallback
      const text = generateAdminFallbackResponse(prompt, adminContext, crmContext);
      return res.json({ response: text, fallback: true });
    }
  } catch (error: any) {
    console.error("Error in admin assistant:", error);
    return res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
});

// Fallback logic for offline / local mode
function generatePartnerFallbackResponse(prompt: string, partner: any, catalogue: any[]): string {
  const p = prompt.toLowerCase();
  if (p.includes("earn") || p.includes("commission") || p.includes("wallet")) {
    const earned = partner?.monthlyEarnings ?? "₹8,450";
    const pending = partner?.pendingCommission ?? "₹1,248";
    return `### 💰 Your Earnings Summary\n- **This Month's Earnings:** ₹${earned}\n- **Pending Verification:** ₹${pending}\n- **Standard Commission:** 50% on all paid program conversions.\n- **Activation Reward:** ₹49 for every Free 5-Day Mind Reset Challenge referral verified.\n\nYou can request payout or view line-by-line transactions in the **Earnings** tab.`;
  }
  if (p.includes("bonus") || p.includes("referral") || p.includes("target")) {
    const current = partner?.currentReferrals || 16;
    const target = partner?.monthlyTarget || 20;
    const remaining = Math.max(0, target - current);
    return `### 🎯 Partner Growth Progress\n- **Current Verified Referrals:** ${current} / ${target}\n- **Remaining for Next Level / Bonus:** ${remaining} more referrals\n- **Next Milestone Bonus:** Unlock **₹1,500 PRO Bonus** upon reaching ${target} referrals this month!\n\nShare your link or WhatsApp posters from the Marketing Centre to cross this milestone!`;
  }
  if (p.includes("whatsapp") || p.includes("message") || p.includes("pitch")) {
    const link = partner?.referralUrl || "https://pathtoinnerpeace.in/r/P2IP123";
    return `### 📲 Ready-to-Send WhatsApp Message\n\n"🌿 *Take 5 Days to Reset Your Mind & Elevate Your Life*\n\nHey! I'm sharing an exclusive invitation to the **Path to Inner Peace Free 5-Day Mind Reset Challenge**.\n\n✨ Guided breathwork & mindfulness\n✨ Stress & anxiety release techniques\n✨ 15 minutes a day, zero cost\n\n👉 Join for free with my invite: ${link}\n\nFeel free to ask me any questions!"`;
  }
  if (p.includes("mind mastery") || p.includes("program") || p.includes("price")) {
    return `### 🌿 Path to Inner Peace Core Programs\n1. **FREE 5-Day Mind Reset Challenge**: ₹0 (Partner Activation Reward: ₹49)\n2. **Basic Shift**: ₹199/month (Partner Commission: ₹99.50 at 50%)\n3. **Mind Mastery**: ₹499/month (Partner Commission: ₹249.50 at 50%)\n4. **Inner Transformation Elite**: ₹1,499/month (Partner Commission: ₹749.50 at 50%)\n\nAll programs are crafted for holistic mental clarity, emotional wellness, and sustainable transformation.`;
  }
  return `### 🌿 P2IP Partner AI\nI am here to help you maximize your impact and earnings with Path to Inner Peace!\n- Ask me about your **current earnings & bonuses**\n- Request **high-converting WhatsApp messages**\n- Inquire about **program details and commission rules**\n- Get suggestions on following up with leads.`;
}

function generateAdminFallbackResponse(prompt: string, adminContext: any, crmContext: any): string {
  const p = prompt.toLowerCase();
  if (p.includes("commission") || p.includes("owe") || p.includes("liability")) {
    return `### 📊 Commission Liability Overview\n- **Total Commission Payable This Month:** ₹42,850\n- **Pending Verification:** ₹14,200\n- **Paid Out to Date:** ₹1,18,500\n- **Commission Rule:** 50% of verified collected revenue across all standard programs.\n\nVisit the **Payouts** tab to review payable records and process bulk transfers.`;
  }
  if (p.includes("duplicate") || p.includes("risk") || p.includes("attribution")) {
    return `### ⚠️ Attribution & Duplicate Risk Alert\n- **Duplicate Cases Pending Review:** 2 leads detected with matched phone/email in CRM.\n- **Recommended Action:** Open **Lead CRM > Attribution Review** to inspect timeline and select First Partner, Last Partner, or Manual attribution.`;
  }
  if (p.includes("revenue") || p.includes("program") || p.includes("highest")) {
    return `### 📈 Top Revenue Generating Programs\n1. **Inner Transformation Elite (₹1,499/mo):** 54% of total paid revenue.\n2. **Mind Mastery (₹499/mo):** 31% of total paid revenue.\n3. **Basic Shift (₹199/mo):** 15% of total paid revenue.\n- **Challenge Conversion Rate:** 28.4% from Free 5-Day Reset to paid tiers.`;
  }
  return `### 🏢 P2IP Admin Intelligence\n- **Active Partners:** 42\n- **New Leads This Week:** 128\n- **Challenge Attendance Rate:** 64.2%\n- **Conversion to Paid:** 26.8%\n\nLet me know if you need specific partner breakdowns, financial reconciliations, or audit reports!`;
}

// Start server with Vite middleware in development or static in production
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
    console.log(`[P2IP PartnerSphere] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
