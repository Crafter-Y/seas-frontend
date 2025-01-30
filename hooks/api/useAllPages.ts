import { useEffect } from "react";
import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useAllPages() {
  const allPages = Store.useState((state) => state.allPages);

  const queryPages = async () => {
    const res = await requestApi("pages", "GET");

    if (res && res.success) {
      Store.update((state) => {
        state.allPages = res?.data.pages;
      });
    }
  };

  useEffect(() => {
    if (allPages.length === 0) queryPages();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allPages, queryPages };
}
