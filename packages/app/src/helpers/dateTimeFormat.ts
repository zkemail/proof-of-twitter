export function formatDateTime(unixTimestamp: string): string {
  const date = new Date(Number(unixTimestamp));
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}
