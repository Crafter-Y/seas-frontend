import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestApiWithoutCredentials } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useServerName() {
  const name = Store.useState(state => state.serverName);
  const [fetchSuccessful, setFetchSuccessful] = useState(false);
  const [fetchServerError, setFetchServerError] = useState<string | null>(null);

  useEffect(() => {
    if (name == null) fetchServerName();
  }, []);

  const fetchServerName = async () => {
    setFetchSuccessful(false);
    setFetchServerError(null);

    const serverId = await AsyncStorage.getItem("serverId");
    if (serverId == null) return;

    try {
      const res = await requestApiWithoutCredentials(`products/${serverId}`, "GET");

      if (res.success) {
        Store.update(state => { state.serverName = res.data.name; });
        setFetchSuccessful(true);
      } else {
        setFetchServerError(res.data.error);
        setFetchSuccessful(false);
      }
    } catch (e) {
      setFetchServerError(e + "");
      setFetchSuccessful(false);
    }
  };

  return {
    fetchServerName,
    serverName: name,
    fetchSuccessful,
    fetchServerError
  };
}
