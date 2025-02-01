import { useState } from "react";

import { requestApi } from "@/helpers/api";

export default function useCreateDefaultComment() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [
    successfulDefaultCommentCreation,
    setIsSuccessfulDefaultCommentCreation,
  ] = useState(false);

  const createDefaultComment = async (comment: string) => {
    // clientside validation

    setIsSuccessfulDefaultCommentCreation(false);

    if (!comment || comment.length === 0) {
      setHasCreationError(true);
      setCreationError("Es muss ein Kommentar angegeben werden");
      return;
    }

    const res = await requestApi("defaultcomments", "POST", {
      comment,
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
      setIsSuccessfulDefaultCommentCreation(true);
    } else {
      setHasCreationError(true);
      setCreationError(res.data.error);
    }
  };

  return {
    createDefaultComment,
    hasCreationError,
    creationError,
    successfulDefaultCommentCreation,
  };
}
