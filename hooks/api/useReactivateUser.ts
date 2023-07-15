import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../useApiName";
import { ManageUsersScreenProps } from "@/screens/settings/ManageUsersScreen";
import { validate } from "email-validator";

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

  const getApi = useApi();

  const reactivateUser = (
    firstname: string,
    lastname: string,
    email: string,
    role: string,
    navigation: ManageUsersScreenProps
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

    let configServer = getApi();
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        navigation.replace("LoginScreen");
        return;
      }

      let req = new FormData();
      req.append("firstname", firstname);
      req.append("lastname", lastname);
      req.append("email", email);
      req.append("role", role);
      fetch(`${configServer}/api/reactivateUser/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setIsSuccessfulUserReactivation(true);
            setUserReactivationResponse(res.data);
            setHasReactivationError(false);
            setReactivationError("");
          } else {
            setHasReactivationError(true);
            setReactivationError(res.error.message);
          }
        })
        .catch(() => {
          setHasReactivationError(true);
          setReactivationError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
        });
    });
  };

  return {
    reactivateUser,
    hasReactivationError,
    reactivationError,
    successfulUserReactivation,
    userReactivationResponse,
  };
}
