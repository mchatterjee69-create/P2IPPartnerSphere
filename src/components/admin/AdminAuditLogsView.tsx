import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  AlertCircle,
  FileText,
  Lock,
} from "lucide-react";

export const AdminAuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = auditLogs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      l.entityId.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.reason?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in" id="admin-audit-logs-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F5132]" />
            Security Hardening & Audit Trail
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable system logs tracking partner attribution resolutions, commission approvals, bank batch disbursements, and clawbacks
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F9F8] border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600">
          <Lock className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>Tamper-Resistant Ledger</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit trail by action, entity ID, actor, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F5132]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F8] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Audit Details / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] font-bold text-[#0F5132] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#0F5132]/20">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {log.entityType}: <span className="font-mono text-gray-500">{log.entityId}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{log.actor}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{log.actorRole}</div>
                  </td>

                  <td className="py-3 px-4 text-gray-600 max-w-md">
                    {log.reason ? (
                      <span className="font-medium text-gray-800">{log.reason}</span>
                    ) : (
                      <span className="text-gray-400 italic">No notes provided</span>
                    )}

                    {log.oldValue && log.newValue && (
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {log.oldValue} → {log.newValue}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
