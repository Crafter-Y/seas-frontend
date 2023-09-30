import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useCreatePage() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulPageCreation, setIsSuccessfulPageCreation] = useState(false);

  const createPage = async (name: string) => {
    // clientside validation

    setIsSuccessfulPageCreation(false);

    if (!name || name.length == 0) {
      setHasCreationError(true);
      setCreationError("Ein Name muss angegeben werden");
      return;
    }

    const res = await requestApi("pages", "POST", {
      name
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
      setIsSuccessfulPageCreation(true);
    } else {
      setHasCreationError(true);
      setCreationError(res.data.error);
    }
  };

  return {
    createPage,
    hasCreationError,
    creationError,
    successfulPageCreation,
  };
}
