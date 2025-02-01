import { useState } from "react";

import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useUnAssignUser() {
  const [unassignmentSuccessful, setUnassignmentSuccessful] = useState(false);

  const preUnAssignUser = (assignmentId: number) => {
    // fast insertation on row modal
    const selectedRow = Store.getRawState().selectedRow;
    if (selectedRow) {
      let prevAssignments = [...selectedRow.assignments];
      prevAssignments = prevAssignments.filter(
        (assignment) => assignment.id !== assignmentId,
      );

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
      let prevAssignments = [...row.assignments];
      prevAssignments = prevAssignments.filter(
        (assignment) => assignment.id !== assignmentId,
      );

      return {
        date: row.date,
        assignments: prevAssignments,
        comments: row.comments,
      };
    });

    Store.update((state) => {
      state.board = newBoard;
    });
  };

  const unassignUser = async (assignmentId: number) => {
    setUnassignmentSuccessful(false);

    preUnAssignUser(assignmentId);

    await requestApi(`board/assignments/${assignmentId}`, "DELETE");

    setUnassignmentSuccessful(true);
  };

  return { unassignUser, unassignmentSuccessful };
}
