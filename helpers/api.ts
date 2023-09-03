import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"

const getApi = (): string => {
    if (__DEV__) {
        return Constants.expoConfig?.extra?.localApi;
    } else {
        return Constants.expoConfig?.extra?.productionApi;
    }
};

const requestApi = async (endpoint: string, method: RequestMethod, body: object | undefined = undefined): Promise<ApiResponse | null> => {
    try {
        let token = await AsyncStorage.getItem("token")
        if (token == null) return null;

        let rawResponse = await fetch(`${getApi()}/api/v1/${endpoint}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Authorization': "Bearer " + token,
                'Content-Type': 'application/json'
            }
        })
        let response: ApiResponse = await rawResponse.json()

        return response;
    } catch (e) {
        console.log(e)
        return null;
    }
}

const requestApiWithoutCredentials = async (endpoint: string, method: RequestMethod, body: object | undefined = undefined): Promise<ApiResponse | null> => {
    try {
        let rawResponse = await fetch(`${getApi()}/api/v1/${endpoint}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let response: ApiResponse = await rawResponse.json()

        return response;
    } catch (e) {
        console.log(e)
        return null;
    }
}

export { getApi, requestApi, requestApiWithoutCredentials }