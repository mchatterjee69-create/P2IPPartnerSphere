import React, { useState } from "react";
import { PartnersphereLogo } from "../common/PartnersphereLogo";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { Partner } from "../../types";

interface WelcomeScreenProps {
  onJoinNow: () => void;
  onDirectSignIn?: () => void;
  onDirectAdmin?: () => void;
  newlyRegisteredPartner?: Partner | null;
  onEnterPortal?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onJoinNow,
  onDirectSignIn,
  onDirectAdmin,
  newlyRegisteredPartner,
  onEnterPortal,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-[#F9FAF9] via-[#F1F6F2] to-[#E3EDE5] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden"
      id="welcome-screen-container"
    >
      {/* Subtle ambient botanical background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#0F5132]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Elegant Card Container matching the uploaded design */}
      <div className="relative w-full max-w-[420px] sm:max-w-[450px] bg-gradient-to-b from-[#FAFCFA] via-[#F4F8F4] to-[#EBF3ED] rounded-[36px] border border-[#0F5132]/15 shadow-2xl p-8 sm:p-10 flex flex-col items-center text-center overflow-hidden">
        
        {/* Soft Lotus Watermark in the lower-middle background */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-56 pointer-events-none opacity-20 sm:opacity-25 flex items-center justify-center">
          <svg
            viewBox="0 0 200 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-[#0F5132]"
          >
            {/* Lotus Petals */}
            <path
              d="M100 20 C92 50, 85 95, 100 135 C115 95, 108 50, 100 20 Z"
              fill="currentColor"
            />
            <path
              d="M100 35 C75 60, 65 95, 88 135 C95 105, 96 65, 100 35 Z"
              fill="currentColor"
            />
            <path
              d="M100 35 C125 60, 135 95, 112 135 C105 105, 104 65, 100 35 Z"
              fill="currentColor"
            />
            <path
              d="M100 55 C60 75, 45 110, 75 138 C84 115, 90 85, 100 55 Z"
              fill="currentColor"
            />
            <path
              d="M100 55 C140 75, 155 110, 125 138 C116 115, 110 85, 100 55 Z"
              fill="currentColor"
            />
            <path
              d="M100 80 C40 100, 25 125, 60 142 C72 130, 86 110, 100 80 Z"
              fill="currentColor"
            />
            <path
              d="M100 80 C160 100, 175 125, 140 142 C128 130, 114 110, 100 80 Z"
              fill="currentColor"
            />
            <path
              d="M40 144 C75 152, 125 152, 160 144"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 1. TOP CIRCULAR LOGO */}
        <div className="relative z-10 pt-2 pb-5">
          <PartnersphereLogo className="w-24 h-24 sm:w-28 sm:h-28 shadow-xl ring-4 ring-[#D4AF37]/30" />
        </div>

        {/* 2. BRAND HEADING */}
        <div className="relative z-10 space-y-1">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B4025] tracking-tight font-serif whitespace-nowrap"
            style={{ textShadow: "0 1px 2px rgba(11,64,37,0.08)" }}
          >
            P2IP PartnerSphere™
          </h1>

          <div className="pt-1.5 space-y-0.5">
            <p className="text-xs sm:text-sm font-medium text-[#466957] tracking-wide">
              powered by
            </p>
            <p className="text-base sm:text-lg font-bold font-serif text-[#0B4025] tracking-tight">
              Path to Inner Peace
            </p>
          </div>
        </div>

        {/* 3. GOLDEN ORNAMENTAL DIVIDER */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 w-48 sm:w-56 my-5">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-[#D4AF37]" />
          <div className="flex items-center gap-1 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <svg
              className="w-4 h-4 fill-current text-[#D4AF37]"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
            </svg>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/60 to-[#D4AF37]" />
        </div>

        {/* 4. FOUR-WORD PHILOSOPHY / TAGLINE */}
        <div className="relative z-10 space-y-1 my-1">
          <p className="text-xl sm:text-2xl font-bold font-serif text-[#0C4427] tracking-tight leading-snug">
            Partner, Refer,
          </p>
          <p className="text-xl sm:text-2xl font-bold font-serif text-[#0C4427] tracking-tight leading-snug">
            Transform, Earn
          </p>
        </div>

        {/* 4.5 NEW ACCREDITED PARTNER WELCOME CARD */}
        {newlyRegisteredPartner && (
          <div className="relative z-10 w-full mt-4 p-4 rounded-2xl bg-white/95 border border-emerald-300 shadow-md flex flex-col items-center text-center gap-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Accreditation Approved & Active
            </div>
            <p className="text-sm sm:text-base font-black text-[#0B4025]">
              Welcome, {newlyRegisteredPartner.name}!
            </p>
            <div className="flex items-center gap-2 bg-[#F1F6F2] px-3.5 py-1.5 rounded-xl border border-emerald-200 mt-0.5">
              <span className="text-xs font-bold text-gray-600">Referral ID:</span>
              <span className="text-sm font-black font-mono text-[#0F5132]">{newlyRegisteredPartner.code}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(newlyRegisteredPartner.code);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="p-1 hover:bg-white rounded text-gray-500 hover:text-emerald-700 transition cursor-pointer"
                title="Copy Referral ID"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              You are now accredited under P2IP PartnerSphere™.
            </p>
          </div>
        )}

        {/* 5. PRIMARY CTA BUTTON: ENTER PORTAL OR JOIN NOW */}
        <div className="relative z-10 w-full pt-8 sm:pt-10 pb-2">
          {newlyRegisteredPartner ? (
            <button
              id="welcome-enter-portal-btn"
              type="button"
              onClick={onEnterPortal || onJoinNow}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#0F5132] via-[#146c43] to-[#D4AF37] hover:brightness-110 text-white font-black text-lg sm:text-xl shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer border border-[#D4AF37]/50"
            >
              <span>Enter Partner Portal</span>
              <span className="text-2xl font-black leading-none transform translate-y-[-1px]">
                →
              </span>
            </button>
          ) : (
            <button
              id="welcome-join-now-btn"
              type="button"
              onClick={onJoinNow}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#F6C244] via-[#F4B732] to-[#E9A422] hover:from-[#f0bc3a] hover:to-[#dc9614] text-[#0C4427] font-black text-lg sm:text-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer border border-[#FDE394]"
            >
              <span>Join Now</span>
              <span className="text-2xl font-black leading-none transform translate-y-[-1px]">
                →
              </span>
            </button>
          )}
        </div>

        {/* Direct quick access helpers */}
        <div className="relative z-10 pt-4 flex flex-col items-center gap-1.5 text-xs text-[#466957]">
          <p>
            Existing Partner?{" "}
            <button
              type="button"
              onClick={onDirectSignIn || onJoinNow}
              className="text-[#0B4025] font-extrabold hover:underline cursor-pointer ml-1"
            >
              Sign In →
            </button>
          </p>
          {onDirectAdmin && (
            <button
              type="button"
              onClick={onDirectAdmin}
              className="text-[11px] text-[#5A7C6B] hover:text-[#0B4025] hover:underline cursor-pointer"
            >
              Admin Access
            </button>
          )}
        </div>
      </div>

      {/* Footer subtle accreditation */}
      <footer className="mt-4 text-center text-[11px] text-[#466957]/80">
        Path to Inner Peace • Official Accredited Partner Management System
      </footer>
    </div>
  );
};
