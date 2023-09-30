import { useState } from "react";
import { requestApi } from "@/helpers/api";
export default function useDeleteDefaultComment() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const deleteDefaultComment = async (commentId: number) => {
    setSuccessfulDeletion(false);

    await requestApi(`defaultcomments/${commentId}`, "DELETE");

    setSuccessfulDeletion(true);
  };

  return { deleteDefaultComment, succesfulDeletion };
}
