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

    if (firstname == null || firstname == "") {
      setHasCreationError(true);
      setCreationError("Der Vorname muss angegeben werden.");
      return;
    }

    if (lastname == null || lastname == "") {
      setHasCreationError(true);
      setCreationError("Der Nachname muss angegeben werden.");
      return;
    }

    if (email == null || email == "") {
      setHasCreationError(true);
      setCreationError("Die Email muss angegeben werden.");
      return;
    }

    if (role == null || role == "") {
      setHasCreationError(true);
      setCreationError("Die Rolle muss angegeben werden.");
      return;
    }

    if (!firstname.match(/^[\w\d\s\-ÖÄÜßäöüß]{1,23}$/)) {
      setHasCreationError(true);
      setCreationError(
        'Der Vorname stimmt nicht mit den Kriterien überein. Kriterien: 1-23 Zeichen, Buchstaben, Zahlen, Leerzeichen und "-"'
      );
      return;
    }

    if (!lastname.match(/^[\w\d\s\-ÖÄÜßäöüß]{1,55}$/)) {
      setHasCreationError(true);
      setCreationError(
        'Der Nachname stimmt nicht mit den Kriterien überein. Kriterien: 1-55 Zeichen, Buchstaben, Zahlen, Leerzeichen und "-"'
      );
      return;
    }

    if (!validate(email)) {
      setHasCreationError(true);
      setCreationError("Die angegebene Email-Adresse ist nicht gültig.");
      return;
    }

    if (role !== "USER" && role !== "ADMIN" && role !== "MODERATOR") {
      setHasCreationError(true);
      setCreationError("Die angegebene Rolle ist nicht gültig.");
      return;
    }

    let res = await requestApi("users", "POST", {
      firstname,
      lastname,
      email,
      role
    })

    if (res == null) {
      setHasCreationError(true);
      setCreationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    if (res.success) {
      setIsSuccessfulUserCreation(true);
      setUserCreationResponse({
        firstname,
        lastname,
        email,
        password: res.data.password,
        role
      });
      setHasCreationError(false);
      setCreationError("");
    } else {
      if (res.data.error == "Reactivation required") {
        console.log("reactivation required here")
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
