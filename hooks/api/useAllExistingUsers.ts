import { useEffect } from "react";

import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useAllExistingUsers() {
  const allExistingUsers = Store.useState((state) => state.allExistingUsers);

  const queryUsers = async () => {
    const res = await requestApi("users", "GET");
    if (res && res.success) {
      Store.update((state) => {
        state.allExistingUsers = res?.data.users;
      });
    }
  };

  useEffect(() => {
    if (allExistingUsers.length === 0) queryUsers();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allExistingUsers, queryUsers };
}
