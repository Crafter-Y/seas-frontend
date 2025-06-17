import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { router } from "expo-router";

import { Store } from "@/helpers/store";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

const getApi = async (): Promise<string> => {
  if (__DEV__) {
    let devUrl = await AsyncStorage.getItem("devServerURL");
    if (devUrl !== null && devUrl !== undefined) {
      return devUrl;
    } else {
      console.error("No dev URL set, using production API");
    }
  }
  return Constants.expoConfig?.extra?.productionApi;
};

// used to determine which webserver shall be used for clickable email links
export const getWebServer = async () => {
  if (__DEV__) {
    return "http://localhost:8081";
  } else {
    try {
      const serverId = await AsyncStorage.getItem("serverId");
      if (serverId === null) return "https://58119.seas-kirchengemeinde.de";

      return `https://${serverId}.seas-kirchengemeinde.de`;
    } catch (_ignored) {
      return "https://58119.seas-kirchengemeinde.de";
    }
  }
};

const requestApi = async (
  endpoint: string,
  method: RequestMethod,
  body: object | undefined = undefined,
): Promise<ApiResponse | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token === null) return null;

    const rawResponse = await fetch(`${await getApi()}/api/v1/${endpoint}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    const response: ApiResponse = await rawResponse.json();

    if (
      response.data.error &&
      (response.data.error === "Authentication required" ||
        response.data.error === "Authentication failed" ||
        response.data.error === "The user does not exist" ||
        response.data.error === "Your password has changed")
    ) {
      Store.update((state) => {
        state.user = null;
      });
      await AsyncStorage.removeItem("token");
      router.replace("/login");
    }

    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const requestApiWithoutCredentials = async (
  endpoint: string,
  method: RequestMethod,
  body: object | undefined = undefined,
): Promise<ApiResponse> => {
  const rawResponse = await fetch(`${await getApi()}/api/v1/${endpoint}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response: ApiResponse = await rawResponse.json();

  return response;
};

export { requestApi, requestApiWithoutCredentials };
