export const formatTime = (dateStr: string) => {
  if (!dateStr) return "Recent";
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};