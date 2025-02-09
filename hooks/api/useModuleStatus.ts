import { useCallback, useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useModuleStatus() {
  const moduleStatus = Store.useState((state) => state.moduleStatus);

  const queryModuleStatus = useCallback(async () => {
    const res = await requestApi("modules", "GET");

    if (res === null || !res.success) return;

    Store.update((state) => {
      state.moduleStatus = res.data.modules;
    });
  }, []);

  useEffect(() => {
    queryModuleStatus();
    // TODO: figure out query-once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { moduleStatus, queryModuleStatus };
}
