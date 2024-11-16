import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useOwnSongbooks() {
  const [ownSongbooks, setOwnSongbooks] = useState<APISongbookResponse[]>([]);

  const querySongbooks = async () => {
    const res = await requestApi("songs/own", "GET");

    if (res && res.success) {
      setOwnSongbooks(res.data.songbooks);
    }
  };

  useEffect(() => {
    querySongbooks();
  }, []);

  return { ownSongbooks };
}
