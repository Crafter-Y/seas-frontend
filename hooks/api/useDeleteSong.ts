import { useState } from "react";

import { requestApi } from "@/helpers/api";

export default function useDeleteSong() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const deleteSong = async (id: number) => {
    setSuccessfulDeletion(false);

    await requestApi(`songs/${id}`, "DELETE");

    setSuccessfulDeletion(true);
  };

  return { deleteSong, succesfulDeletion };
}
