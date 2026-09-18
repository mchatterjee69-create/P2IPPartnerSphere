import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Workflow,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Mail,
  Bell,
  Coins,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { AutomationRule } from "../../types";

export const AdminAutomationEngine: React.FC = () => {
  const { automationRules, toggleAutomationRule, addAutomationRule } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [triggerEvent, setTriggerEvent] = useState<AutomationRule["triggerEvent"]>("LEAD_CREATED");
  const [actionResult, setActionResult] = useState("WhatsApp VIP Welcome + Partner Notification");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAutomationRule({
      id: `rule-${Date.now()}`,
      title,
      description,
      triggerEvent,
      actionResult,
      isActive: true,
    });
    setIsAddOpen(false);
    setTitle("");
    setDescription("");
  };

  const getActionIcon = (actionStr: string) => {
    if (actionStr.toLowerCase().includes("whatsapp")) {
      return <MessageSquare className="w-4 h-4 text-[#25D366]" />;
    } else if (actionStr.toLowerCase().includes("email")) {
      return <Mail className="w-4 h-4 text-blue-600" />;
    } else if (actionStr.toLowerCase().includes("reward") || actionStr.toLowerCase().includes("credit")) {
      return <Coins className="w-4 h-4 text-[#B48220]" />;
    } else if (actionStr.toLowerCase().includes("stage") || actionStr.toLowerCase().includes("status")) {
      return <ShieldCheck className="w-4 h-4 text-[#0F5132]" />;
    }
    return <Bell className="w-4 h-4 text-purple-600" />;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-automations-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-[#0F5132]" />
            Workflow Automations & Trigger Engine
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Event-driven rules for instant WhatsApp welcome messages, challenge onboarding, commission crediting, and inactive partner engagement
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Trigger Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {automationRules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              rule.isActive ? "border-gray-200" : "border-gray-300 opacity-60 bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#F8F9F8] border border-gray-200 shrink-0">
                {getActionIcon(rule.actionResult)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-gray-900">{rule.title}</h3>
                  <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {rule.triggerEvent}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{rule.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-2 font-medium">
                  <span>Action: <strong className="text-gray-700">{rule.actionResult}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleAutomationRule(rule.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  rule.isActive
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {rule.isActive ? "Active Rule" : "Paused"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CREATE TRIGGER RULE */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#0F5132]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#0F5132]" />
                Configure Trigger-Action Rule
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Challenge Welcome Notification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Event Trigger</label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                >
                  <option value="LEAD_CREATED">Lead Created in CRM</option>
                  <option value="CHALLENGE_COMPLETED">Client Completed 5-Day Reset Challenge</option>
                  <option value="PAYMENT_SUCCESSFUL">Customer Payment Collected</option>
                  <option value="REFUND_RECEIVED">Refund Requested / Reversal Trigger</option>
                  <option value="PARTNER_REACHED_TARGET">Partner Reached Monthly Milestone Target</option>
                  <option value="SUBSCRIPTION_EXPIRING">Annual Membership Subscription Expiring</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Action Dispatched</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Send WhatsApp Template + Notify Partner"
                  value={actionResult}
                  onChange={(e) => setActionResult(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Rule Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explains what this rule achieves..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Save Automation Rule
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
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
