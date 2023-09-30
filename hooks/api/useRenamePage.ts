import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useRenamePage() {
  const [hasRenameError, setHasRenameError] = useState(false);
  const [renameError, setRenameError] = useState("");
  const [successfulPageRename, setIsSuccessfulPageRename] = useState(false);

  const renamePage = async (
    pageId: number,
    newName: string
  ) => {
    // clientside validation

    setIsSuccessfulPageRename(false);

    if (!newName || newName.length == 0) {
      setHasRenameError(true);
      setRenameError("Ein Name muss angegeben werden");
      return;
    }

    if (!pageId || pageId == 0) {
      setHasRenameError(true);
      setRenameError(
        "Die Plan ID darf nicht leer sein. Das ist ein Fehler in der Logik dieser App."
      );
      return;
    }

    const res = await requestApi(`pages/${pageId}`, "PATCH", {
      name: newName
    });

    if (!res) {
      setHasRenameError(true);
      setRenameError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    if (res.success) {
      setHasRenameError(false);
      setRenameError("");
      setIsSuccessfulPageRename(true);
    } else {
      setHasRenameError(true);
      setRenameError(res.data.error);
    }
  };

  return {
    renamePage,
    hasRenameError,
    renameError,
    successfulPageRename,
  };
}
