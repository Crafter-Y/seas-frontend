import { useCallback, useState } from "react";

import { requestApi } from "@/helpers/api";

const validateSong = (number: string, title: string) => {
  if (!number || number.length === 0) return "Eine Liednummer angegeben werden";

  if (number.length > 64)
    return "Die Liednummer darf nicht länger als 64 Zeichen sein.";

  if (!title || title.length === 0) return "Es muss ein Titel angegeben werden";
  if (title.length > 64)
    return "Der Titel darf nicht länger als 64 Zeichen sein.";

  return null;
};

export default function useSongbook() {
  const [songs, setSongs] = useState<APIResponseSongbookSong[]>([]);
  const [editable, setEditable] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const querySongbook = useCallback(async (songbookId: number) => {
    const res = await requestApi(`songs/songbooks/${songbookId}`, "GET");

    if (res && res.success) {
      setSongs(res.data.songs);
      setEditable(res.data.editable);
    }
  }, []);

  const createSong = useCallback(
    async (number: string, title: string, songbookId: number) => {
      const validate = validateSong(number, title);
      if (validate !== null) {
        setCreationError(validate);
        return false;
      }

      const res = await requestApi("songs", "POST", {
        number,
        title,
        songbookId,
      });

      if (res === null) {
        setCreationError(
          "Server nicht verfügbar. Bitte später erneut versuchen.",
        );
        return false;
      }

      if (res.success) {
        setCreationError(null);
        await querySongbook(songbookId);
        return true;
      } else {
        setCreationError(res.data.error);
        return false;
      }
    },
    [querySongbook],
  );

  const editSong = useCallback(
    async (id: number, title: string, number: string) => {
      const validate = validateSong(number, title);
      if (validate !== null) {
        setEditError(validate);
        return false;
      }

      const res = await requestApi(`songs/${id}`, "PATCH", {
        number,
        title,
      });

      if (!res) {
        setEditError("Server nicht verfügbar. Bitte später erneut versuchen.");
        return false;
      }

      if (res.success) {
        setEditError(null);
        return true;
      } else {
        setEditError(res.data.error);
      }
    },
    [],
  );

  const deleteSong = useCallback(async (id: number) => {
    // TODO: Add error handling
    await requestApi(`songs/${id}`, "DELETE");
    return true;
  }, []);

  const setKnownState = useCallback(async (songId: number, state: boolean) => {
    //TODO: Add error handling
    await requestApi("songs/known", "PUT", {
      id: songId,
      state,
    });

    return true;
  }, []);

  return {
    songs,
    querySongbook,
    editable,
    createSong,
    creationError,
    editSong,
    editError,
    deleteSong,
    setKnownState,
  };
}
