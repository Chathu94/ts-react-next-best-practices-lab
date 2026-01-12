export const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

export const scoreIncident = (summary?: string) => {
  if (!summary) return 0;
  return summary.split(" ").reduce((acc, word) => acc + word.length, 0);
};
