import React from "react";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: "light" | "dark" | "full";
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  showTagline = true,
  variant = "light",
  size = "md",
}) => {
  const isDark = variant === "dark";
  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="brand-logo-container">
      {/* Official styled emblem: Geometric Emerald & Radiance Gold Sanctuary Motif */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0F5132] to-[#0A3D24] shadow-sm ring-1 ring-[#D4AF37]/30"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Outer circle of harmony */}
          <circle cx="16" cy="16" r="14" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.4" />
          {/* Inner transformation petals */}
          <path
            d="M16 5C16 11 11 16 5 16C11 16 16 21 16 27C16 21 21 16 27 16C21 16 16 11 16 5Z"
            fill="url(#goldGrad)"
            fillOpacity="0.9"
          />
          {/* Center core stillness */}
          <circle cx="16" cy="16" r="3.2" fill="#0F5132" stroke="#D4AF37" strokeWidth="1.2" />
          <defs>
            <linearGradient id="goldGrad" x1="5" y1="5" x2="27" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5D77F" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#AA7C11" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight ${
              size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg"
            } ${isDark ? "text-white" : "text-[#0F5132]"}`}
          >
            P2IP <span className="text-[#B48220]">PartnerSphere</span>
          </span>
          <span className="text-[10px] font-semibold text-[#B48220] tracking-wider uppercase bg-[#D4AF37]/15 px-1 py-0.5 rounded border border-[#D4AF37]/30">
            TM
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[11px] font-medium tracking-wide ${
              isDark ? "text-emerald-200/70" : "text-[#1F2923]/70"
            }`}
          >
            Path to Inner Peace • <span className="italic text-[#0F5132]">Partner. Refer. Transform. Earn.</span>
          </span>
        )}
      </div>
    </div>
  );
};
