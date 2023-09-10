import { useEffect, useState } from "react";
import { requestApi } from "@/helpers/api";

export default function useAllExistingUsers() {
  const [allExistingUsers, setAllUsers] = useState<APIResponseUser[]>([]);

  const queryUsers = async () => {
    let res = await requestApi("users", "GET")
    if (res && res.success) {
      setAllUsers(res.data.users);
    }
  };

  useEffect(() => {
    queryUsers();
  }, []);

  return { allExistingUsers, queryUsers };
}
