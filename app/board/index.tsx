import { Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import useAuthentication from "@/hooks/api/useAuthentication";
import BoardHeader from "@/components/board/BoardHeader";
import BoardSidebar from "@/components/board/BoardSidebar";
import Footer from "@/components/Footer";
import Board from "@/components/board/Board";
import useServerName from "@/hooks/api/useServerName";
import { Color } from "@/helpers/Constants";
import { router, useSegments } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";
import useBoard from "@/hooks/api/useBoard";
import ModalRewrite, { ModalHandle } from "@/components/elements/ModalRewrite";
import CalendarModal from "@/components/modules/calendar/CalendarModal";
import PrintModalContainer from "@/components/modules/print/PrintModalContainer";
import MusicModalContainer from "@/components/modules/music/MusicModalContainer";
import { useTranslation } from "react-i18next";

// TODO: i18n: build proper object with translation keys
export type BoardType =
  | "Jahresansicht"
  | "Quartal Ansicht"
  | "Monatsansicht"
  | "Wochenansicht";

export default function BoardScreenScreen() {
  const { user, hasAuthError, logout } = useAuthentication();
  const { serverName, fetchServerName } = useServerName();
  const { loading, requeryBoard } = useBoard();

  const segments = useSegments();
  const { t } = useTranslation();

  const [boardType, setBoardType] = useState<BoardType>("Quartal Ansicht");

  const calendarModal = useRef<ModalHandle>(null);
  const printModal = useRef<ModalHandle>(null);
  const musicModal = useRef<ModalHandle>(null);

  useEffect(() => {
    if (hasAuthError) router.replace("/login");
  }, [hasAuthError]);

  useEffect(() => {
    if (Platform.OS == "web" && serverName && segments[0] == "board")
      document.title = t("board") + " ⋅ " + serverName;

    if (!serverName) fetchServerName();
  }, [serverName, segments]);

  const changePassword = () => {
    router.navigate("/changepassword");
  };

  const settings = () => {
    router.navigate("/settings/");
  };

  return (
    <SafeAreaView className="bg-seas-light-gray flex-row h-full">
      <BoardSidebar
        user={user}
        boardType={boardType}
        setBoardType={setBoardType}
        logout={logout}
        changePassword={changePassword}
        settings={settings}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[Color.BLUE, Color.GREEN]}
            refreshing={loading}
            onRefresh={requeryBoard}
          />
        }
      >
        <BoardHeader
          user={user}
          setBoardType={setBoardType}
          boardType={boardType}
          logout={logout}
          changePassword={changePassword}
          settings={settings}
          openCalendarModal={() => calendarModal.current?.openModal()}
          openPrintModal={() => printModal.current?.openModal()}
          openMusicModal={() => musicModal.current?.openModal()}
        />
        <Board
          boardType={boardType}
          openCalendarModal={() => calendarModal.current?.openModal()}
          openPrintModal={() => printModal.current?.openModal()}
          openMusicModal={() => musicModal.current?.openModal()}
        />
        <Footer />
      </ScrollView>
      <ModalRewrite title="modal.calendarExportModule" ref={calendarModal}>
        <CalendarModal />
      </ModalRewrite>
      <PrintModalContainer ref={printModal} />
      <MusicModalContainer ref={musicModal} />
    </SafeAreaView>
  );
}
