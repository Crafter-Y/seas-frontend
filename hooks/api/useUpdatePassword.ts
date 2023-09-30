import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestApi } from "@/helpers/api";
import { Router } from "expo-router/src/types";

export default function useUpdatePassword() {
  const [hasUpdateError, setHasUpdateError] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const updatePassword = async (
    oldPassword: string,
    newPassword1: string,
    newPassword2: string,
    router: Router
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

    if (!newPassword1.match(/^[\w\d\s\-äöüÄÖÜß_!?/*%$]{7,64}$/)) {
      setHasUpdateError(true);
      setUpdateError(
        "Das neue Passwort stimmt nicht mit den Kriterien überein. Kriterium: Mindestens 7 Zeichen. Es sind Buchstaben, Zahlen und -_!?/*%$ erlaubt."
      );
      return;
    }

    const res = await requestApi("users", "PATCH", {
      oldPassword,
      newPassword: newPassword1
    });

    if (res == null) {
      setHasUpdateError(true);
      setUpdateError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    if (res.success) {
      setHasUpdateError(false);
      setUpdateError("");

      await AsyncStorage.removeItem("token");
      router.replace("/login");
    } else {
      setHasUpdateError(true);
      setUpdateError(res.data.error);
    }
  };

  return { updatePassword, hasUpdateError, updateError };
}
