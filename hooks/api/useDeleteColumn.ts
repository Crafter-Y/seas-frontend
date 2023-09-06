import { useState } from "react";
import { requestApi } from "@/helpers/api";
export default function useDeleteColumn() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const deleteColumn = async (columnId: number) => {
    setSuccessfulDeletion(false);

    await requestApi(`columns/${columnId}`, "DELETE")

    setSuccessfulDeletion(true);
  };

  return { deleteColumn, succesfulDeletion };
}
