import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useCreateSongbook() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  const createSongbook = async (name: string) => {
    setSuccessfulCreation(false);

    if (!name || name.length === 0) {
      setHasCreationError(true);
      setCreationError("Ein Name muss angegeben werden");
      return;
    }

    const res = await requestApi("songs/songbooks", "POST", {
      name,
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
    createSongbook,
    hasCreationError,
    creationError,
    successfulCreation,
  };
}
