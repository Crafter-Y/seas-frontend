import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
export default function useDeleteColumn() {
  const getApi = useApi();

  const deleteColumn = (columnId: string) => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("columnId", columnId);
      fetch(`${configServer}/api/deleteColumn/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      });
    });
  };

  return deleteColumn;
}
