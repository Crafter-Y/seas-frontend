import { requestApi } from "@/helpers/api";
import { formatDate } from "@/helpers/format";
import { RatedSong } from "@/helpers/store";
import { useState } from "react";

export default function useSaveSongEntries() {
    const [successfulSave, setSuccessfulSave] =
        useState(false);

    const saveSongs = async (songs: RatedSong[], date: Date) => {
        setSuccessfulSave(false);
        const res = await requestApi("songs", "PUT", {
            songEntries: songs.map(song => {
                return {
                    date: formatDate(date),
                    rating: Number(song.rating),
                    comment: song.comment,
                    songId: song.id
                };
            })
        });

        if (res == null) return;

        if (res.success) {
            setSuccessfulSave(true);
        }
    };

    return { saveSongs, successfulSave };
}
