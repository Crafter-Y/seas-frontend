import { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
import { requestApi } from "@/helpers/api";
import { formatDate } from "@/helpers/format";
import { RatedSong } from "@/helpers/store";
import { useState } from "react";

export default function useSaveSongEntries() {
  const [successfulSave, setSuccessfulSave] = useState(false);

  const saveSongs = async (
    songs: RatedSong[],
    date: Date,
    type: MusicEntryType,
  ) => {
    setSuccessfulSave(false);
    const res = await requestApi("songs", "PUT", {
      songEntries: songs.map((song) => {
        return {
          date: formatDate(date),
          rating: Number(song.rating),
          comment: song.comment,
          type,
          songId: song.id,
        };
      }),
    });

    if (res === null) return;

    if (res.success) {
      setSuccessfulSave(true);
    }
  };

  return { saveSongs, successfulSave };
}
