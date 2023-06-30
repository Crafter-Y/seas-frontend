import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
export default function useDeleteUser() {
  const getApi = useApi();

  const deleteUser = (userId: string) => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      let req = new FormData();
      req.append("userId", userId);
      fetch(`${configServer}/api/deleteUser/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      });
    });
  };

  return deleteUser;
}
