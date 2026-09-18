import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Megaphone,
  Copy,
  Check,
  Download,
  Share2,
  Filter,
  Image,
  FileText,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const PartnerMarketingCentre: React.FC = () => {
  const { currentPartner, marketingAssets } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const referralUrl = currentPartner.referralUrl || `https://pathtoinnerpeace.in/r/${currentPartner.code}`;

  const categories = [
    "ALL",
    "5-Day Challenge",
    "Stress Management",
    "Mind Mastery",
    "Corporate Wellness",
    "Career Clarity",
  ];

  const filteredAssets = marketingAssets.filter((asset) => {
    if (categoryFilter === "ALL") return true;
    return asset.category === categoryFilter;
  });

  const getPersonalizedCopy = (rawCopy?: string) => {
    if (!rawCopy) return "";
    return rawCopy
      .replace(/{{PARTNER_REFERRAL_URL}}/g, referralUrl)
      .replace(/{{PARTNER_CODE}}/g, currentPartner.code)
      .replace(/{{PARTNER_NAME}}/g, currentPartner.name)
      .replace(/{{CLIENT_NAME}}/g, "Friend");
  };

  const handleCopy = (id: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(getPersonalizedCopy(text));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="partner-marketing-centre-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#0F5132]" />
            Marketing & Community Enablement Centre
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Turnkey, brand-approved visual assets and messaging templates personalized with your unique referral link
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F9F8] border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-gray-500">Auto-injecting:</span>
          <span className="font-mono font-bold text-[#0F5132]">{currentPartner.code}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              categoryFilter === cat
                ? "bg-[#0F5132] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => {
          const personalizedText = getPersonalizedCopy(asset.copyText);
          const isCopied = copiedId === asset.id;

          return (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Visual Preview Banner if gradient provided */}
                {asset.previewGradient ? (
                  <div
                    className={`h-40 bg-gradient-to-br ${asset.previewGradient} p-4 flex flex-col justify-between text-white relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                        {asset.type}
                      </span>
                      {asset.dimensions && (
                        <span className="text-[10px] text-white/80 font-mono">
                          {asset.dimensions}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#F5D77F] uppercase tracking-wider">
                        Path to Inner Peace
                      </div>
                      <div className="text-base font-extrabold tracking-tight leading-tight line-clamp-2">
                        {asset.title}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 bg-[#F8F9F8] p-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-[#0F5132]" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#0F5132] bg-[#E8F5E9] px-2 py-0.5 rounded">
                          {asset.type}
                        </span>
                        <div className="text-xs font-bold text-gray-800 mt-1">{asset.title}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content description & copy */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-gray-600">{asset.description}</p>

                  <div className="bg-[#F8F9F8] p-3 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 max-h-36 overflow-y-auto whitespace-pre-line text-[11px] leading-relaxed">
                    {personalizedText}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  onClick={() => handleCopy(asset.id, asset.copyText)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCopied
                      ? "bg-[#0F5132] text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "Copied!" : "Copy Caption"}
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(personalizedText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#25D366] text-white rounded-xl hover:bg-[#1EBE5D] transition"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
