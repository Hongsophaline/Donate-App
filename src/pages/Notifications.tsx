"use client";

import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import NotificationItem from "../components/NotificationItem";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { sendNotificationAction } from "../api/notifications";

interface NotificationsPageProps {
  userId: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userId }) => {
  const { notifications, loading, error, loadNotifications, setNotifications } = useNotifications(userId);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (notificationId: string, targetUserId: string, actionType: "approved" | "rejected") => {
    const token = localStorage.getItem("token") || "";
    if (!token) return alert("Token not found");

    try {
      setProcessingId(notificationId);
      await sendNotificationAction(targetUserId, actionType, userId, token);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      alert(`Request ${actionType} successfully`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to process action");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={loadNotifications} />;

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
              {notifications.length} Active
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center bg-white border border-dashed border-gray-300 rounded-2xl py-12">
              <p className="text-gray-400 italic">No new notifications.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onAction={handleAction}
                processingId={processingId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;