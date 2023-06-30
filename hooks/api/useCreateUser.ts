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

export default function useCreateUser() {
  const [hasCreationError, setHasCreationError] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [successfulUserCreation, setIsSuccessfulUserCreation] = useState(false);
  const [userCreationResponse, setUserCreationResponse] =
    useState<APICreationReponse>();

  const getApi = useApi();

  const createUser = (
    firstname: string,
    lastname: string,
    email: string,
    role: string,
    navigation: ManageUsersScreenProps
  ) => {
    // clientside validation

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
      fetch(`${configServer}/api/createUser/`, {
        method: "post",
        body: req,
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setIsSuccessfulUserCreation(true);
            setUserCreationResponse(res.data);
            setHasCreationError(false);
            setCreationError("");
          } else {
            setHasCreationError(true);
            setCreationError(res.error.message);
          }
        })
        .catch(() => {
          setHasCreationError(true);
          setCreationError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
        });
    });
  };

  return {
    createUser,
    hasCreationError,
    creationError,
    successfulUserCreation,
    userCreationResponse,
  };
}
