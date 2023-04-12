import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginScreenProps } from "../screens/LoginScreen";
import Constants from "expo-constants";
import { Platform } from "react-native";

export default function useAuthentication() {
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const login = (
    email: string,
    password: string,
    navigation: LoginScreenProps
  ) => {
    setIsAuthenticating(true);
    setHasAuthError(false);
    setAuthError("");
    setAuthenticated(false);
    setUser(null);

    let configServer: string = Constants.expoConfig?.extra?.apiServer;
    AsyncStorage.getItem("serverId").then((serverId) => {
      if (serverId == null) {
        setIsAuthenticating(false);
        navigation.replace("ServerSelectorScreen");
        return;
      }

      let req = new FormData();
      req.append("email", email);
      req.append("password", password);
      req.append("expiration", Platform.OS == "web" ? "short" : "long");
      fetch(`${configServer}/api/authenticate/${serverId}`, {
        method: "post",
        body: req,
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            AsyncStorage.setItem("token", res.data.token).then(() => {
              populateUserData();
            });
          } else {
            setAuthError(res.error.message);
            setHasAuthError(true);
          }
        })
        .catch(() => {
          setAuthError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
          setHasAuthError(true);
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    });
  };

  const populateUserData = () => {
    AsyncStorage.getItem("token").then((token) => {
      if (token == null) {
        setIsAuthenticating(false);
        return;
      }

      let configServer: string = Constants.expoConfig?.extra?.apiServer;

      fetch(`${configServer}/api/getCurrentUserInfo/`, {
        headers: {
          token,
        },
      })
        .then((response) => response.json())
        .then((res: ApiResponse) => {
          if (res.success) {
            setAuthenticated(true);
            setUser(res.data.user);
          } else {
            setAuthError(res.error.message);
            setHasAuthError(true);
          }
        })
        .catch(() => {
          setAuthError(
            "Server nicht verfügbar. Bitte später erneut versuchen."
          );
          setHasAuthError(true);
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    });
  };

  useEffect(() => {
    populateUserData();
  }, []);

  return {
    login,
    isAuthenticating,
    hasAuthError,
    authError,
    isAuthenticated,
    user,
  };
}
