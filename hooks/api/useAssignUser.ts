import { use, useState } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useAssignUser() {
  const [assignmentSuccessful, setAssignmentSuccessful] = useState(false);
  const { setBoard, setSelectedRow } = use(AppContext);

  const preAssignUser = (userId: number, rowDate: string, columnId: number) => {
    const selectedRowAssignment = {
      userId,
      boardColumnId: columnId,
      id: Math.random() + 1_000_000,
    };
    const boardAssignment = {
      userId,
      boardColumnId: columnId,
      id: Math.random() + 1_000_000,
    };

    // fast insertation on row modal
    setSelectedRow((selectedRow) => {
      if (!selectedRow || selectedRow.date !== rowDate) return selectedRow;

      return {
        date: selectedRow.date,
        assignments: [...selectedRow.assignments, selectedRowAssignment],
        comments: selectedRow.comments,
      };
    });

    // fast insertation on board
    setBoard((board) =>
      board.map((row) => {
        if (row.date === rowDate) {
          return {
            date: row.date,
            assignments: [...row.assignments, boardAssignment],
            comments: row.comments,
          };
        }
        return row;
      }),
    );
  };

  const assignUser = async (
    userId: number,
    rowDate: string,
    columnId: number,
  ) => {
    setAssignmentSuccessful(false);

    preAssignUser(userId, rowDate, columnId);

    await requestApi("board/assignments", "PUT", {
      userId,
      date: rowDate,
      columnId,
    });

    setAssignmentSuccessful(true);
  };

  return { assignUser, assignmentSuccessful };
}
