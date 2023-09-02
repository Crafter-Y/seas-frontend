import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useRequestNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [successfulPasswordCreation, setSuccessfulPasswordCreation] =
    useState(false);

  const getApi = useApi();

  const requestNewPassword = (userId: number) => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      fetch(`${configServer}/api/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
          'Authorization': "Bearer " + token,
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setSuccessfulPasswordCreation(true);
            setNewPassword(res.data.password);
          }
        });
    });
  };

  return { requestNewPassword, newPassword, successfulPasswordCreation };
}
