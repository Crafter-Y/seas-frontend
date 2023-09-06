import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useAllColumns() {
  const [allColumns, setAllColumns] = useState<APIResponseColumn[]>([]);

  const queryColumns = async () => {
    let res = await requestApi("columns", "GET");

    if (res && res.success) {
      setAllColumns(res.data.columns);
    }
  };

  useEffect(() => {
    queryColumns();
  }, []);

  return { allColumns, queryColumns };
}
