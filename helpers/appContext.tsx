// inspired by https://www.youtube.com/watch?v=yNaOaR2kIa0

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import { SplashScreen, useRouter } from "expo-router";
import { InvalidTokenError, jwtDecode as decode } from "jwt-decode";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

import { requestApi, requestApiWithoutCredentials } from "@/helpers/api";
// import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
// import { Rating } from "@/components/elements/Ratings";
// import { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
// import { FetchState } from "@/helpers/Constants";

// type RatedSong = APIResponseSong & { rating: Rating; comment?: string };

SplashScreen.preventAutoHideAsync();

type AppState = {
  //   currentPage: number;
  //   allPages: APIResponsePage[];
  //   allColumns: APIResponseColumn[];
  //   selectedRow?: BoardRow;

  //   board: BoardRow[];
  //   boardLoading: boolean;

  //   allExistingUsers: APIResponseUser[];
  user: User | null;
  //   moduleStatus: APIModuleStatus | null;
  //   allDefaultComments: APIResponseDefaultComment[];
  //   lastQueryFrom: Date | null;
  //   lastQueryTo: Date | null;

  serverId: string | null;
  serverName: string | null;
  //   serverNameState: FetchState;
  serverDevUrl: string;

  //   printDateStart: Date | null;
  //   printDateEnd: Date | null;
  //   printColumns: number[];

  //   musicEntryType?: MusicEntryType;
  //   musicDate?: CalendarDate;
  //   musicSongSelected?: APIResponseSong;
  //   musicRatings: RatedSong[];

  //   restrictions?: APIRestrictions;

  isReady: boolean;
  loginError: string | null;
  selectServerError: string | null;
  logout: () => Promise<void>;
  setDevUrl: (url: string) => void;
  returnToServerSelection: () => void;
  login: (email: string, password: string) => void;
  selectServer: (serverId: string) => void;
};

export const AppContext = createContext<AppState>({
  //   currentPage: 0,
  //   allPages: [],
  //   allColumns: [],

  //   board: [],
  //   boardLoading: false,

  //   allExistingUsers: [],
  user: null,
  //   moduleStatus: null,
  //   allDefaultComments: [],
  //   lastQueryFrom: null,
  //   lastQueryTo: null,

  serverId: null,
  serverName: null,
  //   serverNameState: FetchState.UNFETCHED,
  serverDevUrl: "http://api.localhost",

  //   printDateStart: null,
  //   printDateEnd: null,
  //   printColumns: [],

  //   musicRatings: [],
  isReady: false,
  loginError: null,
  selectServerError: null,
  logout: async () => {},
  setDevUrl: async (_url: string) => {},
  returnToServerSelection: () => {},
  login: (_email: string, _password: string) => {},
  selectServer: (_serverId: string) => {},
});

const SERVER_ID_KEY = "serverId";
const TOKEN_KEY = "token";
const DEV_URL_KEY = "devServerURL";

