import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useAllDefaultComments() {
  const [allDefaultComments, setAllDefaultComments] = useState<
    APIResponseDefaultComment[]
  >([]);

  const queryAllDefaultComments = async () => {
    const res = await requestApi("defaultcomments", "GET");

    if (res == null || !res.success) return;

    setAllDefaultComments(res.data.defaultComments);
  };

  useEffect(() => {
    queryAllDefaultComments();
  }, []);

  return { allDefaultComments, queryAllDefaultComments };
}
