import { useState } from "react";

import { requestApi } from "@/helpers/api";

export type AssignmentChange = {
  pageId: number;
  columnId: number;
  isAssigned: boolean;
};

export default function useAssignColumns() {
  const [assignmentSuccessful, setAssignmentSuccessful] = useState(false);

  const assignColumns = (changes: AssignmentChange[]) => {
    setAssignmentSuccessful(false);
    if (changes.length === 0) {
      setAssignmentSuccessful(true);
      return;
    }

    const pendingAssignments: string[] = [];
    changes.forEach(async (change) => {
      pendingAssignments.push(change.pageId + "" + change.columnId);

      await requestApi("columns/assign", "PATCH", {
        columnId: change.columnId,
        pageId: change.pageId,
        assign: change.isAssigned,
      });

      pendingAssignments.pop();
      if (pendingAssignments.length === 0) setAssignmentSuccessful(true);
    });
  };

  return { assignColumns, assignmentSuccessful };
}
