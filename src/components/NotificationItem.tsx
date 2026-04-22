"use client";

import { useState, useMemo } from "react";
import { Clock, Bell, Check, CheckCircle2, X } from "lucide-react";
// Import your json file - adjust the path as needed
import en from "../locales/en.json";

/* -------------------- TYPES -------------------- */
type NotificationStatus = "pending" | "approved" | "rejected" | "info";

interface Notification {
  id: string;
  user: string;
  action: string;
  item: string;
  comment?: string;
  time: string;
  status: NotificationStatus;
  avatar?: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    user: "Visal Phan",
    action: "requested", // This will be handled by the JSON key
    item: "Winter Jacket - Size M",
    comment:
      "This jacket would be perfect for the cold season. Thank you for donating!",
    time: "Mar 31, 09:30 PM",
    status: "pending",
    isRead: false,
  },
  {
    id: "2",
    user: "Sophaline Hong",
    action: "requested",
    item: "Kitchen Utensils Set",
    comment: "!!!",
    time: "Apr 2, 09:32 AM",
    status: "pending",
    isRead: false,
  },
  {
    id: "3",
    user: "You",
    action: "approved",
    item: "Wooden Bookshelf",
    time: "Apr 2, 09:34 AM",
    status: "approved",
    isRead: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  // Shortcut for translations
  const t = en.notifications;

  const pendingRequests = useMemo(
    () => notifications.filter((n) => n.status === "pending"),
    [notifications],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const handleAction = (id: string, newStatus: NotificationStatus) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: newStatus, isRead: true } : n,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#111827] mb-1">{t.title}</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-500 text-sm font-medium">{t.subtitle}</p>
            {unreadCount > 0 && (
              <span className="bg-[#FEE2E2] text-[#EF4444] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                {/* Replace {{count}} manually or use i18n library */}
                {t.unreadCount.replace("{{count}}", unreadCount.toString())}
              </span>
            )}
          </div>
        </header>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-[#F59E0B] w-5 h-5" strokeWidth={2.5} />
              <h2 className="text-lg font-bold text-gray-800">
                {t.pendingTitle}
              </h2>
              <span className="bg-[#FEF3C7] text-[#D97706] text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingRequests.length}
              </span>
            </div>

            <div className="space-y-4">
              {pendingRequests.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-[#FFF9EE] border border-[#FDE68A]/40 rounded-[2rem] p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#E5E7EB] rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                      Img
                    </div>

                    <div className="flex-1">
                      <p className="text-[15px] leading-snug text-gray-600">
                        <span className="font-bold text-gray-900">
                          {notif.user}
                        </span>{" "}
                        {/* Translate the dynamic requested message */}
                        {t.requested.replace("{{item}}", notif.item)}
                      </p>
                      {notif.comment && (
                        <p className="text-sm text-gray-400 italic mt-1 font-medium">
                          "{notif.comment}"
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-2 font-semibold uppercase">
                        {notif.time}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[100px]">
                      <button
                        onClick={() => handleAction(notif.id, "approved")}
                        className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />{" "}
                        {t.approve}
                      </button>
                      <button
                        onClick={() => handleAction(notif.id, "rejected")}
                        className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={3} /> {t.reject}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Notifications Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bell className="text-[#10B981] w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">{t.allTitle}</h2>
            </div>
            <button className="text-[#10B981] hover:text-[#059669] text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t.markRead}
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                  notif.isRead
                    ? "bg-white border-gray-100"
                    : "bg-[#F0FDF4] border-[#DCFCE7]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-50">
                    {notif.status === "approved" ? (
                      <Check
                        className="w-4 h-4 text-[#10B981]"
                        strokeWidth={3}
                      />
                    ) : (
                      <Clock
                        className="w-4 h-4 text-[#F59E0B]"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-700">
                      <span className="font-bold text-gray-900">
                        {notif.user}
                      </span>{" "}
                      {t.requested.replace("{{item}}", notif.item)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                      {notif.time}
                    </p>
                  </div>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
