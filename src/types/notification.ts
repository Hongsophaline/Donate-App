export interface Notification {
  id: string;
  message: string;
  senderId: string;
  createdAt: string;
  type?: "request" | "approval" | "rejection" | string;
}