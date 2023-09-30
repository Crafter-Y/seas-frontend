// format Javascript date to YYYY-MM-DD
export function formatDate(date: Date) {
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${year}-${month}-${day}`;
}

export function prettyDate(date: string, short: boolean) {
  const d = Date.parse(date);
  const weekday = new Intl.DateTimeFormat("de", { weekday: "long" }).format(d);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

  if (short) {
    return `${weekday.substring(0, 2)}, ${day}.${month}.`;
  }
  return `${weekday}, ${day}.${month}.${year}`;
}
