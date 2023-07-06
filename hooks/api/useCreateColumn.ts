import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { ManagePositionsScreenProps } from "@/screens/settings/ManagePositionsScreen";

export default function useCreateColumn() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulColumnCreation, setIsSuccessfulColumnCreation] =
    useState(false);

  const getApi = useApi();

  const createColumn = (
    name: string,
    type: string,
    navigation: ManagePositionsScreenProps
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

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let req = new FormData();
      req.append("columnName", name);
      req.append("columnType", type);
      fetch(`${configServer}/api/createColumn/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setIsSuccessfulColumnCreation(true);
            setHasCreationError(false);
            setCreationError("");
          } else {
            setHasCreationError(true);
            setCreationError(res.error.message);
          }
        })
        .catch(() => {
          setHasCreationError(true);
          setCreationError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
        });
    });
  };

  return {
    createColumn,
    hasCreationError,
    creationError,
    successfulColumnCreation,
  };
}
