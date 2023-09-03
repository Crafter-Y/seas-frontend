import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useRequestNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [successfulPasswordCreation, setSuccessfulPasswordCreation] =
    useState(false);

  const requestNewPassword = async (userId: number) => {
    let res = await requestApi(`users/${userId}`, "PATCH")
    if (res == null) return;

    if (res.success) {
      setSuccessfulPasswordCreation(true);
      setNewPassword(res.data.password);
    }
  };

  return { requestNewPassword, newPassword, successfulPasswordCreation };
}
