import { use, useCallback } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useSingleBoardEntry() {
  const { selectedRow, setSelectedRow, setBoard } = use(AppContext);

  const querySingleRow = useCallback(
    async (date: string) => {
      const res = await requestApi(`board/${date}`, "GET");
      if (res && res.success) {
        const queriedRow = res.data.row;
        setSelectedRow(queriedRow);
        setBoard((board) =>
          board.map((row) => {
            if (row.date === queriedRow.date) {
              return {
                date: row.date,
                comments: row.comments,
                assignments: queriedRow.assignments,
              };
            }

            return row;
          }),
        );
      }
    },
    [setBoard, setSelectedRow],
  );

  return { selectedRow, querySingleRow };
}
