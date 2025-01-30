import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useSetPageModerator() {
  const [succesfulAssignment, setSuccessfulAssignment] = useState(false);

  const assignModerator = async (pageId: number, userId: number | null) => {
    setSuccessfulAssignment(false);

    await requestApi("pages/moderator", "PUT", {
      pageId,
      userId,
    });

    setSuccessfulAssignment(true);
  };

  return { assignModerator, succesfulAssignment };
}
