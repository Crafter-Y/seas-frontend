import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestApiWithoutCredentials } from "@/helpers/api";
import { Store } from "@/helpers/store";
import { FetchState } from "@/helpers/Constants";

export default function useServerName() {
  const serverName = Store.useState(state => state.serverName);
  const fetchState = Store.useState(state => state.serverNameState);
  const [fetchServerError, setFetchServerError] = useState<string | null>(null);

  const fetchServerName = async () => {
    Store.update(state => { state.serverNameState = FetchState.FETCHING; });

    setFetchServerError(null);

    const serverId = await AsyncStorage.getItem("serverId");
    if (serverId == null) {
      Store.update(state => { state.serverNameState = FetchState.UNFETCHED; });
      return;
    }

    try {
      const res = await requestApiWithoutCredentials(`products/${serverId}`, "GET");

      if (res.success) {
        Store.update(state => {
          state.serverName = res.data.name;
          state.serverNameState = FetchState.SUCCEEDED;
        });
      } else {
        setFetchServerError(res.data.error);
        Store.update(state => { state.serverNameState = FetchState.ERROR; });
      }
    } catch (e) {
      setFetchServerError(e + "");
      Store.update(state => { state.serverNameState = FetchState.ERROR; });
    }
  };

  return {
    fetchServerName,
    serverName,
    fetchServerError,
    fetchState
  };
}
