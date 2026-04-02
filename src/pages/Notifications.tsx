import React from "react";
import { useTranslation } from "react-i18next"; // 1. Import hook
import {
  Check,
  X,
  Clock,
  Bell,
  CheckCircle2,
  Package,
  Info,
} from "lucide-react";

const NotificationsPage = () => {
  const { t } = useTranslation(); // 2. Initialize translation

  // Mock data - In a real app, 'item' and 'user' would be variables passed to the translation
  const pendingRequests = [
    {
      id: 1,
      user: "Visal Phan",
      item: "Winter Jacket - Size M",
      message:
        "This jacket would be perfect for the cold season. Thank you for donating!",
      time: "Mar 31, 09:30 PM",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      user: "Sophaline Hong",
      item: "Kitchen Utensils Set",
      message: "!!!",
      time: "Apr 2, 09:32 AM",
      image:
        "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=100&h=100&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("notifications.title")}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-gray-500 text-sm font-medium">
              {t("notifications.subtitle")}
            </p>
            <span className="bg-red-100 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
              {t("notifications.unreadCount", { count: 4 })}
            </span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="text-orange-500" size={18} />
            <h2 className="font-bold text-gray-800 tracking-tight">
              {t("notifications.pendingTitle")}
            </h2>
            <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
              2
            </span>
          </div>

          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#FFFBF5] border border-orange-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 shadow-sm"
              >
                <img
                  src={req.image}
                  alt="item"
                  className="w-20 h-20 rounded-2xl object-cover border border-orange-50"
                />
                <div className="flex-grow text-center sm:text-left">
                  <p className="text-sm text-gray-800 leading-tight">
                    <span className="font-bold">{req.user}</span>{" "}
                    {t("notifications.requested", { item: req.item })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 italic">
                    "{req.message}"
                  </p>
                  <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-wider">
                    {req.time}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#2DBB74] hover:bg-[#259e62] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition">
                    <Check size={14} /> {t("notifications.approve")}
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#EF4444] hover:bg-[#dc2626] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition">
                    <X size={14} /> {t("notifications.reject")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Notifications List */}
        <div>
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <Bell className="text-[#2DBB74]" size={18} />
              <h2 className="font-bold text-gray-800 tracking-tight">
                {t("notifications.allTitle")}
              </h2>
            </div>
            <button className="text-[11px] text-[#2DBB74] font-bold flex items-center gap-1 hover:opacity-80 transition">
              <Check size={12} strokeWidth={3} /> {t("notifications.markRead")}
            </button>
          </div>

          {/* ... (History list remains similar, using translated strings for static text) */}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
