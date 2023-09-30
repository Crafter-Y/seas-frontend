import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useModuleStatus() {
    const [moduleStatus, setModuleStatus] = useState<
        APIModuleStatus | null
    >(null);

    const queryModuleStatus = async () => {
        let res = await requestApi("modules", "GET")

        if (res == null || !res.success) return;

        setModuleStatus(res.data.modules);
    };

    useEffect(() => {
        queryModuleStatus();
    }, []);

    return { moduleStatus, queryModuleStatus };
}
