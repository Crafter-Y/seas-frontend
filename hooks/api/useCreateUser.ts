import { useState } from "react";
import { validate } from "email-validator";
import { requestApi } from "@/helpers/api";

type APICreationReponse = {
  firstname: string;
  lastname: string;
  email: string;
  role: "ADMIN" | "USER" | "MODERATOR";
  password: string;
};

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

  if (role !== "USER" && role !== "ADMIN" && role !== "MODERATOR") return "Die angegebene Rolle ist nicht gültig.";

  return null;
};

export default function useCreateUser() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulUserCreation, setIsSuccessfulUserCreation] = useState(false);
  const [reactivationRequired, setReactivationRequired] = useState(false);
  const [userCreationResponse, setUserCreationResponse] =
    useState<APICreationReponse>();

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
      role
    });

    if (res == null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    const setRole = role as Role;

    if (res.success) {
      setIsSuccessfulUserCreation(true);
      setUserCreationResponse({
        firstname,
        lastname,
        email,
        password: res.data.password,
        role: setRole
      });
      setHasCreationError(false);
      setCreationError("");
    } else {
      if (res.data.error == "Reactivation required") {
        console.log("reactivation required here");
        setHasCreationError(false);
        setCreationError("");
        setReactivationRequired(true);
        return;
      }

      setHasCreationError(true);
      setCreationError(res.data.error);
    }

  };

  return {
    createUser,
    hasCreationError,
    creationError,
    successfulUserCreation,
    userCreationResponse,
    reactivationRequired,
  };
}
