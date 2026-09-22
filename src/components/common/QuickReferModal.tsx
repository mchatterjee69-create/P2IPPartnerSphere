import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
  Clock,
  Sparkles,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react";

export const QuickReferModal: React.FC = () => {
  const {
    isQuickReferOpen,
    setIsQuickReferOpen,
    createReferral,
    products,
    currentPartner,
    partners,
    currentRole,
  } = useApp();

  const [clientName, setClientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [interestedProgramId, setInterestedProgramId] = useState("prod-free-reset");
  const [referralSource, setReferralSource] = useState("Direct Recommendation");
  const [preferredContactTime, setPreferredContactTime] = useState("Evenings (5 PM - 8 PM)");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(true);
  const [selectedPartnerId, setSelectedPartnerId] = useState(currentPartner.id);

  const [submittedLead, setSubmittedLead] = useState<{
    leadId: string;
    isDuplicate: boolean;
    clientName: string;
    programName: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isQuickReferOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !mobile.trim()) {
      alert("Please enter the client's name and mobile number.");
      return;
    }

    if (!consent) {
      alert("Please confirm client consent.");
      return;
    }

    const res = createReferral({
      clientName: clientName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      location: location.trim() || "India",
      interestedProgramId,
      referralSource,
      preferredContactTime,
      notes: notes.trim(),
      consent,
      partnerId: currentRole === "admin" ? selectedPartnerId : currentPartner.id,
    });

    if (!res.success || !res.lead) {
      alert(res.error || res.message || "Duplicate client registration is strictly prohibited. This client is already registered in P2IP.");
      return;
    }

    const chosenProg = products.find((p) => p.id === interestedProgramId);

    setSubmittedLead({
      leadId: res.lead.id,
      isDuplicate: false,
      clientName: res.lead.clientName,
      programName: chosenProg?.name || "FREE 5-Day Mind Reset Challenge",
    });
  };

  const handleClose = () => {
    setIsQuickReferOpen(false);
    setSubmittedLead(null);
    setClientName("");
    setMobile("");
    setEmail("");
    setLocation("");
    setNotes("");
  };

  const targetPartner =
    partners.find((p) => p.id === (currentRole === "admin" ? selectedPartnerId : currentPartner.id)) ||
    currentPartner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#0F5132]/20 overflow-hidden flex flex-col max-h-[92vh]"
        id="quick-refer-modal-content"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F5132] to-[#146c43] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-[#D4AF37]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Quick Refer a Client</h3>
              <p className="text-xs text-emerald-100/80">
                Sub-30s referral intake with instant duplicate attribution check
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 text-[#1F2923]">
          {submittedLead ? (
            /* Success / Confirmation Screen */
            <div className="text-center py-4 space-y-4">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  submittedLead.isDuplicate
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-[#0F5132]"
                }`}
              >
                {submittedLead.isDuplicate ? (
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-[#0F5132]" />
                )}
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-gray-900">
                  {submittedLead.isDuplicate
                    ? "Referral Logged (Duplicate Flagged)"
                    : "Referral Successfully Logged!"}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {submittedLead.isDuplicate
                    ? "This contact matches an existing client in the database. P2IP Admin has been notified for attribution review."
                    : "Attribution confirmed! Your referral is now securely logged under your partner account."}
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#F8F9F8] border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Referral ID:</span>
                  <span className="font-mono font-bold text-[#0F5132]">{submittedLead.leadId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Client Name:</span>
                  <span className="font-bold text-gray-800">{submittedLead.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Program:</span>
                  <span className="font-semibold text-gray-800">{submittedLead.programName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Attributed Partner:</span>
                  <span className="font-bold text-[#0F5132]">{targetPartner.name}</span>
                </div>
              </div>

              {/* Recommended Next Action */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${mobile.replace(
                    /[^0-9]/g,
                    ""
                  )}&text=${encodeURIComponent(
                    `Hi ${submittedLead.clientName}! 🌿 I've referred you to Path to Inner Peace for the ${submittedLead.programName}. You can learn more or check your invite details here: ${targetPartner.referralUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#1EBE5D] transition shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Send WhatsApp Welcome Note to Client
                </a>

                <button
                  onClick={() => {
                    setSubmittedLead(null);
                    setClientName("");
                    setMobile("");
                    setEmail("");
                    setLocation("");
                  }}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
                >
                  Refer Another Client
                </button>
              </div>
            </div>
          ) : (
            /* Referral Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* If in Admin view, allow selecting referring partner */}
              {currentRole === "admin" && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Attributing Partner (Admin selector)
                  </label>
                  <select
                    value={selectedPartnerId}
                    onChange={(e) => setSelectedPartnerId(e.target.value)}
                    className="w-full text-xs font-semibold border border-amber-300 rounded-lg p-2 bg-white"
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.organisation}) - Code: {p.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Client Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Client Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 12345"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru / Mumbai"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132] focus:border-[#0F5132]"
                    />
                  </div>
                </div>
              </div>

              {/* Program Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Interested Program
                </label>
                <select
                  value={interestedProgramId}
                  onChange={(e) => setInterestedProgramId(e.target.value)}
                  className="w-full p-2.5 text-xs font-medium border border-gray-300 rounded-xl bg-[#F8F9F8] focus:ring-2 focus:ring-[#0F5132]"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} — {prod.price === 0 ? "FREE (₹49 Activation Reward)" : `₹${prod.price}/mo (50% commission = ₹${(prod.price * 0.5).toFixed(2)})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Referral Source & Best Contact Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Referral Context / Source
                  </label>
                  <select
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                  >
                    <option value="Direct Recommendation">Direct Personal Recommendation</option>
                    <option value="Gym / Fitness Consultation">Gym / Fitness Consultation</option>
                    <option value="Wellness / Life Coaching">Wellness / Life Coaching</option>
                    <option value="Corporate / HR Initiative">Corporate / HR Initiative</option>
                    <option value="Community / Apartment Notice">Community / Apartment Notice</option>
                    <option value="Social Media / Content">Social Media / Content</option>
                    <option value="Client Inner Circle Referral">Client Inner Circle Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Best Time to Call
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Mornings 10-12 AM"
                      value={preferredContactTime}
                      onChange={(e) => setPreferredContactTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                    />
                  </div>
                </div>
              </div>

              {/* Client Wellness Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Key Concerns / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Insomnia, work burnout, looking for meditation & breathwork techniques..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
                />
              </div>

              {/* Consent & Ethics Confirmation */}
              <div className="p-3 bg-[#E8F5E9]/50 border border-[#0F5132]/20 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="referral-consent-check"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0F5132] rounded focus:ring-[#0F5132]"
                />
                <label htmlFor="referral-consent-check" className="text-[11px] text-gray-700 leading-relaxed cursor-pointer">
                  <strong className="text-[#0F5132]">Client Consent Confirmed:</strong> I confirm this individual has expressed genuine interest in mental wellness and consented to be contacted by Path to Inner Peace counselors.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#0F5132] to-[#146c43] text-white rounded-xl text-sm font-bold shadow hover:shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/30"
                >
                  <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                  Log Referral & Secure Attribution
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
