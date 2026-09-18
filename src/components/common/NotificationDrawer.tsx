import React from "react";
import { useApp } from "../../context/AppContext";
import {
  X,
  Bell,
  CheckCheck,
  CheckCircle,
  AlertTriangle,
  Gift,
  Coins,
  ExternalLink,
} from "lucide-react";

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    currentRole,
    currentPartner,
  } = useApp();

  if (!isNotificationsOpen) return null;

  // Filter relevant notifications
  const userNotifications = notifications.filter((n) => {
    if (currentRole === "admin") return n.recipientRole === "admin" || !n.recipientPartnerId;
    return n.recipientRole === "partner" && (!n.recipientPartnerId || n.recipientPartnerId === currentPartner.id);
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "commission":
        return <Coins className="w-4 h-4 text-emerald-600" />;
      case "bonus":
        return <Gift className="w-4 h-4 text-[#D4AF37]" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[#0F5132]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#F8F9F8]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0F5132]" />
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132]">
              {userNotifications.filter((n) => !n.isRead).length} new
            </span>
          </div>

          <div className="flex items-center gap-2">
            {userNotifications.some((n) => !n.isRead) && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-[#0F5132] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No notifications right now.
            </div>
          ) : (
            userNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.linkTab) {
                    setActiveTab(notif.linkTab);
                    setIsNotificationsOpen(false);
                  }
                }}
                className={`p-3 rounded-xl border text-xs transition cursor-pointer ${
                  notif.isRead
                    ? "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
                    : "bg-[#E8F5E9]/40 border-[#0F5132]/20 hover:bg-[#E8F5E9]/70 text-gray-900 font-medium"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-xs border border-gray-100">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 truncate pr-2">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {new Date(notif.timestamp).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                      {notif.message}
                    </p>
                    {notif.linkTab && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#0F5132]">
                        <span>View details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
