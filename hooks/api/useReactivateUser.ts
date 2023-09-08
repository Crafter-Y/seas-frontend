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

export default function useReactivateUser() {
  const [hasReactivationError, setHasReactivationError] = useState(false);
  const [reactivationError, setReactivationError] = useState("");
  const [successfulUserReactivation, setIsSuccessfulUserReactivation] =
    useState(false);
  const [userReactivationResponse, setUserReactivationResponse] =
    useState<APICreationReponse>();

  const reactivateUser = async (
    firstname: string,
    lastname: string,
    email: string,
    role: string,
  ) => {
    // clientside validation

    setIsSuccessfulUserReactivation(false);

    if (firstname == null || firstname == "") {
      setHasReactivationError(true);
      setReactivationError("Der Vorname muss angegeben werden.");
      return;
    }

    if (lastname == null || lastname == "") {
      setHasReactivationError(true);
      setReactivationError("Der Nachname muss angegeben werden.");
      return;
    }

    if (email == null || email == "") {
      setHasReactivationError(true);
      setReactivationError("Die Email muss angegeben werden.");
      return;
    }

    if (role == null || role == "") {
      setHasReactivationError(true);
      setReactivationError("Die Rolle muss angegeben werden.");
      return;
    }

    if (!firstname.match(/^[\w\d\s\-ÖÄÜßäöüß]{1,23}$/)) {
      setHasReactivationError(true);
      setReactivationError(
        'Der Vorname stimmt nicht mit den Kriterien überein. Kriterien: 1-23 Zeichen, Buchstaben, Zahlen, Leerzeichen und "-"'
      );
      return;
    }

    if (!lastname.match(/^[\w\d\s\-ÖÄÜßäöüß]{1,55}$/)) {
      setHasReactivationError(true);
      setReactivationError(
        'Der Nachname stimmt nicht mit den Kriterien überein. Kriterien: 1-55 Zeichen, Buchstaben, Zahlen, Leerzeichen und "-"'
      );
      return;
    }

    if (!validate(email)) {
      setHasReactivationError(true);
      setReactivationError("Die angegebene Email-Adresse ist nicht gültig.");
      return;
    }

    if (role !== "USER" && role !== "ADMIN" && role !== "MODERATOR") {
      setHasReactivationError(true);
      setReactivationError("Die angegebene Rolle ist nicht gültig.");
      return;
    }

    let res = await requestApi("users", "PUT", {
      firstname,
      lastname,
      email,
      role
    })

    if (res == null) {
      setHasReactivationError(true);
      setReactivationError(
        "Server nicht verfügbar. Bitte später erneut versuchen."
      );
      return;
    }

    if (res.success) {
      setIsSuccessfulUserReactivation(true);
      setUserReactivationResponse(res.data.user);
      setHasReactivationError(false);
      setReactivationError("");
    } else {
      setHasReactivationError(true);
      setReactivationError(res.data.error);
    }
  };

  return {
    reactivateUser,
    hasReactivationError,
    reactivationError,
    successfulUserReactivation,
    userReactivationResponse,
  };
}
