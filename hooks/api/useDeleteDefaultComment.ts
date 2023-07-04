import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
export default function useDeleteDefaultComment() {
  const getApi = useApi();

  const deleteDefaultComment = (commentId: string) => {
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
      });
    });
  };

  return deleteDefaultComment;
}
