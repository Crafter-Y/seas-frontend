import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useRequestNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [successfulPasswordCreation, setSuccessfulPasswordCreation] =
    useState(false);

  const getApi = useApi();

  const requestNewPassword = (userId: string) => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("userId", userId);
      fetch(`${configServer}/api/newUserPassword/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setSuccessfulPasswordCreation(true);
            setNewPassword(res.data.newPassword);
          }
        });
    });
  };

  return { requestNewPassword, newPassword, successfulPasswordCreation };
}
