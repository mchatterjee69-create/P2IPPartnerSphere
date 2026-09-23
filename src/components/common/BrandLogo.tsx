import React from "react";
import { PartnersphereLogo } from "./PartnersphereLogo";

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
      {/* Official circular 3-figure Partnersphere logo from brand specification */}
      <PartnersphereLogo size={iconSize} className="shrink-0" />

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
