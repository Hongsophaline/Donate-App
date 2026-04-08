import { Bell, Check, X } from "lucide-react";
import type { Notification } from "../types/notification";
import { formatTime } from "../utils/formatDate";

interface NotificationItemProps {
  notification: Notification;
  onAction: (notificationId: string, targetUserId: string, actionType: "approved" | "rejected") => void;
  processingId: string | null;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onAction, processingId }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
        <Bell className="text-green-500" size={20} />
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
          {formatTime(notification.createdAt)}
        </p>
      </div>
      {notification.type === "request" && (
        <div className="flex gap-2">
          <button
            onClick={() => onAction(notification.id, notification.senderId, "approved")}
            className={`bg-[#2DBB74] text-white p-2 rounded-lg hover:bg-[#259e62] transition ${processingId === notification.id ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={processingId === notification.id}
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => onAction(notification.id, notification.senderId, "rejected")}
            className={`bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition ${processingId === notification.id ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={processingId === notification.id}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;