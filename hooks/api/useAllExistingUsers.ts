import { use, useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { AppContext } from "@/helpers/appContext";

export default function useAllExistingUsers() {
  const { allExistingUsers, setAllExistingUsers } = use(AppContext);

  const queryUsers = async () => {
    const res = await requestApi("users", "GET");
    if (res && res.success) {
      setAllExistingUsers(res.data.users);
    }
  };

  useEffect(() => {
    if (allExistingUsers.length === 0) queryUsers();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allExistingUsers, queryUsers };
}
