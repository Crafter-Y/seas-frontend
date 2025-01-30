import { useCallback, useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useAllRecurringEvents() {
  const [allRecurringEvents, setAllRecurringEvents] = useState<
    DisplayableRecurringEvent[]
  >([]);

  type DisplayableRecurringEvent = {
    id: number;
    eventType: "YEARLY" | "MONTHLY" | "WEEKLY";
    dayOfWeek?: number;
    dayOfMonth?: number;
    eventMonth?: number;
  };

  const queryRecurringEvents = useCallback(async () => {
    const res = await requestApi("events", "GET");

    if (res !== null && res.success) {
      const resData: APIRecurringEventsResponse = res.data;

      const allRecurringEvents: DisplayableRecurringEvent[] = [];

      resData.weeklyEvents.forEach((el) => {
        allRecurringEvents.push({
          id: el.id,
          eventType: "WEEKLY",
          dayOfWeek: el.day,
        });
      });

      resData.monthlyEvents.forEach((el) => {
        allRecurringEvents.push({
          id: el.id,
          eventType: "MONTHLY",
          dayOfMonth: el.day,
        });
      });

      resData.yearlyEvents.forEach((el) => {
        allRecurringEvents.push({
          id: el.id,
          eventType: "YEARLY",
          dayOfMonth: el.day,
          eventMonth: el.month,
        });
      });

      setAllRecurringEvents(allRecurringEvents);
    }
  }, []);

  useEffect(() => {
    queryRecurringEvents();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allRecurringEvents, queryRecurringEvents };
}
