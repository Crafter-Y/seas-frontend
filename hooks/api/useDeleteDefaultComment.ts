import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useDeleteDefaultComment() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);

  const getApi = useApi();

  const deleteDefaultComment = (commentId: string) => {
    setSuccessfulDeletion(false);

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("commentId", commentId);
      fetch(`${configServer}/api/deleteDefaultComment/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      }).then(() => {
        setSuccessfulDeletion(true);
      });
    });
  };

  return { deleteDefaultComment, succesfulDeletion };
}
