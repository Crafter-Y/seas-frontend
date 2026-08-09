import { use, useState } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useUnAssignUser() {
  const [unassignmentSuccessful, setUnassignmentSuccessful] = useState(false);
  const { setBoard, setSelectedRow } = use(AppContext);

  const preUnAssignUser = (assignmentId: number) => {
    // fast insertation on row modal
    setSelectedRow((selectedRow) => {
      if (!selectedRow) return selectedRow;

      return {
        date: selectedRow.date,
        assignments: selectedRow.assignments.filter(
          (assignment) => assignment.id !== assignmentId,
        ),
        comments: selectedRow.comments,
      };
    });

    // fast insertation on board
    setBoard((board) =>
      board.map((row) => ({
        date: row.date,
        assignments: row.assignments.filter(
          (assignment) => assignment.id !== assignmentId,
        ),
        comments: row.comments,
      })),
    );
  };

  const unassignUser = async (assignmentId: number) => {
    setUnassignmentSuccessful(false);

    preUnAssignUser(assignmentId);

    await requestApi(`board/assignments/${assignmentId}`, "DELETE");

    setUnassignmentSuccessful(true);
  };

  return { unassignUser, unassignmentSuccessful };
}
