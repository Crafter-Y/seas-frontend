import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChangePasswordScreenProps } from "../screens/ChangePasswordScreen";
import useApi from "./useApi";

export default function useUpdatePassword() {
  const [hasUpdateError, setHasUpdateError] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const getApi = useApi();

  const updatePassword = (
    oldPassword: string,
    newPassword1: string,
    newPassword2: string,
    navigation: ChangePasswordScreenProps
  ) => {
    if (newPassword1 !== newPassword2) {
      setHasUpdateError(true);
      setUpdateError("Die neuen Passwörter stimmen nicht überein");
      return;
    }

    if (oldPassword == null || oldPassword.length == 0) {
      setHasUpdateError(true);
      setUpdateError("Das alte Passwort muss angegeben werden");
      return;
    }

    if (
      newPassword1 == null ||
      newPassword1.length == 0 ||
      newPassword2 == null ||
      newPassword2.length == 0
    ) {
      setHasUpdateError(true);
      setUpdateError("Das neue Passwort muss angegeben und wiederholt werden");
      return;
    }

    if (!newPassword1.match(/^[\w\d\s\-äöüÄÖÜß_!?\/*%$]{7,64}$/)) {
      setHasUpdateError(true);
      setUpdateError(
        "Das neue Passwort stimmt nicht mit den Kriterien überein. Kriterium: Mindestens 7 Zeichen. Es sind Buchstaben, Zahlen und -_!?/*%$ erlaubt."
      );
      return;
    }

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let req = new FormData();
      req.append("oldPassword", oldPassword);
      req.append("newPassword", newPassword1);
      fetch(`${configServer}/api/changePassword/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            navigation.replace("LoginScreen");
            setHasUpdateError(false);
            setUpdateError("");
          } else {
            setHasUpdateError(true);
            setUpdateError(res.error.message);
          }
        })
        .catch(() => {
          setHasUpdateError(true);
          setUpdateError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
        });
    });
  };

  return { updatePassword, hasUpdateError, updateError };
}
