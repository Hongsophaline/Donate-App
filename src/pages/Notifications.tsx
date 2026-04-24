"use client";

import { useEffect, useState, useMemo } from "react";
import { Clock, Bell, Check, CheckCircle2, X } from "lucide-react";
import Cookies from "js-cookie";
import { getNotifications } from "./service/notificationService";

type NotificationStatus = "pending" | "approved" | "rejected" | "info";

interface Notification {
  id: string;
  user: string;
  action: string;
  item: string;
  comment?: string;
  time: string;
  status: NotificationStatus;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");

      if (!token || !userId) return;

      try {
        const data = await getNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const pendingRequests = useMemo(
    () => notifications.filter((n) => n.status === "pending"),
    [notifications],
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 text-sm">
            Manage donation requests and updates
          </p>
        </div>

        {/* Pending */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-yellow-500" />
            <h2 className="font-bold">Pending Requests</h2>
            <span className="bg-yellow-100 text-yellow-600 px-2 text-xs rounded">
              {pendingRequests.length}
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests.map((n) => (
              <div key={n.id} className="p-4 bg-yellow-50 rounded-xl">
                <p>
                  <b>{n.user}</b> {n.action} <b>{n.item}</b>
                </p>

                {n.comment && (
                  <p className="text-sm text-gray-500">{n.comment}</p>
                )}

                <p className="text-xs text-gray-400">{n.time}</p>

                <div className="flex gap-2 mt-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All */}
        <section>
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell />
              <h2 className="font-bold">All Notifications</h2>
            </div>
          </div>

          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-green-50 flex justify-between rounded"
              >
                <div>
                  <p className="text-sm">
                    <b>{n.user}</b> {n.action} <b>{n.item}</b>
                  </p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>

                <div>
                  {n.status === "approved" ? (
                    <Check className="text-green-500" />
                  ) : (
                    <Clock className="text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
