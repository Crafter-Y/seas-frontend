import { use, useCallback, useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useAllPages() {
  const { allPages, setAllPages } = use(AppContext);

  const queryPages = useCallback(async () => {
    const res = await requestApi("pages", "GET");

    if (res && res.success) {
      setAllPages(res.data.pages);
    }
  }, [setAllPages]);

  useEffect(() => {
    if (allPages.length === 0) queryPages();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allPages, queryPages };
}
