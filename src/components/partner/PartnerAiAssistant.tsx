import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  MessageSquare,
  Zap,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const PartnerAiAssistant: React.FC = () => {
  const { currentPartner, leads, commissions, products } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello ${currentPartner.name}! I am your **P2IP Partner Advisor**. I'm connected to your live referral and commission ledger. How can I assist you with your community outreach, milestone bonuses, or client follow-ups today?`,
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "How much did I earn this month and what is payable?",
    "How many referrals do I need for my next bonus?",
    "Draft a personalized WhatsApp message for the 5-Day Reset",
    "Explain the Mind Mastery program for my clients",
    "Which program has my highest conversion rate?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const newMsgs: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMsgs);
    setInputQuery("");
    setIsLoading(true);

    // Compute live stats for the partner context
    const partnerCommissions = commissions.filter((c) => c.partnerId === currentPartner.id);
    const monthlyEarnings = partnerCommissions
      .filter((c) => c.status !== "REVERSED")
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const payableEarnings = partnerCommissions
      .filter((c) => c.status === "PAYABLE")
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const partnerContext = {
      partnerId: currentPartner.id,
      name: currentPartner.name,
      partnerType: currentPartner.partnerType,
      level: currentPartner.level,
      code: currentPartner.code,
      referralUrl: currentPartner.referralUrl,
      currentMonthlyReferrals: currentPartner.currentMonthlyReferrals,
      monthlyTarget: currentPartner.monthlyTarget,
      monthlyEarnings,
      payableEarnings,
      totalReferrals: currentPartner.totalReferrals,
      totalCustomers: currentPartner.totalCustomers,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        commission: p.price > 0 ? p.price * 0.5 : 49,
      })),
    };

    try {
      const res = await fetch("/api/ai/partner-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerContext,
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
            "Based on your current ledger: You have earned ₹" +
            monthlyEarnings.toFixed(2) +
            " this month. You need " +
            Math.max(0, (currentPartner.monthlyTarget || 20) - (currentPartner.currentMonthlyReferrals || 0)) +
            " more referrals to reach your PRO Performance Bonus target.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-4xl mx-auto" id="partner-ai-assistant-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F5132] to-[#125838] text-[#F5D77F] flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
              P2IP Partner AI Assistant
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#8B6508]">
                Gemini 3.8
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Personalized growth advisor for {currentPartner.name} ({currentPartner.organisation})
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content: `Chat session reset. How can I help you grow your referrals today, ${currentPartner.name}?`,
              },
            ])
          }
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-[#B48220]" />
          Suggested:
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

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs h-[450px] flex flex-col overflow-hidden">
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
                Analyzing your partner ledger and generating advice...
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
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
              placeholder="Ask about your earnings, bonus requirements, or custom message drafts..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
