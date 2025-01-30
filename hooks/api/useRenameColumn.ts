import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useRenameColumn() {
  const [hasRenameError, setHasRenameError] = useState(false);
  const [renameError, setRenameError] = useState("");
  const [successfulColumnRename, setIsSuccessfulColumnRename] = useState(false);

  const renameColumn = async (columnId: number, newName: string) => {
    // clientside validation

    setIsSuccessfulColumnRename(false);

    if (!newName || newName.length === 0) {
      setHasRenameError(true);
      setRenameError("Ein Name muss angegeben werden");
      return;
    }

    if (!columnId || columnId === 0) {
      setHasRenameError(true);
      setRenameError(
        "Die Spalten ID darf nicht leer sein. Das ist ein Fehler in der Logik dieser App.",
      );
      return;
    }

    const res = await requestApi(`columns/${columnId}`, "PATCH", {
      name: newName,
    });

    if (res === null) {
      setHasRenameError(true);
      setRenameError("Server nicht verfügbar. Bitte später erneut versuchen.");
      return;
    }

    if (res.success) {
      setHasRenameError(false);
      setRenameError("");
      setIsSuccessfulColumnRename(true);
    } else {
      setHasRenameError(true);
      setRenameError(res.data.error);
    }
  };

  return {
    renameColumn,
    hasRenameError,
    renameError,
    successfulColumnRename,
  };
}
