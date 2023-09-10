import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
import { BoardScreenProps } from "@/screens/BoardScreen";

export default function useAssignUser() {
  const [assignmentSuccessful, setAssignmentSuccessful] = useState(false);
  const getApi = useApi();

  const assignUser = (
    userId: number,
    rowDate: string,
    columnId: number,
    navigation: BoardScreenProps
  ) => {
    setAssignmentSuccessful(false);

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let req = new FormData();
      req.append("userId", userId + "");
      req.append("date", rowDate);
      req.append("columnId", columnId + "");

      fetch(`${configServer}/api/assignUser/`, { // TODO: deprecated api usage
        method: "post",
        body: req,
        headers: {
          token,
        },
      }).then(() => {
        setAssignmentSuccessful(true);
      });
    });
  };

  return { assignUser, assignmentSuccessful };
}
