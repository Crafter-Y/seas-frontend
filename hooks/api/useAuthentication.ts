import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { jwtDecode as decode, InvalidTokenError } from "jwt-decode";
import { requestApi, requestApiWithoutCredentials } from "@/helpers/api";
import { defaultState, Store } from "@/helpers/store";
import { router } from "expo-router";

export default function useAuthentication() {
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authError, setAuthError] = useState("");

  const user = Store.useState((state) => state.user);

  const logout = async () => {
    await AsyncStorage.removeItem("token");

    const currentDevUrl = Store.getRawState().serverDevUrl;
    Store.update((state) => {
      Object.assign(state, defaultState);
      state.serverDevUrl = currentDevUrl;
    });

    // wiredly, on ios, the replace crashes the app.
    // I disabled the back gesture on the login screen for ios, so there should be nothing that could go wrong
    if (Platform.OS === "ios") {
      router.navigate("/login");
    } else {
      router.replace("/login");
    }
  };

  const login = async (email: string, password: string) => {
    setHasAuthError(false);
    setAuthError("");

    email = email.trim();
    password = password.trim();

    const serverId = await AsyncStorage.getItem("serverId");
    if (serverId === null) {
      router.replace("/");
      return;
    }

    try {
      const res = await requestApiWithoutCredentials(
        `auth/${serverId}`,
        "POST",
        {
          email,
          password,
          expiration: Platform.OS === "web" ? "short" : "long",
        },
      );

      if (res.success) {
        AsyncStorage.setItem("token", res.data.token).then(() => {
          populateUserData();
        });
      } else {
        if (typeof res.data.error === "string") {
          setAuthError(res.data.error + "");
        } else {
          setAuthError("Ungültige Eingaben");
        }

        setHasAuthError(true);
      }
    } catch (e) {
      setAuthError(e + "");
      setHasAuthError(true);
    }
  };

  const populateUserData = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token === null || token === undefined) {
      return;
    }

    let tokenContents: {
      productId: number;
      userId: number;
      email: string;
      firstname: string;
      lastname: string;
      role: Role;
      exp: number;
    };

    try {
      tokenContents = decode(token);
    } catch (error) {
      const er = error as InvalidTokenError;
      console.error(er.message);
      await AsyncStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    if (new Date().getTime() / 1000 > tokenContents.exp) {
      AsyncStorage.removeItem("token");
      return;
    }

    const res = await requestApi("auth/validate", "GET");
    if (!res || !res.success) return;

    Store.update((state) => {
      state.user = {
        id: tokenContents.userId,
        firstname: tokenContents.firstname,
        lastname: tokenContents.lastname,
        email: tokenContents.email,
        role: tokenContents.role,
      };
    });
    setHasAuthError(false);
  };

  useEffect(() => {
    if (!user) populateUserData();
    // TODO: implement proper just fetch once functionality
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    login,
    logout,
    hasAuthError,
    authError,
    user,
  };
}
