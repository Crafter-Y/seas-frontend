import { useEffect } from "react";
import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useRestrictions() {
    const restrictions = Store.useState(state => state.restrictions);

    const queryRestrictions = async () => {
        const res = await requestApi("restrictions", "GET");

        if (res == null || !res.success) return;

        Store.update(state => { state.restrictions = res.data.restrictions; });
    };

    useEffect(() => {
        if (!restrictions) queryRestrictions();
    }, []);

    return { restrictions, queryRestrictions };
}
