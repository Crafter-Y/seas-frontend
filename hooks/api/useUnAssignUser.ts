import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useUnAssignUser() {
  const [unassignmentSuccessful, setUnassignmentSuccessful] = useState(false);

  const unassignUser = async (assignmentId: number) => {
    setUnassignmentSuccessful(false);

    await requestApi(`board/assignments/${assignmentId}`, "DELETE")

    setUnassignmentSuccessful(true);
  };

  return { unassignUser, unassignmentSuccessful };
}
