import { useEffect, useState } from "react";
import useApi from "../useApiName";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAllDefaultComments() {
  const [allDefaultComments, setAllDefaultComments] = useState<
    APIResponseDefaultComment[]
  >([]);

  const getApi = useApi();

  const queryAllDefaultComments = () => {
    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        return;
      }

      fetch(`${configServer}/api/getAllCommentTemplates/`, {
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setAllDefaultComments(res.data);
          }
        })
        .catch(() => {});
    });
  };

  useEffect(() => {
    queryAllDefaultComments();
  }, []);

  return { allDefaultComments, queryAllDefaultComments };
}
