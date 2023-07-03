import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
export default function useDeletePage() {
  const getApi = useApi();

  const deletePage = (pageId: string) => {
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
      });
    });
  };

  return deletePage;
}
