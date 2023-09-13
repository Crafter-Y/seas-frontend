import { useState } from "react";
import { requestApi } from "@/helpers/api";
export default function useUpdateComment() {
    const [successfulUpdate, setSuccessfulUpdate] = useState(false);

    const updateComment = async (date: string, columnId: number, comment: string) => {
        setSuccessfulUpdate(false);
        await requestApi("board/comments", "PUT", {
            date,
            columnId,
            text: comment
        })

        setSuccessfulUpdate(true);

    };

    return { updateComment, successfulUpdate };
}
