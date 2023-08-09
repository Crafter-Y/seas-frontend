import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
import { BoardScreenProps } from "@/screens/BoardScreen";

export default function useUnAssignUser() {
  const [unassignmentSuccessful, setUnassignmentSuccessful] = useState(false);
  const getApi = useApi();

  const unassignUser = (
    userId: string,
    rowDate: string,
    columnId: string,
    navigation: BoardScreenProps
  ) => {
    setUnassignmentSuccessful(false);

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let req = new FormData();
      req.append("userId", userId);
      req.append("date", rowDate);
      req.append("columnId", columnId);

      fetch(`${configServer}/api/unassignUser/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      }).then(() => {
        setUnassignmentSuccessful(true);
      });
    });
  };

  return { unassignUser, unassignmentSuccessful };
}
