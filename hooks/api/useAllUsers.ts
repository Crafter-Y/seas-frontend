import { useEffect, useState } from "react";

import { requestApi } from "@/helpers/api";

export default function useAllUsers() {
  const [allUsers, setAllUsers] = useState<APIFullResponseUser[]>([]);

  const queryUsers = async () => {
    const res = await requestApi("users/full", "GET");

    if (res && res.success) {
      setAllUsers(res.data.users);
    }
  };

  useEffect(() => {
    queryUsers();
  }, []);

  return { allUsers, queryUsers };
}
