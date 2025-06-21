// format Javascript date to YYYY-MM-DD
export function formatDate(date: Date) {
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
    date,
  );
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

export function toUpperStarting(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const weekdayMap = {
  1: "Montag",
  2: "Dienstag",
  3: "Mittwoch",
  4: "Donnerstag",
  5: "Freitag",
  6: "Samstag",
  7: "Sonntag",
};

const monthMap = {
  1: "Januar",
  2: "Februar",
  3: "März",
  4: "April",
  5: "Mai",
  6: "Juni",
  7: "Juli",
  8: "August",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Dezember",
};

export const formatEvent = (
  type: EventType,
  dayOfWeek: number,
  dayOfMonth: number,
  monthOfYear: number,
): string => {
  switch (type) {
    case "WEEKLY":
      return "Jede Woche " + weekdayMap[dayOfWeek as keyof typeof weekdayMap];
    case "MONTHLY":
      return "Jeden Monat am " + dayOfMonth + ".";
    case "YEARLY":
      return (
        "Jedes Jahr am " +
        dayOfMonth +
        ". " +
        monthMap[monthOfYear as keyof typeof monthMap]
      );
  }
  return "";
};
