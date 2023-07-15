import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useDeleteUser() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);
  const getApi = useApi();

  const deleteUser = (userId: string) => {
    setSuccessfulDeletion(false);

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("userId", userId);
      fetch(`${configServer}/api/deleteUser/`, {
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

  return { deleteUser, succesfulDeletion };
}
