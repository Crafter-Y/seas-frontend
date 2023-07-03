import { useEffect, useState } from "react";
import useApi from "../useApiName";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAllPages() {
  const [allPages, setAllPages] = useState<APIResponsePage[]>([]);

  const getApi = useApi();

  const queryPages = () => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      fetch(`${configServer}/api/getAllPages/`, {
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setAllPages(res.data);
          }
        })
        .catch(() => {});
    });
  };

  useEffect(() => {
    queryPages();
  }, []);

  return { allPages, queryPages };
}
