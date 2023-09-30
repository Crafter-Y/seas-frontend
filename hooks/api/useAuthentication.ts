import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import decode from "jwt-decode";
import { requestApi, requestApiWithoutCredentials } from "@/helpers/api";
import { Router } from "expo-router/build/types";
import { Store } from "@/helpers/store";

export default function useAuthentication() {
  const [hasAuthError, setHasAuthError] = useState(false);
  const [authError, setAuthError] = useState("");

  const user = Store.useState(state => state.user);

  const logout = async (router: Router) => {
    await AsyncStorage.removeItem("token");
    Store.update(state => { state.user = null; });
    router.replace("/login");
  };

  const login = async (
    email: string,
    password: string,
    router: Router
  ) => {
    setHasAuthError(false);
    setAuthError("");

    const serverId = await AsyncStorage.getItem("serverId");
    if (serverId == null) {
      router.replace("/");
      return;
    }

    try {
      const res = await requestApiWithoutCredentials(`auth/${serverId}`, "POST", {
        email,
        password,
        expiration: Platform.OS == "web" ? "short" : "long"
      });

      if (res.success) {
        AsyncStorage.setItem("token", res.data.token).then(() => {
          populateUserData();
        });
      } else {
        setAuthError(res.data.error);
        setHasAuthError(true);
      }
    } catch (e) {
      setAuthError(e + "e");
      setHasAuthError(true);
    }

  };

  const populateUserData = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token == null || token == undefined) {
      return;
    }

    const tokenContents: {
      productId: number,
      userId: number,
      email: string,
      firstname: string,
      lastname: string,
      role: Role,
      exp: number
    } = decode(token);

    if (new Date().getTime() / 1000 > tokenContents.exp) {
      AsyncStorage.removeItem("token");
      return;
    }

    const res = await requestApi("auth/validate", "GET");
    if (!res || !res.success) return;

    Store.update(state => {
      state.user = {
        id: tokenContents.userId,
        firstname: tokenContents.firstname,
        lastname: tokenContents.lastname,
        email: tokenContents.email,
        role: tokenContents.role
      };
    });
    setHasAuthError(false);
  };

  useEffect(() => {
    if (!user) populateUserData();
  }, []);

  return {
    login,
    logout,
    hasAuthError,
    authError,
    user,
  };
}
