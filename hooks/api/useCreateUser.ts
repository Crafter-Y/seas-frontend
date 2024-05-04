import { useState } from "react";
import { validate } from "email-validator";
import { getWebServer, requestApi } from "@/helpers/api";

export const validateUser = (
  firstname: string,
  lastname: string,
  email: string,
  role: string
): string | null => {
  if (firstname == null || firstname == "") return "Der Vorname muss angegeben werden.";

  if (lastname == null || lastname == "") return "Der Nachname muss angegeben werden.";

  if (email == null || email == "") return "Die Email muss angegeben werden.";

  if (role == null || role == "") return "Die Rolle muss angegeben werden.";

  if (!firstname.match(/^[\w\d\s\-ÖÄÜßäöüß]{1,23}$/)) return "Der Vorname stimmt nicht mit den Kriterien überein. Kriterien: 1-23 Zeichen, Buchstaben, Zahlen, Leerzeichen und \"-\"";

  if (!lastname.match(/^[\w\d\s\-ÖÄÜßäöüß]{1,55}$/)) return "Der Nachname stimmt nicht mit den Kriterien überein. Kriterien: 1-55 Zeichen, Buchstaben, Zahlen, Leerzeichen und \"-\"";

  if (!validate(email)) return "Die angegebene Email-Adresse ist nicht gültig.";

  if (role !== "USER" && role !== "ADMIN") return "Die angegebene Rolle ist nicht gültig.";

  return null;
};

export default function useCreateUser() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulUserCreation, setIsSuccessfulUserCreation] = useState(false);
  const [reactivationRequired, setReactivationRequired] = useState(false);

  const [successfulUserReactivation, setIsSuccessfulUserReactivation] =
    useState(false);

  const createUser = async (
    firstname: string,
    lastname: string,
    email: string,
    role: string,
  ) => {
    // clientside validation

    setIsSuccessfulUserCreation(false);
    setReactivationRequired(false);

    const validationResponse = validateUser(firstname, lastname, email, role);
    if (validationResponse != null) {
      setCreationError(validationResponse);
      setHasCreationError(true);
      return;
    }

    const res = await requestApi("users", "POST", {
      firstname,
      lastname,
      email,
      role,
      url: await getWebServer()
    });

    if (res == null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    if (res.success) {
      setIsSuccessfulUserCreation(true);
      setHasCreationError(false);
      setCreationError("");
    } else {
      if (res.data.error == "Reactivation required") {
        setHasCreationError(false);
        setCreationError("");
        setReactivationRequired(true);
        return;
      }

      setHasCreationError(true);
      setCreationError(res.data.error);
    }
  };


  const reactivateUser = async (
    firstname: string,
    lastname: string,
    email: string,
    role: string,
  ) => {
    // clientside validation

    setIsSuccessfulUserReactivation(false);

    const validationResponse = validateUser(firstname, lastname, email, role);
    if (validationResponse != null) {
      setCreationError(validationResponse);
      setHasCreationError(true);
      return;
    }

    const res = await requestApi("users", "POST", {
      firstname,
      lastname,
      email,
      role,
      reactivate: true,
      url: await getWebServer()
    });

    if (res == null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    if (res.success) {
      setIsSuccessfulUserReactivation(true);

      setHasCreationError(false);
      setCreationError("");
    } else {
      setHasCreationError(true);
      setCreationError(res.data.error);
    }
  };

  return {
    createUser,
    reactivateUser,
    hasCreationError,
    creationError,
    successfulUserCreation,
    successfulUserReactivation,
    reactivationRequired,
  };
}
