import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  QrCode,
  Copy,
  Check,
  Share2,
  Download,
  ExternalLink,
  Printer,
  Sparkles,
} from "lucide-react";

export const QRCodeModal: React.FC = () => {
  const { isQRCodeOpen, setIsQRCodeOpen, currentPartner } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isQRCodeOpen) return null;

  const referralUrl = currentPartner.referralUrl || `https://pathtoinnerpeace.in/r/${currentPartner.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=0F5132&bgcolor=FFFFFF&data=${encodeURIComponent(
    referralUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#0F5132]/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F5132] to-[#146c43] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-[#D4AF37]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Partner QR & Referral Link</h3>
              <p className="text-xs text-emerald-100/80">Unique attribution link for {currentPartner.name}</p>
            </div>
          </div>
          <button
            onClick={() => setIsQRCodeOpen(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          {/* QR Code Container */}
          <div className="relative mx-auto w-56 h-56 p-3 bg-white rounded-2xl shadow-md border-2 border-[#D4AF37]/40 flex flex-col items-center justify-center">
            <img
              src={qrImageUrl}
              alt={`QR Code for ${currentPartner.name}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute -bottom-2.5 bg-[#0F5132] text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/50 uppercase tracking-wider">
              {currentPartner.code}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900">{currentPartner.organisation}</div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">Partner ID: {currentPartner.id}</div>
          </div>

          {/* Referral URL Box */}
          <div className="flex items-center gap-1.5 bg-[#F8F9F8] border border-gray-200 rounded-xl p-2 text-left">
            <div className="flex-1 truncate text-xs font-mono text-gray-700 px-1">
              {referralUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                copied
                  ? "bg-[#0F5132] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Join me for Path to Inner Peace's FREE 5-Day Mind Reset Challenge! Register here with my complimentary invite: ${referralUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1EBE5D] transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share on WhatsApp
            </a>

            <a
              href={qrImageUrl}
              download={`P2IP_QR_${currentPartner.code}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-200 transition border border-gray-200"
            >
              <Download className="w-3.5 h-3.5 text-[#0F5132]" />
              Download QR Image
            </a>
          </div>

          {/* Quick Guidance */}
          <div className="p-3 bg-[#E8F5E9]/50 border border-[#0F5132]/15 rounded-xl text-left text-[11px] text-gray-600 space-y-1">
            <div className="font-bold text-[#0F5132] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Best Practice Usage
            </div>
            <p>
              Display this QR code at reception desks, fitness check-ins, or share in your WhatsApp broadcast community. Anyone who scans it is automatically attributed to your partner account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
