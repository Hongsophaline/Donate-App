import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8080/api/v1/notifications";

const getAuthHeaders = () => {
  const token = Cookies.get("token");

  return {
    Authorization: `Bearer ${token}`,
    Accept: "*/*",
  };
};

// 🔔 unread count
export const getUnreadCount = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/${userId}/unread-count`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed unread count");
  return res.json();
};

// 📩 all notifications
export const getNotifications = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed notifications");
  return res.json();
};
