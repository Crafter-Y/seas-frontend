import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginScreenProps } from "@/screens/LoginScreen";
import { Platform } from "react-native";
import useApi from "../useApiName";
import { BoardScreenProps } from "@/screens/BoardScreen";
import decode from "jwt-decode";

export default function useAuthentication() {
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authError, setAuthError] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const getApi = useApi();

  const logout = (navigation: BoardScreenProps) => {
    AsyncStorage.removeItem("token").then(() => {
      setUser(null);
      navigation.replace("LoginScreen");
    });
  };

  const login = (
    email: string,
    password: string,
    navigation: LoginScreenProps
  ) => {
    setHasAuthError(false);
    setAuthError("");

    let configServer = getApi();
    AsyncStorage.getItem("serverId").then((serverId) => {
      if (serverId == null) {
        navigation.replace("ServerSelectorScreen");
        return;
      }

      fetch(`${configServer}/api/v1/auth/${serverId}`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          expiration: Platform.OS == "web" ? "short" : "long"
        }),
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            AsyncStorage.setItem("token", res.data.token).then(() => {
              populateUserData();
            });
          } else {
            setAuthError(res.data.error);
            setHasAuthError(true);
          }
        })
        .catch(() => {
          setAuthError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
          setHasAuthError(true);
        });
    });
  };

  const populateUserData = () => {
    AsyncStorage.getItem("token").then((token) => {
      if (token == null || token == undefined) {
        return;
      }

      let tokenContents: {
        productId: number,
        userId: number,
        email: string,
        firstname: string,
        lastname: string,
        role: Role,
        exp: number
      } = decode(token)

      if (new Date().getTime() / 1000 > tokenContents.exp) {
        AsyncStorage.removeItem("token");
        return;
      }

      setUser({
        userId: tokenContents.userId,
        firstname: tokenContents.firstname,
        lastname: tokenContents.lastname,
        email: tokenContents.email,
        role: tokenContents.role
      })
      setHasAuthError(false);
    });
  };

  useEffect(() => {
    populateUserData();
  }, []);

  return {
    login,
    logout,
    hasAuthError,
    authError,
    user,
  };
}
