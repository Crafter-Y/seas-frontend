import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useDeleteSongbook() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const deleteSongbook = async (id: number) => {
    setSuccessfulDeletion(false);

    await requestApi(`songs/songbooks/${id}`, "DELETE");

    setSuccessfulDeletion(true);
  };

  return { deleteSongbook, succesfulDeletion };
}
