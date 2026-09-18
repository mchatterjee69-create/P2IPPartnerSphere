import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  Shield,
  Save,
  Check,
  Globe,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  Percent,
} from "lucide-react";

export const AdminSettingsView: React.FC = () => {
  const { businessRules, updateBusinessRules } = useApp();

  const [defaultCommissionPercentage, setDefaultCommissionPercentage] = useState(
    businessRules.defaultCommissionPercentage
  );
  const [challengeActivationReward, setChallengeActivationReward] = useState(
    businessRules.challengeActivationReward
  );
  const [refundWindowDays, setRefundWindowDays] = useState(businessRules.validationPeriodDays);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessRules({
      ...businessRules,
      defaultCommissionPercentage,
      challengeActivationReward,
      validationPeriodDays: refundWindowDays,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-settings-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0F5132]" />
            Commercial Rules & Platform Governance
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure universal commission splits, satisfaction guarantee windows, and brand compliance
          </p>
        </div>

        <a
          href="https://www.pathtoinnerpeace.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 bg-[#F8F9F8] hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Globe className="w-4 h-4 text-[#0F5132]" />
          pathtoinnerpeace.in
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Commercial Engine Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
            <Percent className="w-4 h-4 text-[#0F5132]" />
            Revenue Distribution Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Standard Partner Commission (%)
              </label>
              <input
                type="number"
                required
                value={defaultCommissionPercentage}
                onChange={(e) => setDefaultCommissionPercentage(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Calculated on actual collected revenue from paid enrollments. Default is 50%.
              </p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Challenge Activation Reward (₹)
              </label>
              <input
                type="number"
                required
                value={challengeActivationReward}
                onChange={(e) => setChallengeActivationReward(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Credited when referred client attends the Free 5-Day Reset Challenge (default ₹49).
              </p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Refund & Validation Window (Days)
              </label>
              <input
                type="number"
                required
                value={refundWindowDays}
                onChange={(e) => setRefundWindowDays(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-bold"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                7-day satisfaction window before commissions advance from APPROVED to PAYABLE.
              </p>
            </div>
          </div>
        </div>

        {/* Brand & Attribution Protection */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
            <Shield className="w-4 h-4 text-[#0F5132]" />
            Attribution Integrity & Anti-Collision Engine
          </h2>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-3 bg-[#E8F5E9]/50 border border-[#0F5132]/20 rounded-xl space-y-1">
              <div className="font-bold text-[#0F5132]">Mobile (Last 10 Digits) & Email Collision Matching: Active</div>
              <p className="text-[11px] text-gray-600">
                Any lead entered with a matching 10-digit mobile number or sanitized email address is intercepted before commission eligibility, automatically tagged DUPLICATE_FLAGGED, and locked pending administrative attribution review.
              </p>
            </div>

            <div className="p-3 bg-[#FDF8EB] border border-[#D4AF37]/40 rounded-xl space-y-1 text-[#8B6508]">
              <div className="font-bold">Referral Attribution Protection Window: 365 Days</div>
              <p className="text-[11px]">
                Attributed partner maintains credit protection for 1 year from the date of client introduction across all upgrades and renewals.
              </p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}

          <button
            type="submit"
            className="ml-auto px-6 py-3 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
};
