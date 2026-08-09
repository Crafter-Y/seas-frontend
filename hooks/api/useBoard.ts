import { use } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";
import { formatDate } from "@/helpers/format";

export default function useBoard() {
  const {
    board: rows,
    setBoard,
    boardLoading: loading,
    setBoardLoading,
    lastQueryFrom,
    setLastQueryFrom,
    lastQueryTo,
    setLastQueryTo,
  } = use(AppContext);

  const requeryBoard = async () => {
    if (lastQueryFrom && lastQueryTo)
      await queryBoard(lastQueryFrom, lastQueryTo);
  };

  const queryBoard = async (fromDate: Date, toDate: Date) => {
    setLastQueryFrom(fromDate);
    setLastQueryTo(toDate);
    setBoardLoading(true);

    const res = await requestApi(
      `board?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`,
      "GET",
    );

    if (res && res.success) {
      setBoard(res.data);
    }

    setBoardLoading(false);
  };

  return { rows, queryBoard, requeryBoard, loading };
}
