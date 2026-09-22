import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BrandLogo } from "../common/BrandLogo";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Heart,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sun,
  Moon,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export const PublicReferralPage: React.FC = () => {
  const { currentPartner, createReferral, products, setActiveTab } = useApp();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [preferredBatch, setPreferredBatch] = useState("Morning (6:30 AM - 7:15 AM IST)");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [duplicateNotice, setDuplicateNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createReferral({
      partnerId: currentPartner.id,
      clientName: fullName,
      mobile,
      email,
      location: location || "India",
      interestedProgramId: "prod-free-reset",
      referralSource: `Public Link: ${currentPartner.code}`,
      notes: `Registered via public landing page. Preferred batch: ${preferredBatch}`,
      consent: true,
    });

    if (!result.success || !result.lead) {
      alert(result.error || result.message || "Duplicate registration prohibited: A participant with this mobile number or email is already registered.");
      return;
    }

    if (result.isDuplicate) {
      setDuplicateNotice(true);
    }

    setSubmittedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FCFDFD] text-gray-800 flex flex-col justify-between animate-fade-in" id="public-referral-page">
      {/* Top Banner with Partner Attribution */}
      <div className="bg-gradient-to-r from-[#0F5132] to-[#125838] text-white py-2.5 px-4 text-center text-xs font-medium border-b border-[#D4AF37]/30 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F5D77F]" />
        <span>
          Exclusive Invitation through Accredited Partner:{" "}
          <strong className="text-[#F5D77F] font-bold">
            {currentPartner.name} ({currentPartner.organisation})
          </strong>
        </span>
      </div>

      {/* Navigation / Header */}
      <header className="bg-white border-b border-gray-100 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BrandLogo showTagline={true} />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="text-xs font-semibold text-[#0F5132] hover:underline cursor-pointer"
            >
              ← Return to App
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">
        {/* Left Column: Challenge Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#0F5132] text-xs font-bold uppercase tracking-wider border border-[#0F5132]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Free 5-Day Mind Reset Challenge
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            Transform Your Mind. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F5132] to-[#1a8553]">
              Elevate Your Life.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
            Join thousands who have discovered calm, mental clarity, and restful sleep with Path to Inner Peace's signature 5-day breathwork and mindfulness protocol.
          </p>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center font-bold">
                🧠
              </div>
              <h3 className="text-xs font-bold text-gray-900">Quiet The Mental Noise</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Break destructive overthinking cycles and dissolve chronic cognitive stress.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#8B6508] flex items-center justify-center font-bold">
                🌙
              </div>
              <h3 className="text-xs font-bold text-gray-900">Deep, Restorative Sleep</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Scientifically tested vagal nerve stimulation for effortless nighttime rest.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                🧘‍♂️
              </div>
              <h3 className="text-xs font-bold text-gray-900">Live Guided Breathwork</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Daily interactive morning & evening live sessions with senior coaches.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-1">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                📜
              </div>
              <h3 className="text-xs font-bold text-gray-900">100% Free Invitation</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Zero fees. Fully sponsored through your accredited partner code: <strong>{currentPartner.code}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Registration Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F5132] via-[#D4AF37] to-[#0F5132]" />

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#0F5132] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8 text-[#0F5132]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-gray-900">Spot Confirmed!</h3>
                  <p className="text-xs text-gray-600">
                    Welcome, <strong>{fullName}</strong>! You are officially registered for the upcoming Free 5-Day Mind Reset Challenge.
                  </p>
                </div>

                <div className="p-4 bg-[#F8F9F8] border border-gray-200 rounded-2xl text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected Batch:</span>
                    <strong className="text-gray-800">{preferredBatch}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Attributed Partner:</span>
                    <strong className="text-[#0F5132]">{currentPartner.name}</strong>
                  </div>
                </div>

                {duplicateNotice && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Notice:</strong> Your mobile or email matched an existing record. Our team will verify your referral attribution to ensure your inviter receives full credit.
                    </span>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  We have sent your session join links and daily calendar invite to your WhatsApp and email.
                </p>

                <button
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setFullName("");
                    setMobile("");
                    setEmail("");
                  }}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Register Another Member
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-gray-900">Reserve Your Free Spot</h2>
                  <p className="text-gray-500 text-xs">
                    Sponsored by <strong>{currentPartner.name}</strong> • Next Batch Starts Monday
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    WhatsApp Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] text-xs"
                  />
                  <span className="text-[10px] text-gray-400">
                    Live session Zoom links are sent via WhatsApp.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Delhi, Bangalore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Preferred Daily Batch</label>
                  <select
                    value={preferredBatch}
                    onChange={(e) => setPreferredBatch(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#0F5132] text-xs font-medium"
                  >
                    <option value="Morning (6:30 AM - 7:15 AM IST)">
                      🌅 Morning Batch (6:30 AM - 7:15 AM IST)
                    </option>
                    <option value="Evening (7:30 PM - 8:15 PM IST)">
                      🌙 Evening Batch (7:30 PM - 8:15 PM IST)
                    </option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#0F5132] to-[#146c43] hover:from-[#125838] hover:to-[#0F5132] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30 text-xs"
                  >
                    <span>Claim Free 5-Day Access Now</span>
                    <ArrowRight className="w-4 h-4 text-[#F5D77F]" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F5132]" />
                  <span>No credit card required. 100% Free Invitation.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-gray-100 py-3.5 px-4 bg-white text-center text-xs text-gray-400">
        <div className="max-w-6xl mx-auto">
          © {new Date().getFullYear()} Path to Inner Peace (P2IP) • All rights reserved
        </div>
      </footer>
    </div>
  );
};
