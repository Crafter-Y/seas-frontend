import { useState } from "react";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { formatDate } from "@/helpers/format";
import { requestApi } from "@/helpers/api";

export default function useCreateEvent() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulEventCreation, setIsSuccessfulEventCreation] =
    useState(false);
  const [singleDateCreated, setIsSingleDateCreated] = useState(false);

  const createEvent = async (
    createType: EventType,
    singleDate: CalendarDate,
    dayOfWeek: number,
    dayOfMonth: number,
    monthOfYear: number
  ) => {
    // clientside validation

    setIsSuccessfulEventCreation(false);
    setIsSingleDateCreated(false);

    if (createType == "UNSET") {
      setHasCreationError(true);
      setCreationError("Ein Typ muss ausgewählt werden");
      return;
    }

    // single event creation
    if (createType == "SINGLE") {
      if (!singleDate) {
        setHasCreationError(true);
        setCreationError("Ein Datum muss angegeben werden.");
        return;
      }

      let res = await requestApi("events/single", "POST", {
        date: formatDate(singleDate)
      })

      if (handleResponseErrors(res)) setIsSingleDateCreated(true);
    }

    if (createType == "WEEKLY") {
      if (!dayOfWeek || dayOfWeek == 0) {
        setHasCreationError(true);
        setCreationError("Ein Wochentag muss angegeben werden");
        return;
      }

      let res = await requestApi("events/weekly", "POST", {
        day: dayOfWeek
      })

      handleResponseErrors(res)
    }

    if (createType == "MONTHLY") {
      if (!dayOfMonth || dayOfMonth == 0) {
        setHasCreationError(true);
        setCreationError("Der Tag des Monats muss angegeben werden");
        return;
      }

      let res = await requestApi("events/monthly", "POST", {
        day: dayOfMonth
      })

      handleResponseErrors(res)
    }

    if (createType == "YEARLY") {
      if (!dayOfMonth || dayOfMonth == 0) {
        setHasCreationError(true);
        setCreationError("Der Tag des Monats muss angegeben werden");
        return;
      }
      if (!monthOfYear || monthOfYear == 0) {
        setHasCreationError(true);
        setCreationError("Der Monat muss angegeben werden");
        return;
      }

      let res = await requestApi("events/yearly", "POST", {
        day: dayOfMonth,
        month: monthOfYear
      })

      handleResponseErrors(res)
    }
  };

  const handleResponseErrors = (res: ApiResponse | null) => {
    if (res == null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return false;
    }

    if (!res.success) {
      setHasCreationError(true);
      setCreationError(res.data.error);
      return false;
    }

    setHasCreationError(false);
    setCreationError("");
    setIsSuccessfulEventCreation(true);
    return true
  }

  return {
    createEvent,
    hasCreationError,
    creationError,
    successfulEventCreation,
    singleDateCreated,
  };
}
