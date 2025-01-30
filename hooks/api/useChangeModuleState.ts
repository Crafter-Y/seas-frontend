import { requestApi } from "@/helpers/api";
import { useState } from "react";

export default function useChangeModuleState() {
  const [changeSuccessful, setChangeSuccessful] = useState(false);

  const changeModuleState = async (module: Module, state: boolean) => {
    setChangeSuccessful(false);

    const res = await requestApi("modules", "PUT", {
      module,
      state,
    });
    if (res && res.success) {
      setChangeSuccessful(true);
    }
  };

  return { changeSuccessful, changeModuleState };
}
