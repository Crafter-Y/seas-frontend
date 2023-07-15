import { useEffect, useState } from "react";
import useApi from "../useApiName";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAllRecurringEvents() {
  const [allRecurringEvents, setAllRecurringEvents] = useState<
    APIResponseRecurringEvent[]
  >([]);

  const getApi = useApi();

  const queryRecurringEvents = (): void => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      fetch(`${configServer}/api/getAllRecurringEvents/`, {
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setAllRecurringEvents(res.data);
          }
        })
        .catch(() => {});
    });
  };

  useEffect(() => {
    queryRecurringEvents();
  }, []);

  return { allRecurringEvents, queryRecurringEvents };
}
