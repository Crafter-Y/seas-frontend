import { useState } from "react";

import { requestApi } from "@/helpers/api";
import { validateSong } from "@/hooks/api/useCreateSong";

export default function useEditSong() {
  const [hasEditError, setHasEditError] = useState(false);
  const [editError, setEditError] = useState("");
  const [successfulEdit, setSuccessfulEdit] = useState(false);

  const editSong = async (id: number, title: string, number: string) => {
    setSuccessfulEdit(false);

    const validate = validateSong(number, title);
    if (validate !== null) {
      setHasEditError(true);
      setEditError(validate);
    }

    const res = await requestApi(`songs/${id}`, "PATCH", {
      number,
      title,
    });

    if (!res) {
      setHasEditError(true);
      setEditError("Server nicht verfügbar. Bitte später erneut versuchen.");
      return;
    }

    if (res.success) {
      setHasEditError(false);
      setEditError("");
      setSuccessfulEdit(true);
    } else {
      setHasEditError(true);
      setEditError(res.data.error);
    }
  };

  return {
    editSong,
    hasEditError,
    editError,
    successfulEdit,
  };
}
