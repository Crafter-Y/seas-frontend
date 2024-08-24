import { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
import { HistoryType } from "@/components/modules/music/MusicHistoryModal";
import { requestApi } from "@/helpers/api";
import { useState } from "react";

export default function useSongHistory() {
    const [historyResponse, setHistoryResponse] = useState<APIResponseHistoryEntry[]>([]);
    const [ratingResponse, setRatingResponse] = useState<APIResponseHistoryRatingEntry[]>([]);
    const [countResponse, setCountResponse] = useState<APIResponseHistoryCountEntry[]>([]);
    const [knownResponse, setKnownResponse] = useState<APIResponseSong[]>([]);

    const [totalRecords, setTotalRecords] = useState(0);

    const queryReports = async (searchType: MusicEntryType, historyType: HistoryType, page: number) => {

        if (historyType === "HISTORY") {
            const res = await requestApi("songs/reports", "POST", {
                page,
                type: historyType,
                origin: searchType
            });

            if (res?.success) {
                setHistoryResponse(res.data.rows);
                setTotalRecords(res.data.count);
            }

        }
        if (historyType === "GOOD" || historyType === "BAD") {
            const res = await requestApi("songs/reports", "POST", {
                page,
                type: historyType,
                origin: searchType
            });

            if (res?.success) {
                setRatingResponse(res.data.rows);
                setTotalRecords(res.data.count);
            }

        }

        if (historyType === "MIN" || historyType === "MAX") {
            const res = await requestApi("songs/reports", "POST", {
                page,
                type: historyType,
                origin: searchType
            });

            if (res?.success) {
                setCountResponse(res.data.rows);
                setTotalRecords(res.data.count);
            }

        }

        if (historyType === "KNOWN" || historyType === "UNKNOWN") {
            const res = await requestApi("songs/reports", "POST", {
                page,
                type: historyType,
                origin: searchType
            });

            if (res?.success) {
                setKnownResponse(res.data.rows);
                setTotalRecords(res.data.count);
            }

        }

    };

    return { queryReports, historyResponse, ratingResponse, countResponse, totalRecords, knownResponse };
}
