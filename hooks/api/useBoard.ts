import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useBoard() {
  const [rows, setRows] = useState<BoardRow[]>([]);
  const [loading, setLoading] = useState(false);

  const queryBoard = async (fromDate: string, toDate: string) => {
    setLoading(true)

    let res = await requestApi(`board?from=${fromDate}&to=${toDate}`, "GET")

    if (res && res.success) {
      setRows(res.data);
    }

    setLoading(false)
  };

  return { rows, queryBoard, loading };
}
