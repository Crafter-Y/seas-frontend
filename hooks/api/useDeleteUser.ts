import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useDeleteUser() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);
  const getApi = useApi();

  const deleteUser = (userId: number) => {
    setSuccessfulDeletion(false);

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("userId", userId + "");
      fetch(`${configServer}/api/v1/users/${userId}`, {
        method: "delete",
        headers: {
          'Authorization': "Bearer " + token,
          'Content-Type': 'application/json'
        }
      }).then(() => {
        setSuccessfulDeletion(true);
      });
    });
  };

  return { deleteUser, succesfulDeletion };
}
