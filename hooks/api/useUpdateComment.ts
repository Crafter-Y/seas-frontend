import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { useState } from "react";
export default function useUpdateComment() {
    const [successfulUpdate, setSuccessfulUpdate] = useState(false);
    const getApi = useApi();

    const updateComment = (date: string, columnId: string, comment: string) => {
        setSuccessfulUpdate(false);
        let configServer = getApi();
        AsyncStorage.getItem("token").then((token) => {
            if (token == null) {
                return;
            }

            let req = new FormData();
            req.append("date", date);
            req.append("columnId", columnId);
            req.append("comment", comment);
            fetch(`${configServer}/api/updateComment/`, {
                method: "post",
                body: req,
                headers: {
                    token,
                },
            }).then(() => {
                setSuccessfulUpdate(true);
            });
        });
    };

    return { updateComment, successfulUpdate };
}
