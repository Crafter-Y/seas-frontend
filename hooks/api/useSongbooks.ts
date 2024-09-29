import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useSongbooks() {
  const [songbooks, setSongbooks] = useState<APISongbookResponse[]>([]);

  const querySongbooks = async () => {
    const res = await requestApi("songs/songbooks", "GET");

    if (res && res.success) {
      setSongbooks(res.data.songbooks);
    }
  };

  useEffect(() => {
    querySongbooks();
  }, []);

  return { songbooks };
}
