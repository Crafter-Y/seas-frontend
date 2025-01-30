import { useState } from "react";
import { requestApi } from "@/helpers/api";
import { validateUser } from "./useCreateUser";
export default function useUpdateUser() {
  const [successfulUpdate, setSuccessfulUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateUser = async (
    userId: number,
    firstname: string,
    lastname: string,
    email: string,
    role: Role,
  ) => {
    setSuccessfulUpdate(false);
    setUpdateError(null);

    const validationResponse = validateUser(firstname, lastname, email, role);
    if (validationResponse !== null) {
      setUpdateError(validationResponse);
      setSuccessfulUpdate(false);
      return;
    }

    const res = await requestApi(`users/${userId}`, "PATCH", {
      firstname,
      lastname,
      email,
      role,
    });

    if (res === null) {
      setSuccessfulUpdate(false);
      setUpdateError("Server nicht verfügbar. Bitte später erneut versuchen.");
      return;
    }

    if (!res.success) {
      setSuccessfulUpdate(false);
      setUpdateError("Schema validation failed.");
      return;
    }

    setSuccessfulUpdate(true);
  };

  return { updateUser, successfulUpdate, updateError };
}
