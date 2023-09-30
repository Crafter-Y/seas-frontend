import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useAssignUser() {
  const [assignmentSuccessful, setAssignmentSuccessful] = useState(false);

  const assignUser = async (
    userId: number,
    rowDate: string,
    columnId: number
  ) => {
    setAssignmentSuccessful(false);

    await requestApi("board/assignments", "PUT", { userId, date: rowDate, columnId });

    setAssignmentSuccessful(true);
  };

  return { assignUser, assignmentSuccessful };
}
