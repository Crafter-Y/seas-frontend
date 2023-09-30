import { useEffect } from "react";
import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useAllExistingUsers() {
  const allExistingUsers = Store.useState(state => state.allExistingUsers);

  const queryUsers = async () => {
    const res = await requestApi("users", "GET");
    if (res && res.success) {
      Store.update(state => { state.allExistingUsers = res?.data.users; });
    }
  };

  useEffect(() => {
    if (allExistingUsers.length == 0) queryUsers();
  }, []);

  return { allExistingUsers, queryUsers };
}
