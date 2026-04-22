"use client";

import { useState, useMemo } from "react";
import { Clock, Bell, Check, CheckCircle2, X } from "lucide-react";

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
}

/* -------------------- MOCK DATA -------------------- */
// Define this OUTSIDE the component or import it
const mockNotifications: Notification[] = [
  {
    id: "1",
    user: "Visal Phan",
    action: "requested your",
    item: "Winter Jacket - Size M",
    comment:
      "This jacket would be perfect for the cold season. Thank you for donating!",
    time: "Mar 31, 09:30 PM",
    status: "pending",
  },
  {
    id: "2",
    user: "Sophaline Hong",
    action: "requested your",
    item: "Kitchen Utensils Set",
    comment: "!!!",
    time: "Apr 2, 09:32 AM",
    status: "pending",
  },
  {
    id: "3",
    user: "You",
    action: "approved Sokha Meas's request for",
    item: "Wooden Bookshelf",
    time: "Apr 2, 09:34 AM",
    status: "approved",
  },
];

/* -------------------- COMPONENT -------------------- */
export default function NotificationsPage() {
  // Use the constant here - ensure mockNotifications is defined above
  const [notifications] = useState<Notification[]>(mockNotifications);

  const pendingRequests = useMemo(
    () => notifications.filter((n) => n.status === "pending"),
    [notifications],
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-1">
            Notifications
          </h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-500 text-sm font-medium">
              Manage donation requests and stay updated.
            </p>
            <span className="bg-red-100 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
              {notifications.length} unread
            </span>
          </div>
        </div>

        {/* Pending Requests Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-[#EAB308] w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-800">
              Pending Requests
            </h2>
            <span className="bg-[#FEF3C7] text-[#D97706] text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingRequests.length}
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests.map((notif) => (
              <div
                key={notif.id}
                className="bg-[#FFF9EE] border border-[#FDE68A]/30 rounded-3xl p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-300">
                      Img
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-gray-900">
                        {notif.user}
                      </span>{" "}
                      {notif.action}{" "}
                      <span className="font-bold text-gray-900">
                        "{notif.item}"
                      </span>
                    </p>
                    {notif.comment && (
                      <p className="text-xs text-gray-400 italic mt-1 font-medium">
                        "{notif.comment}"
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                      {notif.time}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                      <Check className="w-3 h-3" /> Approve
                    </button>
                    <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                      <X className="w-3 h-3" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Notifications Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="text-[#10B981] w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">
                All Notifications
              </h2>
            </div>
            <button className="text-[#10B981] text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Mark all read
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Icon logic based on status */}
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {notif.status === "approved" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-orange-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-700">
                      <span className="font-bold">{notif.user}</span>{" "}
                      {notif.action}{" "}
                      <span className="font-bold">"{notif.item}"</span>
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">
                      {notif.time}
                    </p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
