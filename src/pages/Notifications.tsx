"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Clock, Bell, CheckCircle2, Loader2, Check, X } from "lucide-react";
// Import the api and auth we created in the previous step
import { api, auth, type Notification } from "../lib/api"; 

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = auth.getUser();
  const userId = user?.id;

  /* -------------------- API CALLS -------------------- */

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await api.getNotifications(userId);
      // Ensure data is an array
      setNotifications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 1. Mark Single Notification as Read
  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // 2. Mark All as Read
  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await api.markAllNotificationsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  // 3. Handle Action (Approve/Reject)
  // This sends a notification BACK to the person who requested
  const handleRequestAction = async (notif: Notification, action: "approved" | "rejected") => {
    if (!userId) return;
    try {
      // In a real app, you'd call api.approveRequest(id) here.
      // But based on your request, we trigger a notification back:
      await api.sendNotification(userId, {
        role: "SYSTEM",
        type: action.toUpperCase(),
        title: `Donation ${action.toUpperCase()}`,
        message: `Your request for "${notif.title}" has been ${action}.`
      });
      
      // Mark the original notification as read/processed
      await handleMarkAsRead(notif.id);
      alert(`Request ${action} successfully!`);
    } catch (err) {
      alert("Failed to process action.");
    }
  };

  /* -------------------- COMPUTED -------------------- */
  
  const pendingRequests = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-1">Notifications</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-500 text-sm font-medium">Manage donation requests.</p>
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {pendingRequests.length} New
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Pending Requests Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-[#EAB308] w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-800">Pending Actions</h2>
          </div>

          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-8 text-center">
                <p className="text-sm text-gray-400">No new requests to show.</p>
              </div>
            ) : (
              pendingRequests.map((notif) => (
                <div key={notif.id} className="bg-[#FFF9EE] border border-[#FDE68A]/30 rounded-3xl p-5 shadow-sm">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-bold">{notif.title || "Donation Request"}</p>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Just now"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleRequestAction(notif, "approved")}
                        className="bg-[#10B981] hover:bg-[#059669] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button 
                         onClick={() => handleRequestAction(notif, "rejected")}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* All Notifications Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="text-[#10B981] w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">History</h2>
            </div>
            {notifications.some(n => !n.read) && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[#10B981] text-xs font-bold flex items-center gap-1 hover:underline transition-all"
              >
                <CheckCircle2 className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.length === 0 && !loading && (
              <p className="text-center text-gray-400 text-sm py-10">Notification history is empty.</p>
            )}
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${
                  notif.read ? "bg-white border-gray-100 opacity-70" : "bg-white border-[#10B981]/20 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.read ? "bg-gray-50" : "bg-[#F0FDF4]"}`}>
                    <Bell className={`w-5 h-5 ${notif.read ? "text-gray-300" : "text-[#10B981]"}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${notif.read ? "text-gray-500" : "text-gray-800 font-semibold"}`}>
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase mt-0.5 tracking-wider">
                       {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
                {!notif.read && (
                   <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="w-2.5 h-2.5 bg-[#10B981] rounded-full"
                    title="Mark as read"
                   />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}