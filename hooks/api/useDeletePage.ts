import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useDeletePage() {
  const [succesfulDeletion, setSuccessfulDeletion] = useState(false);
  const getApi = useApi();

  const deletePage = (pageId: string) => {
    setSuccessfulDeletion(false);
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("pageId", pageId);
      fetch(`${configServer}/api/deletePage/`, {
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

  return { deletePage, succesfulDeletion };
}
