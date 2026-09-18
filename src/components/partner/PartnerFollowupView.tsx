import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Phone,
  MessageSquare,
  Mail,
  Users,
  Trash2,
  Sparkles,
  Filter,
} from "lucide-react";
import { FollowupTask, FollowupPriority } from "../../types";

export const PartnerFollowupView: React.FC = () => {
  const { currentPartner, followups, leads, completeFollowup, addFollowup, deleteFollowup } =
    useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("PENDING");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [priority, setPriority] = useState<FollowupPriority>("HIGH");
  const [actionType, setActionType] = useState<"CALL" | "WHATSAPP" | "EMAIL" | "MEETING">("WHATSAPP");

  // Filter tasks strictly belonging to current partner
  const partnerTasks = followups.filter(
    (t) => t.partnerId === currentPartner.id
  );

  // Partner's leads for assignment dropdown
  const partnerLeads = leads.filter(
    (l) => l.partnerId === currentPartner.id
  );

  const filteredTasks = partnerTasks.filter((task) => {
    if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
    if (priorityFilter !== "ALL" && task.priority !== priorityFilter) return false;
    if (actionFilter !== "ALL" && task.actionType !== actionFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLead = task.leadName.toLowerCase().includes(q);
      const matchTitle = task.title.toLowerCase().includes(q);
      return matchLead || matchTitle;
    }
    return true;
  });

  const pendingCount = partnerTasks.filter((t) => t.status === "PENDING").length;
  const highPriorityCount = partnerTasks.filter(
    (t) => t.status === "PENDING" && t.priority === "HIGH"
  ).length;
  const completedCount = partnerTasks.filter((t) => t.status === "COMPLETED").length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedLead = partnerLeads.find((l) => l.id === selectedLeadId);

    const newTask: FollowupTask = {
      id: `task-${Date.now()}`,
      leadId: selectedLeadId || "general",
      leadName: assignedLead ? assignedLead.clientName : "General Partner Task",
      partnerId: currentPartner.id,
      title: taskTitle.trim(),
      dueDate,
      priority,
      status: "PENDING",
      actionType,
    };

    addFollowup(newTask);
    setIsCreateModalOpen(false);
    setTaskTitle("");
    setSelectedLeadId("");
  };

  const applyTemplate = (templateTitle: string, templateAction: "CALL" | "WHATSAPP" | "EMAIL" | "MEETING") => {
    setTaskTitle(templateTitle);
    setActionType(templateAction);
    setIsCreateModalOpen(true);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CALL":
        return <Phone className="w-3.5 h-3.5 text-blue-600" />;
      case "WHATSAPP":
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case "EMAIL":
        return <Mail className="w-3.5 h-3.5 text-indigo-600" />;
      case "MEETING":
        return <Users className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (p: FollowupPriority) => {
    switch (p) {
      case "HIGH":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" /> High
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Medium
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 text-gray-600 border border-gray-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="partner-followup-view">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#0F5132]" />
            Client Follow-up & Task Engine
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track lead contact milestones, challenge attendance check-ins, and high-value conversion consultations
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Follow-up
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">
              Pending Actions
            </div>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{pendingCount}</div>
            <div className="text-[11px] text-gray-400 mt-1">Requiring outreach or check-in</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">
              High Priority
            </div>
            <div className="text-2xl font-black text-rose-600 mt-0.5">{highPriorityCount}</div>
            <div className="text-[11px] text-gray-400 mt-1">Critical conversion opportunities</div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">
              Completed Tasks
            </div>
            <div className="text-2xl font-black text-[#0F5132] mt-0.5">{completedCount}</div>
            <div className="text-[11px] text-gray-400 mt-1">Successfully actioned referrals</div>
          </div>
          <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#0F5132]/20 text-[#0F5132]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Turnkey Action Quick Templates */}
      <div className="bg-gradient-to-r from-[#F8F9F8] to-[#FCFDFD] p-4 rounded-2xl border border-gray-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          Turnkey Follow-up Protocols (1-Click Schedule):
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              applyTemplate(
                "Welcome call: Introduce Path to Inner Peace & verify Challenge registration",
                "CALL"
              )
            }
            className="text-[11px] font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3 h-3 text-blue-600" />
            Day 1 Welcome Call
          </button>
          <button
            onClick={() =>
              applyTemplate(
                "Day 3 Challenge Check-in: Ask about meditation experience and breakthrough moments",
                "WHATSAPP"
              )
            }
            className="text-[11px] font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            Day 3 Challenge Check-in
          </button>
          <button
            onClick={() =>
              applyTemplate(
                "Challenge Completion: Offer exclusive alumni discount for Mind Mastery Program",
                "WHATSAPP"
              )
            }
            className="text-[11px] font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Post-Challenge Upgrade Offer
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === "PENDING"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === "COMPLETED"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All ({partnerTasks.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client or task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            />
          </div>
        </div>

        {/* Priority and Action Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Channel:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-xs"
            >
              <option value="ALL">All Channels</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="CALL">Phone Call</option>
              <option value="EMAIL">Email</option>
              <option value="MEETING">Consultation Meeting</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-400 space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-gray-300" />
            <div className="font-bold text-gray-700 text-sm">No follow-up tasks match this criteria</div>
            <p className="text-xs max-w-sm mx-auto text-gray-500">
              You are all caught up! Use "Schedule Follow-up" or pick a turnkey protocol above to keep your referrals engaged.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";
            const associatedLead = leads.find((l) => l.id === task.leadId);
            const clientPhone = associatedLead?.mobile?.replace(/[^0-9]/g, "") || "";

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? "bg-[#F8F9F8]/70 border-gray-200 opacity-75"
                    : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Complete checkbox button */}
                  <button
                    onClick={() => completeFollowup(task.id)}
                    disabled={isCompleted}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                      isCompleted
                        ? "bg-[#0F5132] border-[#0F5132] text-white"
                        : "border-gray-300 hover:border-[#0F5132] text-transparent"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                        {getActionIcon(task.actionType)}
                        {task.leadName}
                      </span>
                      {getPriorityBadge(task.priority)}
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" /> Due {task.dueDate}
                      </span>
                    </div>

                    <p
                      className={`text-xs ${
                        isCompleted ? "line-through text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {task.title}
                    </p>

                    {isCompleted && task.completedAt && (
                      <div className="text-[10px] text-emerald-700 font-medium">
                        ✓ Completed on {new Date(task.completedAt).toLocaleDateString("en-IN")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Quick WhatsApp Action if phone available */}
                  {clientPhone && !isCompleted && (
                    <a
                      href={`https://wa.me/${clientPhone}?text=${encodeURIComponent(
                        `Hi ${task.leadName}! Following up from Path to Inner Peace regarding your wellness journey.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  )}

                  {/* Phone Call Link */}
                  {clientPhone && !isCompleted && (
                    <a
                      href={`tel:${clientPhone}`}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                  )}

                  {!isCompleted && (
                    <button
                      onClick={() => completeFollowup(task.id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-xs transition cursor-pointer"
                    >
                      Done
                    </button>
                  )}

                  <button
                    onClick={() => deleteFollowup(task.id)}
                    className="p-1.5 text-gray-300 hover:text-rose-600 transition cursor-pointer rounded-lg hover:bg-rose-50"
                    title="Remove Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: SCHEDULE FOLLOW-UP */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#0F5132]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#0F5132]" />
                Schedule Lead Follow-up
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Client / Referral</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                >
                  <option value="">General Partner Follow-up</option>
                  {partnerLeads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.clientName} ({lead.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Follow-up Objective & Notes</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Check in on Day 2 practice and remind of live session"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Channel</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="CALL">Phone Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="MEETING">Consultation Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as FollowupPriority)}
                    className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  Schedule Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
