// format Javascript date to YYYY-MM-DD
export function formatDate(date: Date) {
  let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${year}-${month}-${day}`;
}

export function prettyDate(date: string, short: boolean) {
  let d = Date.parse(date);
  let weekday = new Intl.DateTimeFormat("de", { weekday: "long" }).format(d);
  let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  let month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
  let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

  if (short) {
    return `${weekday.substring(0, 2)}, ${day}.${month}.`;
  }
  return `${weekday}, ${day}.${month}.${year}`;
}
