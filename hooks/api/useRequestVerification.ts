import { useState } from "react";
import { getWebServer, requestApi } from "@/helpers/api";

export default function useRequestVerification() {
  const [verificationSent, setVerificationSent] = useState(false);

  const requestVerification = async (userId: number) => {
    setVerificationSent(false);
    await requestApi(`users/requestVerification/${userId}`, "POST", {
      url: await getWebServer()
    });
    setVerificationSent(true);
  };

  return { requestVerification, verificationSent };
}
