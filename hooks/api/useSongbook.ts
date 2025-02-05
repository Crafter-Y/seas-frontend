import { useCallback, useState } from "react";

import { requestApi } from "@/helpers/api";

export default function useSongbook() {
  const [songs, setSongs] = useState<APIResponseSongbookSong[]>([]);
  const [editable, setEditable] = useState(false);

  const querySongbook = useCallback(async (songbookId: number) => {
    const res = await requestApi(`songs/songbooks/${songbookId}`, "GET");

    if (res && res.success) {
      setSongs(res.data.songs);
      setEditable(res.data.editable);
    }
  }, []);

  return { songs, querySongbook, editable };
}
