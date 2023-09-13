import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useBoard() {
  const [rows, setRows] = useState<BoardRow[]>([]);

  const queryBoard = async (fromDate: string, toDate: string) => {
    let res = await requestApi(`board?from=${fromDate}&to=${toDate}`, "GET")

    if (res && res.success) {
      setRows(res.data);
    }
  };

  return { rows, queryBoard };
}
