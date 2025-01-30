import { useEffect } from "react";
import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useAllDefaultComments() {
  const allDefaultComments = Store.useState(
    (state) => state.allDefaultComments,
  );

  const queryAllDefaultComments = async () => {
    const res = await requestApi("defaultcomments", "GET");

    if (res === null || !res.success) return;

    Store.update((state) => {
      state.allDefaultComments = res.data.defaultComments;
    });
  };

  useEffect(() => {
    if (allDefaultComments.length === 0) queryAllDefaultComments();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allDefaultComments, queryAllDefaultComments };
}
