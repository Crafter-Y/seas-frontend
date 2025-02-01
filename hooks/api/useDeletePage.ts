import { useState } from "react";

import { requestApi } from "@/helpers/api";

export default function useDeletePage() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const deletePage = async (pageId: number) => {
    setSuccessfulDeletion(false);

    await requestApi(`pages/${pageId}`, "DELETE");

    setSuccessfulDeletion(true);
  };

  return { deletePage, succesfulDeletion };
}
