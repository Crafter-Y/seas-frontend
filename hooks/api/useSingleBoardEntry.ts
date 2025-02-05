import { useCallback } from "react";

import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useSingleBoardEntry() {
  const selectedRow = Store.useState((state) => state.selectedRow);

  const querySingleRow = useCallback(async (date: string) => {
    const res = await requestApi(`board/${date}`, "GET");
    if (res && res.success) {
      Store.update((state) => {
        state.selectedRow = res?.data.row;
      });

      const currentBoard = Array.of(...Store.getRawState().board);
      const newBoard = currentBoard.map((row) => {
        if (row.date === res?.data.row.date) {
          return {
            date: row.date,
            comments: row.comments,
            assignments: res?.data.row.assignments,
          };
        }

        return row;
      });
      Store.update((state) => {
        state.board = newBoard;
      });
    }
  }, []);

  return { selectedRow, querySingleRow };
}
