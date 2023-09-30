import { useState } from "react";
import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useBoard() {
  const rows = Store.useState(state => state.board)
  const [loading, setLoading] = useState(false);

  const queryBoard = async (fromDate: string, toDate: string) => {
    setLoading(true)

    let res = await requestApi(`board?from=${fromDate}&to=${toDate}`, "GET")

    if (res && res.success) {
      Store.update(state => { state.board = res?.data });
    }

    setLoading(false)
  };

  return { rows, queryBoard, loading };
}
