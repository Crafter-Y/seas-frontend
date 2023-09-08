import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useAllRecurringEvents() {
  const [allRecurringEvents, setAllRecurringEvents] = useState<DisplayableRecurringEvent[]>([]);

  type DisplayableRecurringEvent = {
    id: number,
    eventType: "YEARLY" | "MONTHLY" | "WEEKLY",
    dayOfWeek?: number,
    dayOfMonth?: number,
    eventMonth?: number
  }

  const queryRecurringEvents = async () => {
    let res = await requestApi("events", "GET");

    if (res != null && res.success) {
      let resData: APIRecurringEventsResponse = res.data;

      let allRecurringEvents: DisplayableRecurringEvent[] = []

      resData.weeklyEvents.forEach(el => {
        allRecurringEvents.push({
          id: el.id,
          eventType: "WEEKLY",
          dayOfWeek: el.day
        })
      })

      resData.monthlyEvents.forEach(el => {
        allRecurringEvents.push({
          id: el.id,
          eventType: "MONTHLY",
          dayOfMonth: el.day
        })
      })

      resData.yearlyEvents.forEach(el => {
        allRecurringEvents.push({
          id: el.id,
          eventType: "YEARLY",
          dayOfMonth: el.day,
          eventMonth: el.month
        })
      })

      setAllRecurringEvents(allRecurringEvents);
    }
  };

  useEffect(() => {
    queryRecurringEvents();
  }, []);

  return { allRecurringEvents, queryRecurringEvents };
}
