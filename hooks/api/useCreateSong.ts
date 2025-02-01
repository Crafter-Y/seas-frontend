import { useState } from "react";

import { requestApi } from "@/helpers/api";

export const validateSong = (number: string, title: string) => {
  if (!number || number.length === 0) return "Eine Liednummer angegeben werden";

  if (number.length > 64)
    return "Die Liednummer darf nicht länger als 64 Zeichen sein.";

  if (!title || title.length === 0) return "Es muss ein Titel angegeben werden";
  if (title.length > 64)
    return "Der Titel darf nicht länger als 64 Zeichen sein.";

  return null;
};

export default function useCreateSong() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  const createSong = async (
    number: string,
    title: string,
    songbookId: number,
  ) => {
    setSuccessfulCreation(false);

    const validate = validateSong(number, title);
    if (validate !== null) {
      setHasCreationError(true);
      setCreationError(validate);
    }

    const res = await requestApi("songs", "POST", {
      number,
      title,
      songbookId,
    });

    if (res === null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen.",
      );
      return;
    }

    if (res.success) {
      setHasCreationError(false);
      setCreationError("");
      setSuccessfulCreation(true);
    } else {
      setHasCreationError(true);
      setCreationError(res.data.error);
    }
  };

  return {
    createSong,
    hasCreationError,
    creationError,
    successfulCreation,
  };
}
