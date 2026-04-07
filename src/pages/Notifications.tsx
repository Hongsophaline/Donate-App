import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Clock, Bell, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  senderId: string;
  createdAt: string;
  type?: string;
}

interface NotificationsPageProps {
  userId: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://material-donation-backend-4.onrender.com/api/v1/notifications";

  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Adding a timeout check (Render can be slow)
      const response = await fetch(`${BASE_URL}/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("API Success:", data); // Check your console!
      setNotifications(Array.isArray(data) ? data : []); 
      
    } catch (err) {
      console.error("API Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const handleAction = async (targetUserId: string, actionType: string) => {
    try {
      const response = await fetch(`${BASE_URL}/send/${targetUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Your request was ${actionType}`,
          type: actionType,
          senderId: userId
        }),
      });
      if (response.ok) {
        alert(`Notification sent: ${actionType}`);
      }
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  // 1. LOADING STATE
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#2DBB74]" size={40} />
      <p className="text-gray-500 animate-pulse font-medium">Waking up server...</p>
    </div>
  );

  // 2. ERROR STATE (Prevents infinite loading)
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AlertCircle className="text-red-500 mb-2" size={48} />
      <h2 className="text-xl font-bold text-gray-800">Connection Error</h2>
      <p className="text-gray-500 text-center mb-6">{error}</p>
      <button 
        onClick={fetchNotifications}
        className="flex items-center gap-2 bg-[#2DBB74] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#259e62] transition"
      >
        <RefreshCw size={18} /> Retry Connection
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">{t("notifications.title")}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-red-100 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              {notifications.length} {t("notifications.unreadCount")}
            </span>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="text-orange-500" size={18} />
            <h2 className="font-bold text-gray-800">{t("notifications.pendingTitle")}</h2>
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center bg-white border border-dashed border-gray-300 rounded-2xl py-12">
                <p className="text-gray-400 italic">No notifications found for this user.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell className="text-gray-400" />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Just now"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(notif.senderId, "approved")}
                      className="bg-[#2DBB74] text-white p-2 rounded-lg hover:bg-[#259e62]"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => handleAction(notif.senderId, "rejected")}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;