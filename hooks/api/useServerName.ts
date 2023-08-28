import { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";

export default function useServerName() {
  const [name, setName] = useState("");
  const [fetchSuccessful, setFetchSuccessful] = useState(false);
  const [fetchServerError, setFetchServerError] = useState<string | null>(null);

  const getApi = useApi();

  useEffect(() => {
    fetchServerName();
  }, []);

  const fetchServerName = () => {
    setFetchSuccessful(false);
    setFetchServerError(null)
    setName("");

    let configServer = getApi();

    AsyncStorage.getItem("serverId").then((serverId) => {
      if (serverId == null) {
        return;
      }

      fetch(`${configServer}/api/v1/products/${serverId}`)
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setName(res.data.name);
            setFetchSuccessful(true);
          } else {
            setFetchServerError(res.data.error)
          }
        })
    });
  };

  return {
    fetchServerName,
    serverName: name,
    fetchSuccessful,
    fetchServerError
  };
}
