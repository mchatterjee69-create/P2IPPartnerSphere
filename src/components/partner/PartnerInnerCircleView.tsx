import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Share2,
  Users,
  Gift,
  Coins,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Network,
} from "lucide-react";

export const PartnerInnerCircleView: React.FC = () => {
  const { currentPartner, clientNodes, currentRole } = useApp();

  // Filter client nodes attributed to the current partner
  const myClientNodes = clientNodes.filter((node) =>
    currentRole === "admin" ? true : node.originalPartnerId === currentPartner.id
  );

  const totalInnerCircleReferrals = myClientNodes.reduce(
    (acc, node) => acc + node.subReferrals.length,
    0
  );

  const totalPartnerCreditsEarned = totalInnerCircleReferrals * 49;

  return (
    <div className="space-y-6 animate-fade-in" id="partner-inner-circle-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#0F5132]" />
            Inner Circle: Client-to-Client Referral Loop
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Turn your transformed clients into advocates. When they refer friends to the 5-Day Reset, both they and you earn ₹49 credits.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#0F5132]/30 px-3.5 py-1.5 rounded-xl">
          <Coins className="w-4 h-4 text-[#0F5132]" />
          <span className="text-xs font-bold text-[#0F5132]">
            Total Loop Credits Earned: ₹{totalPartnerCreditsEarned}
          </span>
        </div>
      </div>

      {/* HOW IT WORKS VISUAL ROADMAP */}
      <div className="bg-gradient-to-br from-[#0F5132] to-[#125838] text-white p-6 rounded-3xl shadow-md border border-[#D4AF37]/30">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5D77F] mb-2">
          <Sparkles className="w-4 h-4 text-[#F5D77F]" />
          Harmonic Referral Synergy
        </div>
        <h2 className="text-lg font-bold text-white mb-4">
          How the Inner Circle Multiplies Your Impact & Earnings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Node 1 */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 space-y-2">
            <div className="text-[10px] font-bold text-emerald-200 uppercase">Step 1</div>
            <div className="text-sm font-bold text-white">You Refer Client A</div>
            <p className="text-emerald-100/80 text-[11px] leading-relaxed">
              You introduce your client to the Free 5-Day Mind Reset Challenge or Mind Mastery program.
            </p>
          </div>

          {/* Node 2 */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 space-y-2">
            <div className="text-[10px] font-bold text-emerald-200 uppercase">Step 2</div>
            <div className="text-sm font-bold text-white">Client A Invites Friends</div>
            <p className="text-emerald-100/80 text-[11px] leading-relaxed">
              Your client experiences deep stress relief and shares their personal invite link with friends (Client B).
            </p>
          </div>

          {/* Node 3 */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-[#D4AF37]/50 space-y-2 bg-[#D4AF37]/15">
            <div className="text-[10px] font-bold text-[#F5D77F] uppercase">Step 3: Dual Rewards</div>
            <div className="text-sm font-bold text-[#F5D77F]">₹49 Client + ₹49 Partner</div>
            <p className="text-emerald-100/90 text-[11px] leading-relaxed">
              When Client B attends, Client A gets ₹49 Inner Peace wallet credits, and You (Partner) receive ₹49 Partner referral credit!
            </p>
          </div>
        </div>
      </div>

      {/* CLIENT REFERRAL TREE & SUB-REFERRALS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Active Client Referral Advocates ({myClientNodes.length})
          </h2>
          <span className="text-xs text-gray-500">
            Sub-referrals logged: <strong className="text-gray-900">{totalInnerCircleReferrals}</strong>
          </span>
        </div>

        {myClientNodes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-xs">
            No Inner Circle sub-referrals logged yet. Encourage your clients to share their invite link after completing the 5-Day Reset!
          </div>
        ) : (
          myClientNodes.map((node) => (
            <div
              key={node.clientId}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4"
            >
              {/* Client Parent Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#0F5132] font-extrabold flex items-center justify-center text-sm border border-[#0F5132]/20">
                    {node.clientName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{node.clientName}</h3>
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Code: {node.inviteCode}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Referred by {node.originalPartnerName} • Member since {node.joinedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-semibold">
                      Client Credit Balance
                    </span>
                    <span className="text-xs font-bold text-[#0F5132]">
                      ₹{node.innerPeaceCreditBalance} Inner Peace Credits
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-referral branches */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-[#0F5132]" />
                  Sub-Referrals Generated ({node.subReferrals.length}):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {node.subReferrals.map((sub) => (
                    <div
                      key={sub.referredClientId}
                      className="p-3 rounded-xl bg-[#F8F9F8] border border-gray-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-gray-900">{sub.referredClientName}</div>
                        <div className="text-[10px] text-gray-500">
                          Referred on {sub.referredDate} • Status:{" "}
                          <strong className="text-[#0F5132]">{sub.status}</strong>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F5132]">
                          +₹49 Partner Credit Paid
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
