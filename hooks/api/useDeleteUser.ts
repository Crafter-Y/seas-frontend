import { useState } from "react";
import { requestApi } from "@/helpers/api";
export default function useDeleteUser() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const deleteUser = async (userId: number) => {
    setSuccessfulDeletion(false);

    await requestApi(`users/${userId}`, "DELETE")
    setSuccessfulDeletion(true);
  };

  return { deleteUser, succesfulDeletion };
}
