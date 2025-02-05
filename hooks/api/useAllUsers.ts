import { useCallback, useEffect, useState } from "react";

import { requestApi } from "@/helpers/api";

export default function useAllUsers() {
  const [allUsers, setAllUsers] = useState<APIFullResponseUser[]>([]);

  const queryUsers = useCallback(async () => {
    const res = await requestApi("users/full", "GET");

    if (res && res.success) {
      setAllUsers(res.data.users);
    }
  }, []);

  useEffect(() => {
    queryUsers();
  }, [queryUsers]);

  return { allUsers, queryUsers };
}
