import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ApiResponse = {
  success: boolean;
  error:
    | any
    | {
        message: string;
        description: string;
      };
  data: any;
};

export default function useServerName() {
  const [serverName, setName] = useState("");
  const [fetchServerError, setError] = useState("");
  const [fetchIsServerError, setIsError] = useState(false);
  const [isFetchServerLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServerName();
  }, []);

  const fetchServerName = () => {
    setIsLoading(true);
    setIsError(false);
    setError("");
    setName("");
    let configServer: string = Constants.expoConfig?.extra?.apiServer;

    AsyncStorage.getItem("serverId").then((serverId) => {
      if (serverId == null) {
        setIsError(true);
        setError("Im Cache befindet sich keine ID");
        setIsLoading(false);
        return;
      }

      fetch(`${configServer}/api/products/${serverId}`)
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setName(res.data.name);
          } else {
            setError(res.error.message);
            setIsError(true);
          }
        })
        .catch(() => {
          setError("Server nicht verfügbar. Bitte später erneut versuchen.");
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return {
    fetchServerName,
    serverName,
    fetchIsServerError,
    fetchServerError,
    isFetchServerLoading,
  };
}
