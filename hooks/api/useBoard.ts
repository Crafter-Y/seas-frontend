import { useState } from "react";
import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useBoard() {
  const rows = Store.useState(state => state.board);
  const [loading, setLoading] = useState(false);

  const queryBoard = async (fromDate: string, toDate: string) => {
    Store.update(state => {
      state.lastQueryFrom = new Date(fromDate);
      state.lastQueryTo = new Date(toDate);
    });

    setLoading(true);

    const res = await requestApi(`board?from=${fromDate}&to=${toDate}`, "GET");

    if (res && res.success) {
      Store.update(state => { state.board = res?.data; });
    }

    setLoading(false);
  };

  return { rows, queryBoard, loading };
}
