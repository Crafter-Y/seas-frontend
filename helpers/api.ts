import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import decode, { InvalidTokenError } from "jwt-decode";
import { Store } from "./store";
import { router } from "expo-router";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"

const getApi = (): string => {
  if (__DEV__) {
    return Store.getRawState().serverDevUrl;
  } else {
    return Constants.expoConfig?.extra?.productionApi;
  }
};

// used to determine which webserver shall be used for clickable email links
export const getWebServer = async () => {
  if (__DEV__) {
    return "http://localhost:8081";
  } else {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token == null) return "https://58119.seas-kirchengemeinde.de";

      let tokenContents: {
        productId: number,
        userId: number,
        email: string,
        firstname: string,
        lastname: string,
        role: Role,
        exp: number
      };

      try {
        tokenContents = decode(token);
      } catch (error) {
        const er = error as InvalidTokenError;
        console.error(er.message);
        await AsyncStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      return `https://${tokenContents.productId}.seas-kirchengemeinde.de`;
    } catch (e) {
      return "https://58119.seas-kirchengemeinde.de";
    }

  }
};

const requestApi = async (endpoint: string, method: RequestMethod, body: object | undefined = undefined): Promise<ApiResponse | null> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token == null) return null;

    const rawResponse = await fetch(`${getApi()}/api/v1/${endpoint}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    const response: ApiResponse = await rawResponse.json();

    if (response.data.error && (
      response.data.error === "Authentication required" ||
      response.data.error === "Authentication failed" ||
      response.data.error === "The user does not exist" ||
      response.data.error === "Your password has changed"
    )) {
      Store.update(state => {
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

const requestApiWithoutCredentials = async (endpoint: string, method: RequestMethod, body: object | undefined = undefined): Promise<ApiResponse> => {
  const rawResponse = await fetch(`${getApi()}/api/v1/${endpoint}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json"
    }
  });
  const response: ApiResponse = await rawResponse.json();

  return response;
};

export { getApi, requestApi, requestApiWithoutCredentials };