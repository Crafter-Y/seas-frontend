import { useState } from "react";
import { getWebServer, requestApi } from "@/helpers/api";

export default function useRequestNewPassword() {
  const [successfulPasswordCreation, setSuccessfulPasswordCreation] =
    useState(false);

  const requestNewPassword = async (userId: number) => {
    setSuccessfulPasswordCreation(false);
    const res = await requestApi(`users/password/${userId}`, "PATCH", {
      url: await getWebServer()
    });
    if (res == null) return;

    if (res.success) {
      setSuccessfulPasswordCreation(true);
    }
  };

  return { requestNewPassword, successfulPasswordCreation };
}
