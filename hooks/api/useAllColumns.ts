import { use, useCallback, useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useAllColumns() {
  const { allColumns, setAllColumns } = use(AppContext);

  const queryColumns = useCallback(async () => {
    const res = await requestApi("columns", "GET");

    if (res && res.success) {
      setAllColumns(res.data.columns);
    }
  }, [setAllColumns]);

  useEffect(() => {
    if (allColumns.length === 0) queryColumns();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allColumns, queryColumns };
}
