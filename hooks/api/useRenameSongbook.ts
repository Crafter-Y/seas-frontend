import { useState } from "react";

import { requestApi } from "@/helpers/api";

export default function useRenameSongbook() {
  const [hasRenameError, setHasRenameError] = useState(false);
  const [renameError, setRenameError] = useState("");
  const [successfulRename, setSuccessfulRename] = useState(false);

  const renamePage = async (id: number, newName: string) => {
    setSuccessfulRename(false);

    if (!newName || newName.length === 0) {
      setHasRenameError(true);
      setRenameError("Ein Name muss angegeben werden");
      return;
    }

    if (!id || id === 0) {
      setHasRenameError(true);
      setRenameError(
        "Die Plan ID darf nicht leer sein. Bitte melden Sie diesen Bug.",
      );
      return;
    }

    const res = await requestApi(`songs/songbooks/${id}`, "PATCH", {
      name: newName,
    });

    if (!res) {
      setHasRenameError(true);
      setRenameError("Server nicht verfügbar. Bitte später erneut versuchen.");
      return;
    }

    if (res.success) {
      setHasRenameError(false);
      setRenameError("");
      setSuccessfulRename(true);
    } else {
      setHasRenameError(true);
      setRenameError(res.data.error);
    }
  };

  return {
    renamePage,
    hasRenameError,
    renameError,
    successfulRename,
  };
}
