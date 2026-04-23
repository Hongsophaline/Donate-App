import { useCallback, useEffect, useState } from "react";
import { api, type Notification } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export function useNotifications(pollMs = 20000) {
  const { user, isAuthed } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthed || !user?.id) return;
    setLoading(true);
    try {
      const data = await api.getNotifications(user.id);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthed, user?.id]);

  useEffect(() => {
    refresh();
    if (!isAuthed) return;
    const t = setInterval(refresh, pollMs);
    return () => clearInterval(t);
  }, [refresh, isAuthed, pollMs]);

  const unread = items.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try { 
      await api.markNotificationRead(id); 
    } catch (e) {
      console.error("Error marking read:", e);
    }
  };

  const markAll = async () => {
    if (!user?.id) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try { 
      await api.markAllNotificationsRead(user.id); 
    } catch (e) {
      console.error("Error marking all read:", e);
    }
  };

  return { items, unread, loading, refresh, markRead, markAll };
}