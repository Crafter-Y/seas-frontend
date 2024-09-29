import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useSongbook() {
  const [songs, setSongs] = useState<APIResponseSongbookSong[]>([]);

  const querySongbook = async (songbookId: number) => {
    const res = await requestApi(`songs/songbooks/${songbookId}`, "GET");

    if (res && res.success) {
      setSongs(res.data.songs);
    }
  };

  return { songs, querySongbook };
}
