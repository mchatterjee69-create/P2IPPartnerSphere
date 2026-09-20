import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Shield,
  HelpCircle,
  CreditCard,
  FileText,
  X,
} from "lucide-react";
import { PartnerType } from "../../types";
import { PartnerWithUsView } from "../partner/PartnerWithUsView";
import { PARTNER_CLIENT_REFERRAL_TERMS } from "../../data/partnerTermsData";

export const AuthPortal: React.FC = () => {
  const {
    partners,
    loginWithReferralId,
    verifyTwoStepAuth,
    selfRegisterPartner,
    adminLogin,
    tempPartnerPendingAuth,
  } = useApp();

  // Tab: "SIGN_IN" | "REGISTER" | "ADMIN" | "PARTNER_WITH_US"
  const [activeTab, setActiveTab] = useState<"SIGN_IN" | "REGISTER" | "ADMIN" | "PARTNER_WITH_US">("SIGN_IN");

  // Sign In State
  const [signInStep, setSignInStep] = useState<1 | 2>(1);
  const [referralIdInput, setReferralIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [twoStepPinInput, setTwoStepPinInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [simulatedOtpSent, setSimulatedOtpSent] = useState(false);

  // Self Registration State
  const [regName, setRegName] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regType, setRegType] = useState<PartnerType>("Yoga Instructor");
  const [regMobile, setRegMobile] = useState("+91 ");
  const [regEmail, setRegEmail] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regPan, setRegPan] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");
  const [regReferralCode, setRegReferralCode] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regTwoStepPin, setRegTwoStepPin] = useState("");
  const [regConfirmPin, setRegConfirmPin] = useState("");
  const [regTerms, setRegTerms] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Automatic Declaration & Terms & Conditions Pop-Up Modal State
  const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Admin Login State
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState<string | null>(null);

  // Sign in Step 1 Handler
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    const res = loginWithReferralId(referralIdInput, passwordInput);
    if (!res.success) {
      setSignInError(res.error || "Failed to find Referral ID.");
      return;
    }
    setSignInStep(2);
  };

  // Sign in Step 2 (2-Step Verification) Handler
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    const res = verifyTwoStepAuth(twoStepPinInput);
    if (!res.success) {
      setSignInError(res.error || "Invalid 2-step verification code.");
      return;
    }
  };

  // Self Registration Submit Handler - Validates & Triggers Declaration T&C Pop-up automatically
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regMobile.trim()) {
      setRegError("Please fill in your legal name, email, and mobile number.");
      return;
    }

    const cleanPan = regPan.trim().toUpperCase();
    if (!cleanPan) {
      setRegError("Please enter your 10-character PAN Card Number.");
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      setRegError("Please enter a valid 10-character PAN Number format (e.g. ABCDE1234F).");
      return;
    }

    const cleanAadhaar = regAadhaar.replace(/\s+/g, "");
    if (!cleanAadhaar) {
      setRegError("Please enter your 12-digit Aadhaar Card Number.");
      return;
    }
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      setRegError("Aadhaar Number must be exactly 12 numeric digits (e.g. 1234 5678 9012).");
      return;
    }

    if (!regReferralCode.trim()) {
      setRegError("Please choose a unique Referral ID / Partner Code.");
      return;
    }

    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters long.");
      return;
    }

    if (regTwoStepPin.length !== 6 || !/^\d{6}$/.test(regTwoStepPin)) {
      setRegError("Self-created 2-step security PIN must be exactly 6 digits (e.g., 556677).");
      return;
    }

    if (regTwoStepPin !== regConfirmPin) {
      setRegError("2-Step Authentication PIN confirmation does not match.");
      return;
    }

    // Input validations passed! Automatically pop up the Declaration & T&C form
    setIsDeclarationModalOpen(true);
    setDeclarationAccepted(false);
  };

  // When partner ticks "I Accept..." and confirms, create account & open portal immediately
  const handleConfirmDeclarationAndOpenPortal = () => {
    if (!declarationAccepted) return;

    const res = selfRegisterPartner({
      name: regName,
      organisation: regOrg,
      partnerType: regType,
      mobile: regMobile,
      email: regEmail,
      location: regLocation,
      code: regReferralCode,
      password: regPassword,
      twoStepAuthPin: regTwoStepPin,
      panNumber: regPan.trim().toUpperCase(),
      aadhaarNumber: regAadhaar.replace(/\s+/g, ""),
    });

    if (!res.success) {
      setIsDeclarationModalOpen(false);
      setRegError(res.error || "Registration failed. Please check your details.");
      return;
    }

    // Success: Modal closes and portal opens automatically
    setIsDeclarationModalOpen(false);
  };

  // Admin Submit Handler
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    const res = adminLogin(adminPasswordInput);
    if (!res.success) {
      setAdminError(res.error || "Invalid administrator password.");
    }
  };

  // Auto-suggest code based on name
  const handleNameChange = (name: string) => {
    setRegName(name);
    if (!regReferralCode || regReferralCode.startsWith("P2IP-")) {
      const clean = name.trim().split(" ")[0].toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (clean) {
        setRegReferralCode(`P2IP-${clean}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col justify-between" id="auth-portal-container">
      {/* Top Header Bar */}
      <header className="bg-[#0F5132] text-white border-b border-[#D4AF37]/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
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
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">
                  P2IP PartnerSphere™
                </span>
                <span className="text-[10px] bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Accredited Portal
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Official Partner Management System • Path to Inner Peace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() =>
                setActiveTab(activeTab === "PARTNER_WITH_US" ? "SIGN_IN" : "PARTNER_WITH_US")
              }
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "PARTNER_WITH_US"
                  ? "bg-[#D4AF37] text-[#0F5132] border-[#D4AF37] font-black"
                  : "bg-white/10 hover:bg-white/20 text-[#F5D77F] border-[#D4AF37]/40"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Partner With Us (Refer & Earn)</span>
            </button>

            <a
              href="https://p2-ip-partner-sphere.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#c29e2f] text-[#0F5132] font-black text-xs transition shadow-xs"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === "PARTNER_WITH_US" ? (
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 my-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setActiveTab("SIGN_IN")}
              className="px-4 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#125838] transition cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4 text-[#F5D77F]" />
              <span>← Back to Partner Sign In Gateway</span>
            </button>

            <a
              href="https://p2-ip-partner-sphere.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c29e2f] text-[#0F5132] font-black text-xs flex items-center gap-2 transition shadow-md"
            >
              <span>Register Now & Be Our Partner</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <PartnerWithUsView />
        </main>
      ) : (
        /* Main Authentication Card */
        <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 my-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-[#0F5132] via-[#125838] to-[#1a6b47] text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[#F5D77F] text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4 text-[#F5D77F]" />
                2-Step Protected Authentication
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Partner Authentication Gateway
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
                Real commercial CRM with authentic metrics. Login with your unique Referral ID or register a new accredited partner account.
              </p>

              {/* Navigation Tabs */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap bg-black/20 p-1.5 rounded-2xl mt-6 border border-white/10 text-xs font-bold gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("PARTNER_WITH_US");
                  }}
                  className="py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-[#F5D77F] hover:bg-white/10 text-xs font-bold border border-[#D4AF37]/30 bg-[#D4AF37]/10"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5D77F] shrink-0" />
                  <span>Refer & Earn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("SIGN_IN");
                    setSignInError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                    activeTab === "SIGN_IN"
                      ? "bg-white text-[#0F5132] shadow-md font-extrabold"
                      : "text-emerald-100 hover:text-white"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("REGISTER");
                    setRegError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                    activeTab === "REGISTER"
                      ? "bg-white text-[#0F5132] shadow-md font-extrabold"
                      : "text-emerald-100 hover:text-white"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span>Self-Registration</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("ADMIN");
                    setAdminError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                    activeTab === "ADMIN"
                      ? "bg-white text-[#0F5132] shadow-md font-extrabold"
                      : "text-emerald-100 hover:text-white"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8">
            {/* 1. SIGN IN TAB */}
            {activeTab === "SIGN_IN" && (
              <div>
                {signInStep === 1 ? (
                  /* Step 1: Referral ID + Password */
                  <form onSubmit={handleStep1Submit} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Step 1 of 2: Referral Identity
                      </div>
                      <span className="text-[11px] text-[#0F5132] font-semibold">
                        Accredited Partner Check
                      </span>
                    </div>

                    {signInError && (
                      <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Sign In Error:</strong> {signInError}
                        </div>
                      </div>
                    )}

                    {/* Referral ID Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Referral ID / Partner Code <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          required
                          placeholder="Enter your registered Referral ID or Mobile"
                          value={referralIdInput}
                          onChange={(e) => setReferralIdInput(e.target.value.toUpperCase())}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        You can also enter your registered email address or mobile number.
                      </p>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Account Password <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">Min 6 characters</span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Enter your partner password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#0F5132] to-[#146c43] text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30"
                    >
                      <span>Verify Identity & Proceed to 2-Step Auth</span>
                      <ArrowRight className="w-4 h-4 text-[#F5D77F]" />
                    </button>

                    {/* Genuine registration prompt */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Not yet registered as a partner?</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("REGISTER")}
                        className="text-[#0F5132] font-bold hover:underline cursor-pointer"
                      >
                        Self-Register Now →
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: Self-Created 2-Step Authentication */
                  <form onSubmit={handleStep2Submit} className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
                        Step 2 of 2: 2-Step Security Verification
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSignInStep(1);
                          setSignInError(null);
                        }}
                        className="text-[11px] text-gray-500 hover:text-gray-800 underline"
                      >
                        Change Referral ID
                      </button>
                    </div>

                    {/* Partner Identity Verified Card */}
                    <div className="p-4 rounded-2xl bg-[#E8F5E9]/80 border border-[#0F5132]/20 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {tempPartnerPendingAuth?.name?.slice(0, 2).toUpperCase() || "PT"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-sm text-gray-900 truncate">
                          {tempPartnerPendingAuth?.name}
                        </div>
                        <div className="text-[11px] text-[#0F5132] font-semibold">
                          {tempPartnerPendingAuth?.organisation} • Referral ID:{" "}
                          <span className="font-mono font-bold">{tempPartnerPendingAuth?.code}</span>
                        </div>
                      </div>
                      <span className="p-1 rounded-full bg-emerald-100 text-[#0F5132]">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    </div>

                    {signInError && (
                      <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Authentication Error:</strong> {signInError}
                        </div>
                      </div>
                    )}

                    {/* PIN Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Self-Created 6-Digit 2-Step Security PIN <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-[#0F5132] font-semibold">
                          Expected: {tempPartnerPendingAuth?.twoStepAuthPin || "123456"}
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                          type="password"
                          maxLength={6}
                          required
                          autoFocus
                          placeholder="Enter 6-digit security PIN (e.g. 123456)"
                          value={twoStepPinInput}
                          onChange={(e) => setTwoStepPinInput(e.target.value.replace(/\D/g, ""))}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-center text-sm font-mono tracking-widest font-extrabold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1.5">
                        This is the self-created 2-step security PIN set during partner onboarding.
                      </p>
                    </div>

                    {/* SMS / WhatsApp Instant OTP simulation button */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                      <div className="text-gray-600 text-[11px]">
                        {simulatedOtpSent ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            OTP delivered to {tempPartnerPendingAuth?.mobile || "Registered Mobile"}: Code is{" "}
                            <strong className="font-mono">{tempPartnerPendingAuth?.twoStepAuthPin || "123456"}</strong>
                          </span>
                        ) : (
                          "Need a one-time passcode instead?"
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTwoStepPinInput(tempPartnerPendingAuth?.twoStepAuthPin || "123456");
                          setSimulatedOtpSent(true);
                        }}
                        className="text-[11px] text-[#0F5132] font-bold hover:underline cursor-pointer"
                      >
                        {simulatedOtpSent ? "Auto-Filled ✓" : "Send 2-Step OTP"}
                      </button>
                    </div>

                    {/* Complete Button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#0F5132] to-[#146c43] text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#F5D77F]" />
                      <span>Authenticate & Enter P2IP Partner Portal</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 2. SELF-REGISTRATION TAB */}
            {activeTab === "REGISTER" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Accredited Partner Onboarding
                  </div>
                  <span className="text-[11px] text-[#0F5132] font-semibold">
                    Instant Zero-State Setup
                  </span>
                </div>

                {regError && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Registration Error:</strong> {regError}
                    </div>
                  </div>
                )}

                {regSuccessMessage && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Success:</strong> {regSuccessMessage}
                    </div>
                  </div>
                )}

                {/* Section A: Profile */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={regName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Organisation / Studio / Practice
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lotus Wellness Hub"
                        value={regOrg}
                        onChange={(e) => setRegOrg(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Partner Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={regType}
                        onChange={(e) => setRegType(e.target.value as PartnerType)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#0F5132]"
                      >
                        <option value="Yoga Instructor">Yoga Instructor</option>
                        <option value="Fitness Trainer">Fitness Trainer</option>
                        <option value="Gym & Fitness Studio">Gym & Fitness Studio</option>
                        <option value="Psychologist / Counsellor">Psychologist / Counsellor</option>
                        <option value="Wellness & Life Coach">Wellness & Life Coach</option>
                        <option value="Corporate / HR">Corporate / HR</option>
                        <option value="School / College">School / College</option>
                        <option value="Community / Apartment Manager">Community / Apartment Manager</option>
                        <option value="Individual Referral Partner">Individual Referral Partner</option>
                        <option value="Influencer / Creator">Influencer / Creator</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      City & State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad, Telangana"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                </div>

                {/* Section B: Statutory Identification & Tax Compliance (PAN & Aadhaar) */}
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#0F5132]" />
                      Statutory KYC & Tax Compliance (PAN & Aadhaar)
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-[#0F5132] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Sec 194H TDS Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        PAN Card Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          required
                          maxLength={10}
                          placeholder="ABCDE1234F"
                          value={regPan}
                          onChange={(e) =>
                            setRegPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                          }
                          className="w-full pl-10 pr-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500">
                        10-character PAN for statutory TDS compliance & direct payouts
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Aadhaar Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <ShieldCheck className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          required
                          maxLength={14}
                          placeholder="1234 5678 9012"
                          value={regAadhaar}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
                            const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
                            setRegAadhaar(formatted);
                          }}
                          className="w-full pl-10 pr-3.5 py-2 text-xs font-mono font-bold tracking-wider border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500">
                        12-digit UIDAI number for partner identity verification
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section C: Referral ID Configuration */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Self-Create Your Unique Referral ID / Partner Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[#0F5132]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. P2IP-RAMESH or PRANA108"
                      value={regReferralCode}
                      onChange={(e) =>
                        setRegReferralCode(
                          e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "")
                        )
                      }
                      className="w-full pl-10 pr-4 py-2 text-xs font-mono font-extrabold text-[#0F5132] border border-gray-200 rounded-xl uppercase focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Your public referral link will be:{" "}
                    <span className="font-mono font-semibold text-[#0F5132]">
                      https://pathtoinnerpeace.in/r/{regReferralCode || "YOUR-CODE"}
                    </span>
                  </div>
                </div>

                {/* Section D: Password & Self-Created 2-Step Authentication PIN */}
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Create Login Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Self-Create 2-Step PIN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        required
                        placeholder="6 digits (e.g. 556677)"
                        value={regTwoStepPin}
                        onChange={(e) => setRegTwoStepPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3.5 py-2 text-xs font-mono font-bold tracking-widest text-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Confirm 2-Step PIN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        required
                        placeholder="Re-enter 6 digits"
                        value={regConfirmPin}
                        onChange={(e) => setRegConfirmPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3.5 py-2 text-xs font-mono font-bold tracking-widest text-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section E: Automatic Declaration Notice */}
                <div className="pt-2 border-t border-gray-100 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs text-[#0F5132]">
                      Automatic Partner Declaration & T&C Pop-Up
                    </span>
                    <span className="text-[11px] text-emerald-900/90 leading-relaxed block mt-0.5">
                      Submitting this form automatically displays your official Partner Declaration & Terms of Accreditation pop-up with your PAN & Aadhaar details. Ticking "I Accept" will immediately open the accredited partner portal for you.
                    </span>
                  </div>
                </div>

                {/* Submit Self-Registration */}
                <button
                  type="submit"
                  id="btn-register-partner-submit"
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B48220] text-gray-950 font-black text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-gray-950" />
                  <span>Register & View Partner Declaration T&C →</span>
                </button>
              </form>
            )}

            {/* 3. ADMIN CRM TAB */}
            {activeTab === "ADMIN" && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Master Executive Access
                  </div>
                  <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    P2IP Operations
                  </span>
                </div>

                {adminError && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Authentication Error:</strong> {adminError}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Admin Master Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      id="admin-master-password-input"
                      type="password"
                      required
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="Enter master password (p2ip@1230)"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Strictly restricted to master administrators. Enter master password (<span className="font-mono font-bold text-[#0F5132]">p2ip@1230</span>) to access executive operations.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[#F5D77F]" />
                  <span>Verify Master Key & Enter P2IP Executive Admin CRM</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      )}

      {/* Clean Minimal Footer */}
      <footer className="py-3 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
        <p>
          © {new Date().getFullYear()} Path to Inner Peace (P2IP) • All rights reserved
        </p>
      </footer>

      {/* AUTOMATIC DECLARATION & TERMS & CONDITIONS POP-UP MODAL */}
      {isDeclarationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-3xl lg:max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#0F5132]/30 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F5132] to-[#146c43] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4AF37]/50 flex items-center justify-center text-[#F5D77F] shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-wide">
                    Partner Declaration & Code of Conduct
                  </h3>
                  <p className="text-[11px] sm:text-xs text-emerald-200">
                    Official Path to Inner Peace Agreement (v1.3) • 10 Mandatory Client Referral Clauses
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeclarationModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close modal and review registration form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs text-gray-700 leading-relaxed">
              {/* Verification Summary Card */}
              <div className="bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/40 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-emerald-200/50">
                  <span className="font-extrabold text-xs text-[#0F5132] uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#0F5132]" />
                    Accredited Partner Identity & Tax Credentials
                  </span>
                  <span className="text-[10px] font-bold bg-[#0F5132] text-[#F5D77F] px-2.5 py-0.5 rounded-full font-mono border border-[#D4AF37]/40">
                    CODE: {regReferralCode.toUpperCase() || "PENDING"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 text-xs">
                  <div className="p-2 bg-white/80 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] font-semibold">Legal Partner Name:</span>
                    <strong className="text-gray-900 text-xs truncate block">{regName}</strong>
                  </div>
                  <div className="p-2 bg-white/80 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] font-semibold">Vertical & Organisation:</span>
                    <strong className="text-gray-900 text-xs truncate block">{regType} ({regOrg || "Independent"})</strong>
                  </div>
                  <div className="p-2 bg-white/80 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] font-semibold">Mobile & Email:</span>
                    <strong className="text-gray-900 text-xs truncate block">{regMobile} • {regEmail}</strong>
                  </div>
                  <div className="p-2 bg-white/80 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] font-semibold">Operating Location:</span>
                    <strong className="text-gray-900 text-xs truncate block">{regLocation || "India"}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-emerald-300">
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">PAN Card Number:</span>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <span className="font-mono font-extrabold text-[#0F5132] text-xs tracking-wider">
                        {regPan.toUpperCase()}
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        ✓ Sec 194H TDS Ready
                      </span>
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-emerald-300">
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">Aadhaar Number:</span>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <span className="font-mono font-extrabold text-[#0F5132] text-xs tracking-wider">
                        {regAadhaar}
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                        ✓ KYC Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice Bar: Clients Only */}
              <div className="p-3 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-950 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <div className="text-[11px] sm:text-xs">
                  <strong className="font-bold text-amber-900">Mandatory Rule for All Referrals:</strong>{" "}
                  All individuals referred to Path to Inner Peace are designated and serviced strictly as <strong>Clients</strong>. Accredited partners must adhere to the 10 clauses below before being granted access to the Partner Portal.
                </div>
              </div>

              {/* 10 Detailed Clauses to be Adhered by Partner */}
              <div className="space-y-3 bg-[#FAFBFA] p-3.5 sm:p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <h4 className="font-extrabold text-xs uppercase tracking-wide flex items-center gap-1.5 text-[#0F5132]">
                    <FileText className="w-4 h-4" />
                    10 Clauses to be Adhered by Partner for Referring Clients
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    10 Mandatory Rules
                  </span>
                </div>

                <div className="space-y-2.5">
                  {PARTNER_CLIENT_REFERRAL_TERMS.map((clause) => (
                    <div
                      key={clause.id}
                      className="p-3 bg-white rounded-xl border border-gray-200/90 hover:border-[#0F5132]/40 transition shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1 pb-1 border-b border-gray-100">
                        <span className="font-bold text-xs text-[#0F5132] flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#0F5132] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            {clause.clauseNumber}
                          </span>
                          <span>{clause.title}</span>
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {clause.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700 font-medium mb-1.5">
                        {clause.summary}
                      </p>
                      <p className="text-[10.5px] text-gray-500 leading-relaxed font-sans bg-gray-50/70 p-2 rounded-lg border border-gray-100">
                        {clause.fullText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Acceptance Checkbox */}
              <div className="p-3.5 sm:p-4 bg-emerald-50 border-2 border-[#0F5132]/50 rounded-2xl shadow-xs">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="declaration-t-c-accept-checkbox"
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded text-[#0F5132] focus:ring-[#0F5132] cursor-pointer shrink-0"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-black text-emerald-950 block leading-snug">
                      I solemnly declare that the details provided (including PAN and Aadhaar) are authentic. I accept and agree to strictly adhere to all 10 Clauses of the Partner Client Referral Code of Conduct, including referring individuals strictly as Clients, non-clinical practice boundaries, client consent, anti-spam, and statutory TDS compliance.
                    </span>
                    <span className="text-[11px] text-emerald-800/90 mt-1.5 block font-medium">
                      ✓ By ticking this box and clicking the button below, your partner account is accredited, authenticated, and your personal partner portal will open immediately.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsDeclarationModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-xl transition cursor-pointer"
              >
                ← Review & Edit Details
              </button>

              <button
                id="confirm-declaration-and-open-portal-btn"
                type="button"
                disabled={!declarationAccepted}
                onClick={handleConfirmDeclarationAndOpenPortal}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                  declarationAccepted
                    ? "bg-[#0F5132] hover:bg-[#146c43] text-white shadow-emerald-900/20"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#F5D77F] shrink-0" />
                <span>I Accept All 10 Clauses & Open Portal Now →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
