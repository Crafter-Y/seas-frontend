import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { ManagePagesScreenProps } from "@/screens/settings/ManagePagesScreen";

export default function useRenamePage() {
  const [hasRenameError, setHasRenameError] = useState(false);
  const [renameError, setRenameError] = useState("");
  const [successfulPageRename, setIsSuccessfulPageRename] = useState(false);

  const getApi = useApi();

  const renamePage = (
    pageId: string,
    newName: string,
    navigation: ManagePagesScreenProps
  ) => {
    // clientside validation

    setIsSuccessfulPageRename(false);

    if (!newName || newName.length == 0) {
      setHasRenameError(true);
      setRenameError("Ein Name muss angegeben werden");
      return;
    }

    if (!pageId || pageId.length == 0) {
      setHasRenameError(true);
      setRenameError(
        "Die Plan ID darf nicht leer sein. Das ist ein Fehler in der Logik dieser App."
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
      req.append("pageId", pageId);
      req.append("newPageName", newName);
      fetch(`${configServer}/api/renamePage/`, {
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
            setIsSuccessfulPageRename(true);
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
    renamePage,
    hasRenameError,
    renameError,
    successfulPageRename,
  };
}
