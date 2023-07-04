import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { ManageCommentTemplatesScreenProps } from "@/screens/settings/ManageCommentTemplatesScreen";

export default function useCreateDefaultComment() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [
    successfulDefaultCommentCreation,
    setIsSuccessfulDefaultCommentCreation,
  ] = useState(false);

  const getApi = useApi();

  const createDefaultComment = (
    comment: string,
    navigation: ManageCommentTemplatesScreenProps
  ) => {
    // clientside validation

    setIsSuccessfulDefaultCommentCreation(false);

    if (!comment || comment.length == 0) {
      setHasCreationError(true);
      setCreationError("Es muss ein Kommentar angegeben werden");
      return;
    }

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let req = new FormData();
      req.append("comment", comment);
      fetch(`${configServer}/api/createCommentTemplate/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setHasCreationError(false);
            setCreationError("");
            setIsSuccessfulDefaultCommentCreation(true);
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
    createDefaultComment,
    hasCreationError,
    creationError,
    successfulDefaultCommentCreation,
  };
}
