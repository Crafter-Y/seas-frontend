import { useEffect, useState } from "react";
import useApi from "../useApiName";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useBoard() {
  const [rows, setRows] = useState<BoardRow[]>([]);

  const getApi = useApi();

  const queryBoard = (fromDate: string, toDate: string): void => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("fromDate", fromDate);
      req.append("toDate", toDate);
      fetch(`${configServer}/api/board/`, {  // TODO: deprecated api usage
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setRows(res.data);
          }
        })
        .catch(() => { });
    });
  };

  return { rows, queryBoard };
}
