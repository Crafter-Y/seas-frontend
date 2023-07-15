import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useDeleteColumn() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);
  const getApi = useApi();

  const deleteColumn = (columnId: string) => {
    setSuccessfulDeletion(false);
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("columnId", columnId);
      fetch(`${configServer}/api/deleteColumn/`, {
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

  return { deleteColumn, succesfulDeletion };
}
