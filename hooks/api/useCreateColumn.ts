import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useCreateColumn() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulColumnCreation, setIsSuccessfulColumnCreation] =
    useState(false);

  const createColumn = async (
    name: string,
    type: string,
  ) => {
    // clientside validation

    setIsSuccessfulColumnCreation(false);

    if (name == null || name == "") {
      setHasCreationError(true);
      setCreationError("Der Name muss angegeben werden");
      return;
    }

    if (type !== "POSITION" && type !== "COMMENT") {
      setHasCreationError(true);
      setCreationError("Die angegebene Rolle ist nicht gültig.");
      return;
    }

    const res = await requestApi("columns", "POST", {
      name,
      type
    });

    if (res == null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    if (res.success) {
      setIsSuccessfulColumnCreation(true);
      setHasCreationError(false);
      setCreationError("");
    } else {
      setHasCreationError(true);
      setCreationError(res.data.error);
    }
  };

  return {
    createColumn,
    hasCreationError,
    creationError,
    successfulColumnCreation,
  };
}
