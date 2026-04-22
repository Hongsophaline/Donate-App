export type NotificationStatus = "pending" | "approved" | "rejected" | "info";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "REQUEST";
  status: NotificationStatus;
  createdAt: string;
  targetUserId?: string;
}
