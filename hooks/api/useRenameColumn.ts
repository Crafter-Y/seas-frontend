import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { ManagePositionsScreenProps } from "@/screens/settings/ManagePositionsScreen";

export default function useRenameColumn() {
  const [hasRenameError, setHasRenameError] = useState(false);
  const [renameError, setRenameError] = useState("");
  const [successfulColumnRename, setIsSuccessfulColumnRename] = useState(false);

  const getApi = useApi();

  const renameColumn = (
    columnId: string,
    newName: string,
    navigation: ManagePositionsScreenProps
  ) => {
    // clientside validation

    setIsSuccessfulColumnRename(false);

    if (!newName || newName.length == 0) {
      setHasRenameError(true);
      setRenameError("Ein Name muss angegeben werden");
      return;
    }

    if (!columnId || columnId.length == 0) {
      setHasRenameError(true);
      setRenameError(
        "Die Spalten ID darf nicht leer sein. Das ist ein Fehler in der Logik dieser App."
      );
      return;
    }

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let req = new FormData();
      req.append("columnId", columnId);
      req.append("newColumnName", newName);
      fetch(`${configServer}/api/renameColumn/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setHasRenameError(false);
            setRenameError("");
            setIsSuccessfulColumnRename(true);
          } else {
            setHasRenameError(true);
            setRenameError(res.error.message);
          }
        })
        .catch(() => {
          setHasRenameError(true);
          setRenameError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
        });
    });
  };

  return {
    renameColumn,
    hasRenameError,
    renameError,
    successfulColumnRename,
  };
}
