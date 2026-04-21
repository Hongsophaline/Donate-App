import type { Notification } from "../types/notification";

const BASE_URL = "https://material-donation-backend-4.onrender.com/api/v1/notifications";

export const fetchNotifications = async (userId: string, token: string): Promise<Notification[]> => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const sendNotificationAction = async (
  targetUserId: string,
  actionType: "approved" | "rejected",
  senderId: string,
  token: string
) => {
  const res = await fetch(`${BASE_URL}/send/${targetUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: `Update: Your request has been ${actionType}.`,
      type: actionType,
      senderId,
    }),
  });
  if (!res.ok) throw new Error(`Failed to ${actionType} request.`);
  return res.json();
};