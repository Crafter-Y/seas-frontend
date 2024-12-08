import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useCreateSong() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  const createSong = async (number: string, title: string, songbookId: number) => {
    setSuccessfulCreation(false);

    if (!number || number.length == 0) {
      setHasCreationError(true);
      setCreationError("Eine Liednummer angegeben werden");
      return;
    }

    if (number.length > 64) {
      setHasCreationError(true);
      setCreationError("Die Liednummer darf nicht länger als 64 Zeichen sein.");
      return;
    }

    if (!title || title.length == 0) {
      setHasCreationError(true);
      setCreationError("Es muss ein Titel angegeben werden");
      return;
    }

    if (title.length > 64) {
      setHasCreationError(true);
      setCreationError("Der Titel darf nicht länger als 64 Zeichen sein.");
      return;
    }

    const res = await requestApi("songs", "POST", {
      number,
      title,
      songbookId
    });

    if (res == null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
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
