import React from "react";

interface PartnersphereLogoProps {
  className?: string;
  size?: number | string;
}

export const PartnersphereLogo: React.FC<PartnersphereLogoProps> = ({
  className = "w-24 h-24",
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div
      className={`relative rounded-full shadow-lg overflow-hidden shrink-0 select-none ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Deep emerald forest gradient matching the image */}
          <radialGradient
            id="psGreenGlow"
            cx="45%"
            cy="38%"
            r="65%"
            fx="45%"
            fy="38%"
          >
            <stop offset="0%" stopColor="#15643B" />
            <stop offset="55%" stopColor="#0E482A" />
            <stop offset="100%" stopColor="#072B18" />
          </radialGradient>

          {/* Soft inner vignette ring */}
          <linearGradient id="psInnerRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="50%" stopColor="rgba(212,175,55,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
          </linearGradient>

          {/* Drop shadow filter for figures */}
          <filter id="figureShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodOpacity="0.25" floodColor="#041a0e" />
          </filter>
        </defs>

        {/* Outer Circle Background */}
        <circle cx="50" cy="50" r="48" fill="url(#psGreenGlow)" />
        <circle cx="50" cy="50" r="47.5" stroke="url(#psInnerRing)" strokeWidth="1.2" />

        {/* 3 People Network Silhouette Group */}
        <g filter="url(#figureShadow)">
          {/* TOP PERSON */}
          {/* Head */}
          <circle cx="50" cy="27" r="7.2" fill="#FFFFFF" />
          {/* Torso */}
          <path
            d="M39.5 45 C39.5 39 43.5 37 50 37 C56.5 37 60.5 39 60.5 45 C60.5 45.8 60 46.5 59 46.5 L41 46.5 C40 46.5 39.5 45.8 39.5 45 Z"
            fill="#FFFFFF"
          />

          {/* BOTTOM LEFT PERSON */}
          {/* Head */}
          <circle cx="33.5" cy="50.5" r="6.2" fill="#FFFFFF" />
          {/* Torso */}
          <path
            d="M24 67 C24 61.8 27.5 60 33.5 60 C39.5 60 43 61.8 43 67 C43 67.8 42.5 68.3 41.5 68.3 L25.5 68.3 C24.5 68.3 24 67.8 24 67 Z"
            fill="#FFFFFF"
          />

          {/* BOTTOM RIGHT PERSON */}
          {/* Head */}
          <circle cx="66.5" cy="50.5" r="6.2" fill="#FFFFFF" />
          {/* Torso */}
          <path
            d="M57 67 C57 61.8 60.5 60 66.5 60 C72.5 60 76 61.8 76 67 C76 67.8 75.5 68.3 74.5 68.3 L58.5 68.3 C57.5 68.3 57 67.8 57 67 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};
