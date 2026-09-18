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
} from "lucide-react";
import { PartnerType } from "../../types";

export const AuthPortal: React.FC = () => {
  const {
    partners,
    loginWithReferralId,
    verifyTwoStepAuth,
    selfRegisterPartner,
    adminLogin,
    tempPartnerPendingAuth,
  } = useApp();

  // Tab: "SIGN_IN" | "REGISTER" | "ADMIN"
  const [activeTab, setActiveTab] = useState<"SIGN_IN" | "REGISTER" | "ADMIN">("SIGN_IN");

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
  const [regReferralCode, setRegReferralCode] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regTwoStepPin, setRegTwoStepPin] = useState("");
  const [regConfirmPin, setRegConfirmPin] = useState("");
  const [regTerms, setRegTerms] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Admin Login State
  const [adminPasswordInput, setAdminPasswordInput] = useState("P2IPAdmin@2026");
  const [adminError, setAdminError] = useState<string | null>(null);

  // Quick fill helper for testing
  const handleQuickFillPartner = (code: string, pass: string, pin: string) => {
    setSignInStep(1);
    setReferralIdInput(code);
    setPasswordInput(pass);
    setTwoStepPinInput(pin);
    setSignInError(null);
  };

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

  // Self Registration Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regMobile.trim()) {
      setRegError("Please fill in your name, email, and mobile number.");
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

    if (!regTerms) {
      setRegError("You must accept the P2IP Accredited Partner code of ethics & terms.");
      return;
    }

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
    });

    if (!res.success) {
      setRegError(res.error || "Registration failed. Please check your details.");
      return;
    }

    setRegSuccessMessage(
      `Accredited Partner account successfully created with Referral ID "${regReferralCode.toUpperCase()}"!`
    );
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
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4AF37]/40 flex items-center justify-center text-lg font-black text-[#F5D77F] shadow-sm">
              ॐ
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

          <a
            href="https://www.pathtoinnerpeace.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-100 hover:text-white transition"
          >
            <span>Visit Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Authentication Card */}
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
            <div className="flex bg-black/20 p-1 rounded-2xl mt-6 border border-white/10 text-xs font-bold">
              <button
                onClick={() => {
                  setActiveTab("SIGN_IN");
                  setSignInError(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "SIGN_IN"
                    ? "bg-white text-[#0F5132] shadow-md font-extrabold"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In by Referral ID
              </button>

              <button
                onClick={() => {
                  setActiveTab("REGISTER");
                  setRegError(null);
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "REGISTER"
                    ? "bg-white text-[#0F5132] shadow-md font-extrabold"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Self-Registration
              </button>

              <button
                onClick={() => {
                  setActiveTab("ADMIN");
                  setAdminError(null);
                }}
                className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "ADMIN"
                    ? "bg-white text-[#0F5132] shadow-md font-extrabold"
                    : "text-emerald-100 hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
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
                          placeholder="e.g. P2IP123 or FRESHZERO"
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

                    {/* Quick Access Testing Accreditations */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-[11px] font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Instant Testing Accreditations (Click to load):</span>
                      </div>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => handleQuickFillPartner("FRESHZERO", "Password@123", "123456")}
                          className="w-full text-left p-2.5 rounded-xl border border-emerald-300/80 bg-emerald-50/70 hover:bg-emerald-100/70 transition flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-extrabold text-[#0F5132] flex items-center gap-1.5">
                              <span>🌱 Fresh Partner: Ravi Teja (FRESHZERO)</span>
                              <span className="text-[9px] bg-emerald-200 text-[#0F5132] px-1.5 py-0.2 rounded font-mono">
                                0 Referrals • ₹0 Real Values
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-600">
                              Pass: <strong>Password@123</strong> • 2-Step PIN: <strong>123456</strong>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#0F5132]">Select →</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickFillPartner("P2IP123", "Anita@2026", "108108")}
                          className="w-full text-left p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>Dr. Anita Sharma (P2IP123)</span>
                              <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-mono">
                                Active History
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Pass: <strong>Anita@2026</strong> • 2-Step PIN: <strong>108108</strong>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-600">Select →</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickFillPartner("FITPULSE", "Vikram@2026", "202600")}
                          className="w-full text-left p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-gray-900">
                              Vikram Malhotra (FITPULSE) - Gym Partner
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Pass: <strong>Vikram@2026</strong> • 2-Step PIN: <strong>202600</strong>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-600">Select →</span>
                        </button>
                      </div>
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

                {/* Section B: Referral ID Configuration */}
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

                {/* Section C: Password & Self-Created 2-Step Authentication PIN */}
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

                {/* Section D: Terms */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regTerms}
                      onChange={(e) => setRegTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#0F5132] focus:ring-[#0F5132]"
                    />
                    <span>
                      I agree to the P2IP Accredited Referral Partner Code of Conduct. I acknowledge the standard 50% revenue share, 7-day refund hold on commissions, and Friday payout cycle.
                    </span>
                  </label>
                </div>

                {/* Submit Self-Registration */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B48220] text-gray-950 font-black text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-gray-950" />
                  <span>Register Accredited Partner & Launch Real Portal</span>
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
                      type="password"
                      required
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="Enter administrator passcode"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Master key pre-filled for authorized administrators (P2IPAdmin@2026).
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[#F5D77F]" />
                  <span>Enter P2IP Executive Admin CRM</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-500 border-t border-gray-200 bg-white">
        <p>
          © {new Date().getFullYear()} Path to Inner Peace (P2IP). Accredited Partner Relationship & Attribution Network.
        </p>
      </footer>
    </div>
  );
};
