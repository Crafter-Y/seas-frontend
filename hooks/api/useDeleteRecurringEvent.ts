import { useState } from "react";
import { requestApi } from "@/helpers/api";
export default function useDeleteRecurringEvent() {
  const [successfulDelete, setSuccessfulDelete] = useState(false);

  const deleteRecurringEvent = async (
    taskId: number,
    type: "YEARLY" | "MONTHLY" | "WEEKLY",
  ) => {
    setSuccessfulDelete(false);

    let res: ApiResponse | null = null;
    switch (type) {
      case "MONTHLY": {
        res = await requestApi(`events/monthly/${taskId}`, "DELETE");
        break;
      }
      case "WEEKLY": {
        res = await requestApi(`events/weekly/${taskId}`, "DELETE");
        break;
      }
      case "YEARLY": {
        res = await requestApi(`events/yearly/${taskId}`, "DELETE");
        break;
      }
    }
    if (res && res.success) setSuccessfulDelete(true);
  };

  return { deleteRecurringEvent, successfulDelete };
}
