import { useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useSetKnownState() {
  const [successfulChange, setSuccessfulChange] = useState(false);

  const setKnwonState = async (songId: number, state: boolean) => {
    setSuccessfulChange(false);

    await requestApi("songs/known", "PUT", {
      id: songId,
      state
    });

    setSuccessfulChange(true);
  };

  return { setKnwonState, successfulChange };
}
