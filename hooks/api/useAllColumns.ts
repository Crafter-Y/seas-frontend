import { useEffect, useState } from "react";
import useApi from "../useApiName";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAllColumns() {
  const [allColumns, setAllColumns] = useState<APIResponseColumn[]>([]);

  const getApi = useApi();

  const queryColumns = () => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      fetch(`${configServer}/api/getAllColumns/`, {
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setAllColumns(res.data);
          }
        })
        .catch(() => {});
    });
  };

  useEffect(() => {
    queryColumns();
  }, []);

  return { allColumns, queryColumns };
}
