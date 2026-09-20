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
  const iconSize = size === "sm" ? 32 : size === "lg" ? 48 : 40;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="brand-logo-container">
      {/* Official P2IP round logo with no cover */}
      <div
        className="relative flex items-center justify-center rounded-full shrink-0 overflow-hidden"
        style={{ width: iconSize, height: iconSize }}
      >
        <img
          src="/p2ip-logo.webp"
          onError={(e) => {
            e.currentTarget.src = "https://yourimageshare.com/ib/Lqlh3mtjO0.png";
          }}
          alt="P2IP Logo"
          className="w-full h-full rounded-full object-contain"
          referrerPolicy="no-referrer"
          loading="eager"
        />
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
