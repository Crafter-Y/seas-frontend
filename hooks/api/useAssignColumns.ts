import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { ManagePositionsScreenProps } from "@/screens/settings/ManagePositionsScreen";
import { useState } from "react";

export type AssignmentChange = {
  pageId: string;
  columnId: string;
  isAssigned: boolean;
};

export default function useAssignColumns() {
  const [assignmentSuccessful, setAssignmentSuccessful] = useState(false);
  const getApi = useApi();

  const assignColumns = (
    changes: AssignmentChange[],
    navigation: ManagePositionsScreenProps
  ) => {
    setAssignmentSuccessful(false);
    if (changes.length == 0) {
      return;
    }

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let pendingAssignments: string[] = [];
      changes.forEach((change) => {
        pendingAssignments.push(change.pageId + change.columnId);
        let req = new FormData();
        req.append("pageId", change.pageId);
        req.append("columnId", change.columnId);
        if (change.isAssigned) {
          req.append("assign", "Yes, please assign me");
        }

        fetch(`${configServer}/api/assignColumn/`, {
          method: "post",
          body: req,
          headers: {
            token,
          },
        }).then(() => {
          pendingAssignments.pop();
          if (pendingAssignments.length == 0) setAssignmentSuccessful(true);
        });
      });
    });
  };

  return { assignColumns, assignmentSuccessful };
}
