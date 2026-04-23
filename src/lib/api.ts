// Get the Base URL from environment variables
// Make sure your .env has VITE_API_URL=http://localhost:8080
export const API_BASE = import.meta.env.VITE_API_URL || "https://material-donation-backend-4.onrender.com";

const TOKEN_KEY = "donate_token";
const USER_KEY = "donate_user";

// --- Types ---

export type AppUser = {
  id?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  userType?: string;
};

export type Notification = {
  id: string;
  recipientType?: string;
  type?: string;
  title?: string;
  message?: string;
  createdAt?: string;
  read?: boolean;
};

// --- Auth Helpers ---

export const auth = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event("auth-change"));
  },
  getUser(): AppUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser(user: AppUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth-change"));
  },
};

// --- Base Fetcher (Crucial Fix for 403 Forbidden) ---

async function apiFetch<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = auth.getToken();
  const headers = new Headers(init.headers || {});

  // Set Content-Type only if not sending FormData
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach Token - This solves the 403 Forbidden error
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!response.ok) {
    // Attempt to parse error message from backend
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  // Return json for 200 OK, or null if response is empty
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

// --- API Endpoints ---

export const api = {
  // Notifications
  getNotifications: (userId: string) =>
    apiFetch<Notification[]>(`/api/v1/notifications/user/${userId}`),

  markNotificationRead: (id: string) =>
    apiFetch(`/api/v1/notifications/${id}/read`, { 
      method: "PATCH" 
    }),

  markAllNotificationsRead: (userId: string) =>
    apiFetch(`/api/v1/notifications/user/${userId}/read-all`, {
      method: "PATCH",
    }),

  /**
   * Action trigger for notifications
   * Based on your manual code: POST to /send/{userId}
   */
  sendNotification: (
    userId: string,
    params: { role: string; type: string; title: string; message: string }
  ) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/v1/notifications/send/${userId}?${qs}`, {
      method: "POST",
    });
  },

  // Auth Endpoints
  login: (phone: string, password: string) =>
    apiFetch<{ token: string; user?: AppUser }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    }),
};