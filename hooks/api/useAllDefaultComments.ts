import { use, useCallback, useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useAllDefaultComments() {
  const { allDefaultComments, setAllDefaultComments } = use(AppContext);

  const queryAllDefaultComments = useCallback(async () => {
    const res = await requestApi("defaultcomments", "GET");

    if (res === null || !res.success) return;

    setAllDefaultComments(res.data.defaultComments);
  }, [setAllDefaultComments]);

  useEffect(() => {
    if (allDefaultComments.length === 0) queryAllDefaultComments();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allDefaultComments, queryAllDefaultComments };
}
