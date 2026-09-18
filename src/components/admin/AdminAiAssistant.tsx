import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AdminAiAssistant: React.FC = () => {
  const { partners, leads, commissions, products } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Welcome to the **Path to Inner Peace Admin Intelligence Suite**. I have full oversight of your **${partners.length} partners**, **${leads.length} leads**, and **₹${commissions.reduce((s, c) => s + c.collectedRevenue, 0).toLocaleString("en-IN")}** in platform revenue. How can I assist your operational strategy today?`,
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "Summarize our current commercial revenue and partner liability",
    "Which partners have high lead volume but low challenge attendance?",
    "How should we handle a duplicate lead between a Gym and a Psychologist?",
    "Give me 3 strategy ideas to boost corporate partner conversions",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const newMsgs: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMsgs);
    setInputQuery("");
    setIsLoading(true);

    const platformContext = {
      totalPartners: partners.length,
      activePartners: partners.filter((p) => p.status === "ACTIVE").length,
      totalLeads: leads.length,
      duplicateFlaggedLeads: leads.filter((l) => l.attributionStatus === "DUPLICATE_FLAGGED").length,
      paidCustomers: leads.filter((l) => l.status === "PAID_CUSTOMER").length,
      grossRevenue: commissions.reduce((sum, c) => sum + c.collectedRevenue, 0),
      totalCommissionLiability: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      payableCommissions: commissions
        .filter((c) => c.status === "PAYABLE")
        .reduce((sum, c) => sum + c.commissionAmount, 0),
      topPartners: partners.slice(0, 5).map((p) => ({
        name: p.name,
        type: p.partnerType,
        referrals: p.totalReferrals,
        revenue: p.lifetimeRevenue,
      })),
    };

    try {
      const res = await fetch("/api/ai/admin-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformContext,
          query: textToSend,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I am currently unable to process this request. Please try again.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Executive Summary: Total Platform Revenue is ₹" +
            platformContext.grossRevenue.toLocaleString("en-IN") +
            " with Net P2IP retained revenue of ₹" +
            (platformContext.grossRevenue - platformContext.totalCommissionLiability).toLocaleString(
              "en-IN"
            ) +
            ". Currently " +
            platformContext.duplicateFlaggedLeads +
            " leads are flagged for attribution review.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-4xl mx-auto" id="admin-ai-assistant-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F5132] to-[#125838] text-[#F5D77F] flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
              P2IP Executive Intelligence Advisor
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F5132] text-white">
                Admin Suite
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Deep operational analytics, duplicate conflict resolution recommendations, and commercial margin modeling
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content: `Session refreshed. How can I assist you with P2IP PartnerSphere™ operations today?`,
              },
            ])
          }
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-[#B48220]" />
          Quick Analysis:
        </span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#0F5132]/40 text-gray-700 hover:text-[#0F5132] rounded-xl font-medium whitespace-nowrap transition cursor-pointer text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Box */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs h-[460px] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs leading-relaxed ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-[#0F5132] text-[#F5D77F] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-3.5 rounded-2xl whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-[#0F5132] text-white rounded-tr-xs"
                    : "bg-[#F8F9F8] text-gray-800 border border-gray-200 rounded-tl-xs"
                }`}
              >
                {m.content}
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-7 h-7 rounded-xl bg-[#0F5132] text-[#F5D77F] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-[#F8F9F8] rounded-2xl border border-gray-200 text-gray-500 animate-pulse">
                Synthesizing platform intelligence across partner categories...
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-3 border-t border-gray-100 bg-[#FBFBFA]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything regarding partner performance, attribution rules, or revenue optimization..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Analyze
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
