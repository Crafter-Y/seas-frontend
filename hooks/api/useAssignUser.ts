import { useState } from "react";

import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useAssignUser() {
  const [assignmentSuccessful, setAssignmentSuccessful] = useState(false);

  const preAssignUser = (userId: number, rowDate: string, columnId: number) => {
    // fast insertation on row modal
    const selectedRow = Store.getRawState().selectedRow;
    if (selectedRow && selectedRow.date === rowDate) {
      const prevAssignments = [...selectedRow.assignments];
      prevAssignments.push({
        userId,
        boardColumnId: columnId,
        id: Math.random() + 1_000_000,
      });

      Store.update((state) => {
        state.selectedRow = {
          date: selectedRow.date,
          assignments: prevAssignments,
          comments: selectedRow.comments,
        };
      });
    }

    // fast insertation on board
    const currentBoard = Store.getRawState().board;
    const newBoard = currentBoard.map((row) => {
      if (row.date === rowDate) {
        const prevAssignments = [...row.assignments];
        prevAssignments.push({
          userId,
          boardColumnId: columnId,
          id: Math.random() + 1_000_000,
        });

        return {
          date: row.date,
          assignments: prevAssignments,
          comments: row.comments,
        };
      }
      return row;
    });

    Store.update((state) => {
      state.board = newBoard;
    });
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
