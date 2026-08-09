import { use, useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useRestrictions() {
  const { restrictions, setRestrictions } = use(AppContext);

  const queryRestrictions = async () => {
    const res = await requestApi("restrictions", "GET");

    if (res === null || !res.success) return;

    setRestrictions(res.data.restrictions);
  };

  useEffect(() => {
    if (!restrictions) queryRestrictions();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { restrictions, queryRestrictions };
}
