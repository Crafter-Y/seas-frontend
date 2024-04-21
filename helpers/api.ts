import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import decode from "jwt-decode";
import { Store } from "./store";

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

      const tokenContents: {
        productId: number,
        userId: number,
        email: string,
        firstname: string,
        lastname: string,
        role: Role,
        exp: number
      } = decode(token);

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

    return response;
  } catch (e) {
    console.log(e);
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