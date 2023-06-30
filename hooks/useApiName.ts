import Constants from "expo-constants";

export default function useApi() {
  const getApi = (): string => {
    if (__DEV__) {
      return Constants.expoConfig?.extra?.localApi;
    } else {
      return Constants.expoConfig?.extra?.productionApi;
    }
  };

  return getApi;
}
