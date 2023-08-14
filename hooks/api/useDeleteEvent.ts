import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useDeleteEvent() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);
  const getApi = useApi();

  const deleteEvent = (date: string) => {
    setSuccessfulDeletion(false);
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("date", date);
      fetch(`${configServer}/api/deleteEvent/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      }).then(() => {
        setSuccessfulDeletion(true);
      });
    });
  };

  return { deleteEvent, succesfulDeletion };
}
