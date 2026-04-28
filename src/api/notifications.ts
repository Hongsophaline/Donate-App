// import type { Notification } from "../types/notification";

// const BASE_URL = "https://material-donation-backend-4.onrender.com/api/v1/notifications";

// export const fetchNotifications = async (userId: string, token: string): Promise<Notification[]> => {
//   const res = await fetch(`${BASE_URL}/user/${userId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error(`Server error: ${res.status}`);
//   const data = await res.json();
//   return Array.isArray(data) ? data : [];
// };

// export const sendNotificationAction = async (
//   targetUserId: string,
//   actionType: "approved" | "rejected",
//   senderId: string,
//   token: string
// ) => {
//   const res = await fetch(`${BASE_URL}/send/${targetUserId}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       message: `Update: Your request has been ${actionType}.`,
//       type: actionType,
//       senderId,
//     }),
//   });
//   if (!res.ok) throw new Error(`Failed to ${actionType} request.`);
//   return res.json();
// };
const BASE_URL = import.meta.env.VITE_API_URL;

// GET: Fetch all notifications for a user
export const fetchUserNotifications = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/notifications/user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
};

// PATCH: Mark a single notification as read
export const markAsRead = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/notifications/${id}/read`, {
    method: "PATCH",
  });
  return response.json();
};

// PATCH: Mark all notifications as read
export const markAllRead = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/notifications/user/${userId}/read-all`, {
    method: "PATCH",
  });
  return response.json();
};

// POST: Send/Action a notification
export const sendNotificationAction = async (targetUserId: string, actionType: string, senderId: string, token: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/notifications/send/${targetUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ actionType, senderId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to process action");
  }
  return response.json();
};