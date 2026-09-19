import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShieldCheck,
  QrCode,
  Share2,
  Copy,
  Check,
  FileText,
  Save,
} from "lucide-react";

export const PartnerProfileView: React.FC = () => {
  const { currentPartner, updatePartnerProfile, setIsQRCodeOpen, setIsTermsOpen } = useApp();

  const [name, setName] = useState(currentPartner.name);
  const [organisation, setOrganisation] = useState(currentPartner.organisation);
  const [mobile, setMobile] = useState(currentPartner.mobile);
  const [email, setEmail] = useState(currentPartner.email);
  const [location, setLocation] = useState(currentPartner.location);
  const [panNumber, setPanNumber] = useState(currentPartner.panNumber || "");
  const [aadhaarNumber, setAadhaarNumber] = useState(currentPartner.aadhaarNumber || "");
  const [upiId, setUpiId] = useState(currentPartner.bankDetails?.upiId || "");
  const [bankName, setBankName] = useState(currentPartner.bankDetails?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(currentPartner.bankDetails?.accountNumber || "");
  const [ifscCode, setIfscCode] = useState(currentPartner.bankDetails?.ifscCode || "");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePartnerProfile({
      ...currentPartner,
      name,
      organisation,
      mobile,
      email,
      location,
      panNumber: panNumber.trim().toUpperCase(),
      aadhaarNumber: aadhaarNumber.trim(),
      bankDetails: {
        upiId,
        bankName,
        accountNumber,
        ifscCode,
        accountName: name,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="partner-profile-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#0F5132]" />
            Partner Profile & Payout Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your accredited partner credentials, settlement accounts, and official attribution assets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQRCodeOpen(true)}
            className="px-3.5 py-2 bg-[#E8F5E9] hover:bg-[#D1E7DD] text-[#0F5132] border border-[#0F5132]/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            View QR Code
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Partner Identity Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
              Accredited Partner Identity
            </h2>
            <span className="font-mono text-xs font-bold text-[#0F5132] bg-[#E8F5E9] px-2.5 py-0.5 rounded border border-[#0F5132]/20">
              {currentPartner.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Partner Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Organisation / Studio</label>
              <input
                type="text"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Mobile Contact</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">City & State</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                PAN Card Number (TDS Sec 194H)
              </label>
              <input
                type="text"
                maxLength={10}
                placeholder="e.g. ABCDE1234F"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono uppercase"
              />
              <span className="text-[10px] text-gray-400">10-character PAN for statutory TDS compliance</span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Aadhaar Number (Identity KYC)
              </label>
              <input
                type="text"
                maxLength={14}
                placeholder="e.g. 1234 5678 9012"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
              />
              <span className="text-[10px] text-gray-400">12-digit UIDAI government identity number</span>
            </div>
          </div>
        </div>

        {/* Bank & Settlement Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0F5132]" />
              Commission Settlement Details (UPI / NEFT)
            </h2>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Verified Payout Channel
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">UPI ID (Instant Settlement)</label>
              <input
                type="text"
                placeholder="e.g. yourname@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                placeholder="e.g. 50100492819201"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">IFSC Code</label>
              <input
                type="text"
                placeholder="e.g. HDFC0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Partner Terms Compliance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0F5132]" />
              Partner Terms & Ethical Agreement
            </div>
            <p className="text-gray-500 text-[11px]">
              {currentPartner.termsAccepted
                ? `Accepted on ${new Date(currentPartner.termsAcceptedAt || Date.now()).toLocaleDateString()}`
                : "Pending Acceptance"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTermsOpen(true)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold cursor-pointer transition"
          >
            Review Terms Agreement
          </button>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Profile changes saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-3 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile & Payout Settings
          </button>
        </div>
      </form>
    </div>
  );
};
