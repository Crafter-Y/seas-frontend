import { useState } from "react";
import { requestApiWithoutCredentials } from "@/helpers/api";

export default function useRedeemPasswordToken() {
  const [successfulRedeem, setSuccessfulRedeem] = useState(false);
  const [redeemError, setRedeemError] = useState("");

  const redeemToken = async (
    token: string,
    newPassword1: string,
    newPassword2: string,
  ) => {
    newPassword1 = newPassword1.trim();
    newPassword2 = newPassword2.trim();

    if (newPassword1 !== newPassword2) {
      setRedeemError("Die Passwörter stimmen nicht überein");
      return;
    }

    if (
      newPassword1 === null ||
      newPassword1.length === 0 ||
      newPassword2 === null ||
      newPassword2.length === 0
    ) {
      setRedeemError("Das Passwort muss angegeben und wiederholt werden");
      return;
    }

    if (!newPassword1.match(/^[\w\d\-äöüÄÖÜß_!?/*%$]{7,64}$/)) {
      setRedeemError(
        "Das Passwort stimmt nicht mit den Kriterien überein. Kriterium: Mindestens 7 Zeichen. Es sind Buchstaben, Zahlen und -_!?/*%$ erlaubt.",
      );
      return;
    }

    const res = await requestApiWithoutCredentials(
      `users/redeemPasswordToken/${token}`,
      "POST",
      {
        password: newPassword1,
      },
    );

    if (!res?.success) {
      setSuccessfulRedeem(false);
      setRedeemError(res.data.error);
      return;
    }

    setSuccessfulRedeem(true);
  };

  return { redeemToken, successfulRedeem, redeemError };
}
