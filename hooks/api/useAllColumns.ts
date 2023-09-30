import { useEffect } from "react";
import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useAllColumns() {
  const allColumns = Store.useState(state => state.allColumns);

  const queryColumns = async () => {
    const res = await requestApi("columns", "GET");

    if (res && res.success) {
      Store.update(state => { state.allColumns = res?.data.columns; });
    }
  };

  useEffect(() => {
    if (allColumns.length == 0) queryColumns();
  }, []);

  return { allColumns, queryColumns };
}
