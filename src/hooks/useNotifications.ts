import { useEffect, useState } from "react";
import type { Notification } from "../types/notification"; // Ensure this type is defined correctly in your types file

const BASE_URL = "http://localhost:8080";

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token || !userId) {
      setError("Missing token or userId");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/v1/notifications/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();

      // ✅ Ensure correct shape
      setNotifications(data.data || []);
    } catch (err: any) {
      setError(err.message || "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return {
    notifications,
    loading,
    error,
    loadNotifications: fetchNotifications,
    setNotifications,
  };
};
