import { useState } from "react";
import { getWebServer, requestApiWithoutCredentials } from "@/helpers/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function useResetPassword() {
  const [successfulRequest, setSuccessfulRequest] = useState(false);

  const resetPasswordRequest = async (email: string) => {
    setSuccessfulRequest(false);
    const serverId = await AsyncStorage.getItem("serverId");

    if (serverId == null) {
      router.back();
      return;
    }

    const res = await requestApiWithoutCredentials(
      "users/requestPasswordReset",
      "POST",
      {
        url: await getWebServer(),
        email: email,
        serverId: serverId,
      }
    );

    if (res.success) {
      setSuccessfulRequest(true);
    }
  };

  return { resetPasswordRequest, successfulRequest };
}
