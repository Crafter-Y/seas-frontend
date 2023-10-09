import { Platform, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import useAuthentication from "@/hooks/api/useAuthentication";
import tw from "@/tailwind";
import BoardHeader from "@/components/BoardHeader";
import BoardSidebar from "@/components/BoardSidebar";
import Footer from "@/components/Footer";
import Board from "@/components/Board";
import useMediaQueries from "@/hooks/useMediaQueries";
import useServerName from "@/hooks/api/useServerName";
import { Color } from "@/helpers/Constants";
import { router, useSegments } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";
import useBoard from "@/hooks/api/useBoard";

export type BoardType =
  | "Jahresansicht"
  | "Quartal Ansicht"
  | "Monatsansicht"
  | "Wochenansicht";

export default function BoardScreenScreen() {
  const { user, hasAuthError, logout } = useAuthentication();

  const { serverName } = useServerName();

  const [boardType, setBoardType] = useState<BoardType>("Quartal Ansicht");

  const { height } = useWindowDimensions();
  const { isMd } = useMediaQueries();

  const segments = useSegments();

  const { rows, queryBoard, loading } = useBoard();

  const [lastFromDate, setLastFromDate] = useState<string>();
  const [lastToDate, setLastToDate] = useState<string>();

  useEffect(() => {
    if (hasAuthError) router.replace("/login");
  }, [hasAuthError]);

  useEffect(() => {
    if (Platform.OS == "web" && serverName && segments[0] == "board")
      document.title = "Plan ⋅ " + serverName;
  }, [serverName, segments]);

  const queryFromBoard = async (fromDate: string, toDate: string) => {
    setLastFromDate(fromDate);
    setLastToDate(toDate);
    return await queryBoard(fromDate, toDate);
  };

  const changePassword = () => {
    router.push("/changepassword");
  };

  const settings = () => {
    router.push("/settings/");
  };

  return (
    <SafeAreaView
      style={tw.style(`m-0 p-0 bg-[${Color.LIGHT_GRAY}] flex flex-row`, {
        height: isMd ? height : undefined,
      })}
    >
      <BoardSidebar
        user={user}
        boardType={boardType}
        setBoardType={setBoardType}
        logout={() => logout()}
        changePassword={changePassword}
        settings={settings}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() =>
              lastFromDate && lastToDate
                ? queryBoard(lastFromDate, lastToDate)
                : ""
            }
          />
        }
      >
        <BoardHeader
          user={user}
          setBoardType={setBoardType}
          boardType={boardType}
          logout={() => logout()}
          changePassword={changePassword}
          settings={settings}
        />
        <Board boardType={boardType} rows={rows} queryBoard={queryFromBoard} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
