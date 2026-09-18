import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Users,
  Search,
  Plus,
  Shield,
  Edit,
  CheckCircle,
  XCircle,
  DollarSign,
  Award,
  Filter,
  Check,
  Building2,
  Phone,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import { Partner, PartnerType, PartnerLevelKey } from "../../types";

export const AdminPartnerManagement: React.FC = () => {
  const {
    partners,
    partnerLevels,
    createPartner,
    updatePartnerProfile,
    togglePartnerStatus,
    setDiscretionaryBonus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal: Add Partner
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerOrg, setNewPartnerOrg] = useState("");
  const [newPartnerType, setNewPartnerType] = useState<PartnerType>("Fitness Trainer");
  const [newPartnerMobile, setNewPartnerMobile] = useState("");
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [newPartnerLocation, setNewPartnerLocation] = useState("");

  // Modal: Edit Commission / Level / Bonus
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [customRate, setCustomRate] = useState<number>(50);
  const [selectedLevel, setSelectedLevel] = useState<PartnerLevelKey>("STARTER");
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [bonusReason, setBonusReason] = useState<string>("");

  const filteredPartners = partners.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.organisation.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.mobile.includes(q);

    if (!matchSearch) return false;
    if (typeFilter !== "ALL" && p.partnerType !== typeFilter) return false;
    if (levelFilter !== "ALL" && p.level !== levelFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    return true;
  });

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    const codeNum = Math.floor(100 + Math.random() * 900);
    const code = `P2IP${codeNum}`;
    createPartner({
      id: `P2IP-PT-00${codeNum}`,
      code,
      name: newPartnerName,
      organisation: newPartnerOrg || newPartnerName,
      partnerType: newPartnerType,
      mobile: newPartnerMobile,
      email: newPartnerEmail,
      location: newPartnerLocation,
      joiningDate: new Date().toISOString().split("T")[0],
      level: "STARTER",
      status: "ACTIVE",
      referralUrl: `https://www.pathtoinnerpeace.in/r/${code}`,
      totalReferrals: 0,
      currentMonthlyReferrals: 0,
      totalCustomers: 0,
      lifetimeRevenue: 0,
      lifetimeCommission: 0,
      monthlyTarget: 10,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: "2.1",
    });
    setIsAddPartnerOpen(false);
    setNewPartnerName("");
    setNewPartnerOrg("");
    setNewPartnerMobile("");
    setNewPartnerEmail("");
    setNewPartnerLocation("");
  };

  const handleUpdatePartnerDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;

    updatePartnerProfile({
      ...selectedPartner,
      customCommissionRate: customRate > 0 ? customRate : undefined,
      level: selectedLevel,
    });

    if (bonusAmount > 0 && bonusReason) {
      setDiscretionaryBonus(selectedPartner.id, bonusAmount, bonusReason);
    }

    setSelectedPartner(null);
    setBonusAmount(0);
    setBonusReason("");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-partner-mgmt-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0F5132]" />
            Universal Partner Directory & Governance
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage gym owners, corporate HRs, yoga teachers, psychologists, coaches, and institutional affiliates
          </p>
        </div>

        <button
          onClick={() => setIsAddPartnerOpen(true)}
          className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Onboard New Partner
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search partner by name, studio, code, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white text-gray-800"
          >
            <option value="ALL">All Categories ({partners.length})</option>
            <option value="GYM">Gyms</option>
            <option value="FITNESS_TRAINER">Fitness Trainers</option>
            <option value="YOGA_INSTRUCTOR">Yoga Instructors</option>
            <option value="SCHOOL">Schools</option>
            <option value="COLLEGE">Colleges</option>
            <option value="CORPORATE">Corporates</option>
            <option value="HR_PROFESSIONAL">HR Professionals</option>
            <option value="PSYCHOLOGIST">Psychologists</option>
            <option value="COACH">Coaches</option>
            <option value="INFLUENCER">Influencers</option>
            <option value="COMMUNITY_MANAGER">Apartments/Clubs</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white text-gray-800"
          >
            <option value="ALL">All Growth Levels</option>
            <option value="STARTER">Starter</option>
            <option value="BUILDER">Builder</option>
            <option value="GROWTH">Growth</option>
            <option value="PRO">Pro</option>
            <option value="ELITE">Elite</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-xl text-xs font-semibold bg-white text-gray-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Partner Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F8] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Partner / Code</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4 text-center">Level</th>
                <th className="py-3 px-4 text-center">Rate</th>
                <th className="py-3 px-4 text-center">Referrals / Paid</th>
                <th className="py-3 px-4 text-right">Lifetime Rev</th>
                <th className="py-3 px-4 text-right">Lifetime Comm</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPartners.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <div className="text-[11px] text-gray-500">{p.organisation}</div>
                    <div className="font-mono text-[10px] text-[#0F5132] font-bold">
                      Code: {p.code} • {p.id}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-800 block">{p.partnerType}</span>
                    <span className="text-[11px] text-gray-500">{p.location}</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4AF37]/20 text-[#8B6508] border border-[#D4AF37]/40">
                      {p.level}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-gray-800">
                    {p.customCommissionRate ? `${p.customCommissionRate}% (Custom)` : "50% (Default)"}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-gray-900">{p.totalReferrals}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="font-bold text-[#0F5132]">{p.totalCustomers}</span>
                  </td>

                  <td className="py-3 px-4 text-right font-medium">
                    ₹{p.lifetimeRevenue.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3 px-4 text-right font-black text-[#0F5132]">
                    ₹{p.lifetimeCommission.toLocaleString("en-IN")}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.status === "SUSPENDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedPartner(p);
                        setCustomRate(p.customCommissionRate || 50);
                        setSelectedLevel(p.level);
                      }}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[11px] font-bold transition cursor-pointer"
                    >
                      Edit / Bonus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ONBOARD NEW PARTNER */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#0F5132]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0F5132]" />
                Onboard New Accredited Partner
              </h3>
              <button
                onClick={() => setIsAddPartnerOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Partner Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rathore"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Organisation / Studio</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CultFit Indiranagar"
                    value={newPartnerOrg}
                    onChange={(e) => setNewPartnerOrg(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Partner Category</label>
                  <select
                    value={newPartnerType}
                    onChange={(e) => setNewPartnerType(e.target.value as PartnerType)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  >
                    <option value="Gym & Fitness Studio">Gym & Fitness Studio</option>
                    <option value="Fitness Trainer">Fitness Trainer</option>
                    <option value="Yoga Instructor">Yoga Instructor</option>
                    <option value="School">School</option>
                    <option value="College & University">College & University</option>
                    <option value="Corporate / HR">Corporate / HR</option>
                    <option value="Psychologist / Counsellor">Psychologist / Counsellor</option>
                    <option value="Wellness & Life Coach">Wellness & Life Coach</option>
                    <option value="Apartment / Community Manager">Apartment / Community Manager</option>
                    <option value="Social Club">Social Club</option>
                    <option value="NGO / Foundation">NGO / Foundation</option>
                    <option value="Influencer / Creator">Influencer / Creator</option>
                    <option value="Existing P2IP Client">Existing P2IP Client</option>
                    <option value="Individual Referral Partner">Individual Referral Partner</option>
                    <option value="Corporate Channel Partner">Corporate Channel Partner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9876543210"
                    value={newPartnerMobile}
                    onChange={(e) => setNewPartnerMobile(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@wellness.com"
                    value={newPartnerEmail}
                    onChange={(e) => setNewPartnerEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">City & State</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore, Karnataka"
                  value={newPartnerLocation}
                  onChange={(e) => setNewPartnerLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-[#E8F5E9] border border-[#0F5132]/20 rounded-xl text-[#0F5132] text-[11px]">
                System will automatically assign an accredited Partner ID, unique referral code (P2IP-XXX), and default 50% revenue share terms.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Onboard Partner & Generate Credentials
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PARTNER GOVERNANCE & DISCRETIONARY BONUS */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-300 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0F5132]" />
                Partner Governance: {selectedPartner.name}
              </h3>
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePartnerDetails} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Growth Tier Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as PartnerLevelKey)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                >
                  <option value="STARTER">Starter</option>
                  <option value="BUILDER">Builder</option>
                  <option value="GROWTH">Growth</option>
                  <option value="PRO">Pro</option>
                  <option value="ELITE">Elite</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Custom Commission Rate (%)
                </label>
                <input
                  type="number"
                  value={customRate}
                  onChange={(e) => setCustomRate(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                <span className="text-[10px] text-gray-400">
                  Default standard platform rate is 50%.
                </span>
              </div>

              <div className="pt-2 border-t">
                <label className="block font-bold text-[#8B6508] mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Grant Discretionary Performance Bonus (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={bonusAmount || ""}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />

                {bonusAmount > 0 && (
                  <div className="mt-2">
                    <label className="block font-bold text-gray-700 mb-1">
                      Bonus Reason (Logged to Ledger)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Corporate Wellness Drive Excellence Bonus"
                      value={bonusReason}
                      onChange={(e) => setBonusReason(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => togglePartnerStatus(selectedPartner.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    selectedPartner.status === "ACTIVE"
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  }`}
                >
                  {selectedPartner.status === "ACTIVE" ? "Suspend Partner" : "Activate Partner"}
                </button>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Save Governance Changes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
