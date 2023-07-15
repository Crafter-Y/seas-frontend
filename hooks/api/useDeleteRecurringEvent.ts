import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useDeleteRecurringEvent() {
  const [successfulDelete, setSuccessfulDelete] = useState(false);
  const getApi = useApi();

  const deleteRecurringEvent = (taskId: string) => {
    setSuccessfulDelete(false);
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("taskId", taskId);
      fetch(`${configServer}/api/deleteRecurringEvent/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) setSuccessfulDelete(true);
        });
    });
  };

  return { deleteRecurringEvent, successfulDelete };
}
