import { use, useCallback, useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useModuleStatus() {
  const { moduleStatus, setModuleStatus } = use(AppContext);

  const queryModuleStatus = useCallback(async () => {
    const res = await requestApi("modules", "GET");

    if (res === null || !res.success) return;

    setModuleStatus(res.data.modules);
  }, [setModuleStatus]);

  useEffect(() => {
    queryModuleStatus();
    // TODO: figure out query-once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { moduleStatus, queryModuleStatus };
}
