import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useAllPages() {
  const [allPages, setAllPages] = useState<APIResponsePage[]>([]);

  const queryPages = async () => {
    let res = await requestApi("pages", "GET");

    if (res && res.success) {
      setAllPages(res.data.pages);
    }
  };

  useEffect(() => {
    queryPages();
  }, []);

  return { allPages, queryPages };
}
