import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { ManageEventsScreenProps } from "@/screens/settings/ManageEventsScreen";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { formatDate } from "@/helpers/format";

export default function useCreateEvent() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulEventCreation, setIsSuccessfulEventCreation] =
    useState(false);
  const [singleDateCreated, setIsSingleDateCreated] = useState(false);

  const getApi = useApi();

  const createEvent = (
    navigation: ManageEventsScreenProps,
    createType: EventType,
    singleDate: CalendarDate,
    dayOfWeek: Weekday,
    dayOfMonth: string,
    monthOfYear: Month
  ) => {
    // clientside validation

    setIsSuccessfulEventCreation(false);
    setIsSingleDateCreated(false);

    if (createType == "UNSET") {
      setHasCreationError(true);
      setCreationError("Ein Typ muss ausgewählt werden");
      return;
    }

    let configServer = getApi();

    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      // single event creation
      if (createType == "SINGLE") {
        if (!singleDate) {
          setHasCreationError(true);
          setCreationError("Ein Datum muss angegeben werden.");
          return;
        }

        let req = new FormData();
        req.append("date", formatDate(singleDate));
        fetch(`${configServer}/api/createSingleEvent/`, {
          method: "post",
          body: req,
          headers: {
            token,
          },
        })
          .then((response) => response.json())
          .then((res: ApiResponse) => {
            if (res.success) {
              setHasCreationError(false);
              setCreationError("");
              setIsSuccessfulEventCreation(true);
              setIsSingleDateCreated(true);
            } else {
              setHasCreationError(true);
              setCreationError(res.error.message);
            }
          })
          .catch(() => {
            setHasCreationError(true);
            setCreationError(
              "Server nicht verfügbar. Bitte später erneut versuchen."
            );
          });
      }

      // recurring event
      if (createType == "WEEKLY") {
        if (!dayOfWeek) {
          setHasCreationError(true);
          setCreationError("Ein Wochentag muss angegeben werden");
          return;
        }
      }

      if (createType == "MONTHLY") {
        if (!dayOfMonth) {
          setHasCreationError(true);
          setCreationError("Der Tag des Monats muss angegeben werden");
          return;
        }
      }

      if (createType == "YEARLY") {
        if (!dayOfMonth) {
          setHasCreationError(true);
          setCreationError("Der Tag des Monats muss angegeben werden");
          return;
        }
        if (!monthOfYear) {
          setHasCreationError(true);
          setCreationError("Der Monat muss angegeben werden");
          return;
        }
      }

      let req = new FormData();
      req.append("createType", createType);
      req.append("dayOfWeek", dayOfWeek);
      req.append("dayOfMonth", dayOfMonth);
      req.append("monthOfYear", monthOfYear);
      fetch(`${configServer}/api/createRecurringEvent/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setHasCreationError(false);
            setCreationError("");
            setIsSuccessfulEventCreation(true);
          } else {
            setHasCreationError(true);
            setCreationError(res.error.message);
          }
        })
        .catch(() => {
          setHasCreationError(true);
          setCreationError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
        });
    });
  };

  return {
    createEvent,
    hasCreationError,
    creationError,
    successfulEventCreation,
    singleDateCreated,
  };
}
