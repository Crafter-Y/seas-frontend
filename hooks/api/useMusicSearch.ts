import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useMusicSearch() {
    const [cachedSongs, setCachedSongs] = useState<APIResponseSong[]>([]);
    const [songs, setSongs] = useState<APIResponseSong[]>([]);


    const updateSongs = (search: string) => {
        const searchTerms = search
            .split(" ")
            .map((el) => el.toLowerCase())
            .filter((el) => el.length);

        const res: APIResponseSong[][] = [];
        cachedSongs.forEach(song => {
            const songTokens = song.title
                .split(" ")
                .map((el) => el.toLowerCase())
                .filter((el) => el.length);

            let matches = 0;

            searchTerms.forEach((term) => {
                songTokens.forEach((token) => {
                    if (term == token) {
                        matches += 5;
                    } else if (token.includes(term)) {
                        matches += 3;
                    } else if (term.includes(token)) matches++;
                });
            });
            if (res[matches] == undefined) {
                res[matches] = [
                    song
                ];
            } else {
                res[matches].push(song);
            }
        });
        res[0] = [];
        setSongs(res.flat().reverse());
    };

    const querySongs = async (search: string) => {
        search = search.trim();

        if (/^\d+$/.test(search)) {
            const idSongs = cachedSongs.filter(song => (song.id + "").includes(search)).sort((a, b) => a.id > b.id ? -1 : 1).sort((a) => a.id == Number(search) ? -1 : 1);
            setSongs(idSongs);
        } else {
            updateSongs(search);
        }
    };

    const queryCache = async () => {
        const res = await requestApi("songs", "GET");

        if (res && res.success) {
            setCachedSongs(res.data.songs);
        }
    };


    useEffect(() => {
        if (cachedSongs.length == 0) {
            queryCache();
        }
    }, []);

    return { songs, querySongs };
}
