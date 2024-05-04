import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useRedeemPasswordToken() {
  const [successfulRedeem, setSuccessfulRedeem] = useState(false);
  const [redeemError, setRedeemError] = useState("");

  const redeemToken = async (token: string, newPassword1: string, newPassword2: string) => {
    if (newPassword1 !== newPassword2) {
      setRedeemError("Die Passwörter stimmen nicht überein");
      return;
    }

    if (
      newPassword1 == null ||
      newPassword1.length == 0 ||
      newPassword2 == null ||
      newPassword2.length == 0
    ) {
      setRedeemError("Das Passwort muss angegeben und wiederholt werden");
      return;
    }

    if (!newPassword1.match(/^[\w\d\s\-äöüÄÖÜß_!?/*%$]{7,64}$/)) {
      setRedeemError(
        "Das Passwort stimmt nicht mit den Kriterien überein. Kriterium: Mindestens 7 Zeichen. Es sind Buchstaben, Zahlen und -_!?/*%$ erlaubt."
      );
      return;
    }

    const res = await requestApi(`users/redeemPasswordToken/${token}`, "POST", {
      password: newPassword1
    });

    if (!res?.success) {
      setSuccessfulRedeem(false);
      setRedeemError(res?.error);
      return;
    }

    setSuccessfulRedeem(true);
  };

  return { redeemToken, successfulRedeem, redeemError };
}
