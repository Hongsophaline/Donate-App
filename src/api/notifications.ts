const BASE_URL = "http://localhost:8080";

export const sendNotificationAction = async (
  targetUserId: string,
  actionType: "approved" | "rejected",
  userId: string,
  token: string,
) => {
  const res = await fetch(`${BASE_URL}/api/v1/notifications/action`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      targetUserId,
      actionType,
      userId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update notification");
  }

  return res.json();
};
