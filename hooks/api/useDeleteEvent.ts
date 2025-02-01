import { useState } from "react";

import { requestApi } from "@/helpers/api";
export default function useDeleteEvent() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const deleteEvent = async (date: string) => {
    setSuccessfulDeletion(false);
    await requestApi(`events/${date}`, "DELETE");
    setSuccessfulDeletion(true);
  };

  return { deleteEvent, succesfulDeletion };
}
