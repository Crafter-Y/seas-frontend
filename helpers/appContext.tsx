// inspired by https://www.youtube.com/watch?v=yNaOaR2kIa0

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Font from "expo-font";
import { SplashScreen, useRouter } from "expo-router";
import { InvalidTokenError, jwtDecode as decode } from "jwt-decode";
import { createContext, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

import {
  registerUnauthorizedHandler,
  requestApi,
  requestApiWithoutCredentials,
} from "@/helpers/api";

import type { Rating } from "@/components/elements/Ratings";
import type { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import type { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

export type RatedSong = APIResponseSong & {
  rating: Rating;
  comment?: string;
};

SplashScreen.preventAutoHideAsync();

type AppState = {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  allPages: APIResponsePage[];
  setAllPages: Dispatch<SetStateAction<APIResponsePage[]>>;
  allColumns: APIResponseColumn[];
  setAllColumns: Dispatch<SetStateAction<APIResponseColumn[]>>;
  selectedRow: BoardRow | undefined;
  setSelectedRow: Dispatch<SetStateAction<BoardRow | undefined>>;
  board: BoardRow[];
  setBoard: Dispatch<SetStateAction<BoardRow[]>>;
  boardLoading: boolean;
  setBoardLoading: Dispatch<SetStateAction<boolean>>;
  allExistingUsers: APIResponseUser[];
  setAllExistingUsers: Dispatch<SetStateAction<APIResponseUser[]>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  moduleStatus: APIModuleStatus | null;
  setModuleStatus: Dispatch<SetStateAction<APIModuleStatus | null>>;
  allDefaultComments: APIResponseDefaultComment[];
  setAllDefaultComments: Dispatch<SetStateAction<APIResponseDefaultComment[]>>;
  lastQueryFrom: Date | null;
  setLastQueryFrom: Dispatch<SetStateAction<Date | null>>;
  lastQueryTo: Date | null;
  setLastQueryTo: Dispatch<SetStateAction<Date | null>>;

  serverId: string | null;
  serverName: string | null;
  serverDevUrl: string;

  printDateStart: Date | null;
  setPrintDateStart: Dispatch<SetStateAction<Date | null>>;
  printDateEnd: Date | null;
  setPrintDateEnd: Dispatch<SetStateAction<Date | null>>;
  printColumns: number[];
  setPrintColumns: Dispatch<SetStateAction<number[]>>;

  musicEntryType: MusicEntryType | undefined;
  setMusicEntryType: Dispatch<SetStateAction<MusicEntryType | undefined>>;
  musicDate: CalendarDate;
  setMusicDate: Dispatch<SetStateAction<CalendarDate>>;
  musicSongSelected: APIResponseSong | undefined;
  setMusicSongSelected: Dispatch<SetStateAction<APIResponseSong | undefined>>;
  musicRatings: RatedSong[];
  setMusicRatings: Dispatch<SetStateAction<RatedSong[]>>;

  restrictions: APIRestrictions | undefined;
  setRestrictions: Dispatch<SetStateAction<APIRestrictions | undefined>>;

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
  currentPage: 0,
  setCurrentPage: () => {},
  allPages: [],
  setAllPages: () => {},
  allColumns: [],
  setAllColumns: () => {},
  selectedRow: undefined,
  setSelectedRow: () => {},
  board: [],
  setBoard: () => {},
  boardLoading: false,
  setBoardLoading: () => {},
  allExistingUsers: [],
  setAllExistingUsers: () => {},
  user: null,
  setUser: () => {},
  moduleStatus: null,
  setModuleStatus: () => {},
  allDefaultComments: [],
  setAllDefaultComments: () => {},
  lastQueryFrom: null,
  setLastQueryFrom: () => {},
  lastQueryTo: null,
  setLastQueryTo: () => {},

  serverId: null,
  serverName: null,
  serverDevUrl: "http://api.localhost",

  printDateStart: null,
  setPrintDateStart: () => {},
  printDateEnd: null,
  setPrintDateEnd: () => {},
  printColumns: [],
  setPrintColumns: () => {},

  musicEntryType: undefined,
  setMusicEntryType: () => {},
  musicDate: undefined,
  setMusicDate: () => {},
  musicSongSelected: undefined,
  setMusicSongSelected: () => {},
  musicRatings: [],
  setMusicRatings: () => {},

  restrictions: undefined,
  setRestrictions: () => {},
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
  const [currentPage, setCurrentPage] = useState(0);
  const [allPages, setAllPages] = useState<APIResponsePage[]>([]);
  const [allColumns, setAllColumns] = useState<APIResponseColumn[]>([]);
  const [selectedRow, setSelectedRow] = useState<BoardRow>();
  const [board, setBoard] = useState<BoardRow[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [allExistingUsers, setAllExistingUsers] = useState<APIResponseUser[]>(
    [],
  );
  const [serverId, setServerId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [moduleStatus, setModuleStatus] = useState<APIModuleStatus | null>(
    null,
  );
  const [allDefaultComments, setAllDefaultComments] = useState<
    APIResponseDefaultComment[]
  >([]);
  const [lastQueryFrom, setLastQueryFrom] = useState<Date | null>(null);
  const [lastQueryTo, setLastQueryTo] = useState<Date | null>(null);
  const [serverDevUrl, setServerDevUrl] = useState<string>(
    "http://api.localhost",
  );
  const [serverName, setServerName] = useState<string | null>(null);
  const [printDateStart, setPrintDateStart] = useState<Date | null>(null);
  const [printDateEnd, setPrintDateEnd] = useState<Date | null>(null);
  const [printColumns, setPrintColumns] = useState<number[]>([]);
  const [musicEntryType, setMusicEntryType] = useState<MusicEntryType>();
  const [musicDate, setMusicDate] = useState<CalendarDate>();
  const [musicSongSelected, setMusicSongSelected] = useState<APIResponseSong>();
  const [musicRatings, setMusicRatings] = useState<RatedSong[]>([]);
  const [restrictions, setRestrictions] = useState<APIRestrictions>();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectServerError, setSelectServerError] = useState<string | null>(
    null,
  );

  const { t } = useTranslation();
  const router = useRouter();

  const clearDomainState = useCallback(() => {
    setCurrentPage(0);
    setAllPages([]);
    setAllColumns([]);
    setSelectedRow(undefined);
    setBoard([]);
    setBoardLoading(false);
    setAllExistingUsers([]);
    setModuleStatus(null);
    setAllDefaultComments([]);
    setLastQueryFrom(null);
    setLastQueryTo(null);
    setPrintDateStart(null);
    setPrintDateEnd(null);
    setPrintColumns([]);
    setMusicEntryType(undefined);
    setMusicDate(undefined);
    setMusicSongSelected(undefined);
    setMusicRatings([]);
    setRestrictions(undefined);
  }, []);

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
    clearDomainState();
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
    clearDomainState();
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
    return registerUnauthorizedHandler(() => {
      clearDomainState();
      setUser(null);
    });
  }, [clearDomainState]);

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

          let jsonPath = "/config.json";
          if (Constants.expoConfig?.experiments?.baseUrl) {
            jsonPath = `${Constants.expoConfig.experiments.baseUrl}/config.json`;
          }

          const response = await fetch(jsonPath);
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
    <AppContext
      value={{
        currentPage,
        setCurrentPage,
        allPages,
        setAllPages,
        allColumns,
        setAllColumns,
        selectedRow,
        setSelectedRow,
        board,
        setBoard,
        boardLoading,
        setBoardLoading,
        allExistingUsers,
        setAllExistingUsers,
        serverId,
        user,
        setUser,
        moduleStatus,
        setModuleStatus,
        allDefaultComments,
        setAllDefaultComments,
        lastQueryFrom,
        setLastQueryFrom,
        lastQueryTo,
        setLastQueryTo,
        serverDevUrl,
        isReady,
        serverName,
        printDateStart,
        setPrintDateStart,
        printDateEnd,
        setPrintDateEnd,
        printColumns,
        setPrintColumns,
        musicEntryType,
        setMusicEntryType,
        musicDate,
        setMusicDate,
        musicSongSelected,
        setMusicSongSelected,
        musicRatings,
        setMusicRatings,
        restrictions,
        setRestrictions,
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
    </AppContext>
  );
}
