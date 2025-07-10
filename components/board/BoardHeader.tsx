import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { memo, useContext, useRef } from "react";
import { Platform, View } from "react-native";

import { BoardType } from "@/app/(protected)";
import BoardMenuButton from "@/components/board/BoardMenuButton";
import BoardMenuNavigationButton from "@/components/board/BoardMenuNavigationButton";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import RoundIconButton from "@/components/RoundIconButton";
import { AppContext } from "@/helpers/appContext";
import useModuleStatus from "@/hooks/api/useModuleStatus";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";

type BoardHeaderProps = {
  user: User | null;
  boardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
  logout: () => void;
  changePassword: () => void;
  settings: () => void;
  openCalendarModal?: () => void;
  openPrintModal?: () => void;
  openMusicModal?: () => void;
};

const BoardHeader = ({
  user,
  boardType,
  setBoardType,
  logout,
  changePassword,
  settings,
  openCalendarModal,
  openPrintModal,
  openMusicModal,
}: BoardHeaderProps) => {
  const { isLg } = useMediaQueries();

  const { serverName } = useContext(AppContext);

  const modal = useRef<ModalHandle>(null);

  const { moduleStatus } = useModuleStatus();

  return (
    <View
      style={tw.style({
        "px-4": isLg,
        "mt-4": isLg,
      })}
    >
      <View
        style={tw`bg-white shadow-lg items-center justify-between px-2 h-16 flex-row`}
      >
        <CustomText
          style={tw.style(
            {
              "text-xl": isLg,
              "text-lg": !isLg,
              "ml-4": isLg,
              maxWidth: "80%",
            },
            "font-bold",
          )}
          testID="board-header-title"
        >
          {serverName}
        </CustomText>
        <View
          style={tw.style(
            {
              hidden: !isLg,
            },
            "flex-row gap-2",
          )}
        >
          <RoundIconButton
            hidden={!moduleStatus?.moduleCalendar}
            icon={<AntDesign name="calendar" size={20} color="black" />}
            onPress={openCalendarModal}
          />
          <RoundIconButton
            hidden={!moduleStatus?.modulePrint}
            icon={<AntDesign name="printer" size={20} color="black" />}
            onPress={openPrintModal}
          />
          <RoundIconButton
            hidden={!moduleStatus?.moduleMusic}
            icon={
              <MaterialCommunityIcons
                name="music-clef-treble"
                size={20}
                color="black"
              />
            }
            onPress={openMusicModal}
          />
        </View>
        <RoundIconButton
          hidden={isLg}
          icon={<AntDesign name="menu-fold" size={20} color="black" />}
          onPress={() => modal.current?.openModal()}
        />

        <Modal ref={modal} modalOpenCondition={!isLg} type="MOBILE_BOTTOM">
          <CustomText
            style={tw`w-full text-center px-2 text-lg font-semibold mt-6`}
          >
            {user?.firstname} {user?.lastname}
          </CustomText>
          <CustomText style={tw`w-full text-center px-2 text-sm mb-4`}>
            {user?.email}
          </CustomText>
          <Divider type="HORIZONTAL" style={tw`mx-2 my-2`} />

          <BoardMenuNavigationButton
            boardType="Jahresansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.closeModal()}
          />
          <BoardMenuNavigationButton
            boardType="Quartal Ansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.closeModal()}
          />
          <BoardMenuNavigationButton
            boardType="Monatsansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.closeModal()}
          />
          <BoardMenuNavigationButton
            boardType="Wochenansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.closeModal()}
          />
          <Divider type="HORIZONTAL" style={tw`mx-2`} />
          {user?.role === "ADMIN" && [
            <BoardMenuButton
              key={3}
              icon={require("@/assets/img/settings.svg")}
              text={"Einstellungen"}
              onPress={() => {
                modal.current?.closeModal();
                settings();
              }}
            />,
            <Divider key={4} type="HORIZONTAL" style={tw`mx-2`} />,
          ]}

          <BoardMenuButton
            icon={require("@/assets/img/changepassword.svg")}
            text={"Passwort ändern"}
            onPress={() => {
              modal.current?.closeModal();
              changePassword();
            }}
          />
          <Divider type="HORIZONTAL" style={tw`mx-2`} />
          <BoardMenuButton
            icon={require("@/assets/img/logout.svg")}
            text={"Abmelden"}
            onPress={() => {
              modal.current?.closeModal();
              logout();
            }}
            style={tw.style({
              "mb-1": Platform.OS !== "web",
            })}
          />
        </Modal>
      </View>
    </View>
  );
};

export default memo(BoardHeader);