export function AppProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [serverId, setServerId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [serverDevUrl, setServerDevUrl] = useState<string>(
    "http://api.localhost",
  );
  const [serverName, setServerName] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectServerError, setSelectServerError] = useState<string | null>(
    null,
  );

  const { t } = useTranslation();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoginError(null);

    email = email.trim();
    password = password.trim();

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
        await AsyncStorage.setItem("token", res.data.token);
        await populateUserData(res.data.token);

        router.replace("/");
      } else {
        if (typeof res.data.error === "string") {
          setLoginError(res.data.error + "");
        } else {
          setLoginError("Ungültige Eingaben");
        }
      }
    } catch (e) {
      setLoginError(e + "");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);

    // const stateBefore = Store.getRawState();
    // Store.update((state) => {
    //   Object.assign(state, defaultState);
    //   state.serverDevUrl = stateBefore.serverDevUrl;
    //   state.serverName = stateBefore.serverName;
    // });
    setUser(null);

    // wiredly, on ios, the replace crashes the app.
    // I disabled the back gesture on the login screen for ios, so there should be nothing that could go wrong
    // if (Platform.OS === "ios") {
    //   router.navigate("/login");
    // } else {
    //   router.replace("/login");
    // }
    router.replace("/login");
  };

  const setDevUrl = async (url: string) => {
    await AsyncStorage.setItem(DEV_URL_KEY, url);
    setServerDevUrl(url);
  };

  const populateUserData = async (token: string | null) => {
    if (token !== null) {
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

        if (new Date().getTime() / 1000 > tokenContents.exp) {
          AsyncStorage.removeItem("token");
        } else {
          const res = await requestApi("auth/validate", "GET");
          if (res && res.success) {
            setUser({
              id: tokenContents.userId,
              firstname: tokenContents.firstname,
              lastname: tokenContents.lastname,
              email: tokenContents.email,
              role: tokenContents.role,
            });
          }
        }
      } catch (error) {
        const er = error as InvalidTokenError;
        console.error("Decoding JWT failed: ", er.message);
        await AsyncStorage.removeItem("token");
      }
    }
  };

  const returnToServerSelection = async () => {
    if (Platform.OS === "web") {
      console.error("returnToServerSelection shall never be called on web");
      return;
    }
    await AsyncStorage.removeItem(SERVER_ID_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
    setServerId(null);
    setUser(null);
    setServerName(null);
    router.replace("/serverselection");
  };

  const selectServer = async (id: string) => {
    setSelectServerError(null);

    try {
      const res = await requestApiWithoutCredentials(`products/${id}`, "GET");

      if (res.success) {
        await AsyncStorage.setItem(SERVER_ID_KEY, id);
        setServerId(id);
        setServerName(res.data.name);

        router.replace("/login");
      } else {
        setSelectServerError(res.data.error);
      }
    } catch (e) {
      setSelectServerError(e + "");
    }
  };

  useEffect(() => {
    const asyncInit = async () => {
      console.log("AppProvider: Initializing...");
      try {
        // restoring dev URL
        if (__DEV__) {
          let devUrl = await AsyncStorage.getItem(DEV_URL_KEY);
          if (devUrl !== null) {
            console.log("restoring dev URL: " + devUrl);
            setServerDevUrl(devUrl);
          }
        }

        // loading serverId
        let serverIdStorage = await AsyncStorage.getItem(SERVER_ID_KEY);
        if (serverIdStorage !== null) {
          setServerId(serverIdStorage);
        } else if (Platform.OS === "web") {
          // For web, we can fetch the server ID from a config file
          const response = await fetch("/config.json");
          const config = await response.json();
          if (config.serverId) {
            serverIdStorage = config.serverId;
            setServerId(config.serverId);
            await AsyncStorage.setItem(SERVER_ID_KEY, config.serverId);
          }
        }
        // loading corresponding server name
        if (serverIdStorage !== null) {
          const res = await requestApiWithoutCredentials(
            `products/${serverIdStorage}`,
            "GET",
          );
          if (res.success) {
            setServerName(res.data.name);
          } else {
            router.replace("/login");
          }
        }

        // loading user session
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        await populateUserData(token);

        // loading fonts
        try {
          await Font.loadAsync({
            Roboto: require("@/assets/fonts/Roboto.ttf"),
          });
        } catch (e) {
          console.warn(e);
          Toast.show({
            type: "error",
            text1: t("error.fontLoadingFailed"),
            text2: t("error.fontCouldNotBeFound", { font: "Roboto" }),
          });
        } finally {
          SplashScreen.hideAsync();
        }

        // .......
      } catch (error) {
        console.error("Error fetching from storage", error);
      }
      setIsReady(true);
    };

    asyncInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AppContext.Provider
      value={{
        serverId,
        user,
        serverDevUrl,
        isReady,
        serverName,
        loginError,
        selectServerError,
        logout,
        setDevUrl,
        returnToServerSelection,
        login,
        selectServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
