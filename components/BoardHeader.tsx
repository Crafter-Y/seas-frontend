import { View, Text } from "react-native";
import React, { useRef } from "react";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import useServerName from "@/hooks/api/useServerName";
import { Platform } from "react-native";
import BoardMenuNavigationButton from "./BoardMenuNavigationButton";
import BoardMenuButton from "./BoardMenuButton";
import BoardHeaderRoundButton from "./BoardHeaderRoundButton";
import Divider from "./elements/Divider";
import Modal, { ModalHandle } from "./elements/Modal";
import Toast from 'react-native-toast-message';
import { BoardType } from "@/app/board";

type BoardHeaderProps = {
  user: User | null;
  boardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
  logout: () => void;
  changePassword: () => void;
  settings: () => void;
};

const BoardHeader = ({
  user,
  boardType,
  setBoardType,
  logout,
  changePassword,
  settings,
}: BoardHeaderProps) => {
  const { isLg } = useMediaQueries();

  const { serverName } = useServerName();

  const modal = useRef<ModalHandle>(null);

  return (
    <View
      style={tw.style({
        "px-4": isLg,
        "mt-6": isLg,
      })}
    >
      <View
        style={tw`bg-white shadow-lg items-center justify-between px-2 h-16 flex-row`}
      >
        <Text
          style={tw.style(
            {
              "text-xl": isLg,
              "text-lg": !isLg,
              "ml-4": isLg,
              "text-red-500": !serverName
            },
            "font-bold"
          )}
        >
          {serverName ? serverName : "Server zur Zeit nicht erreichbar"}
        </Text>
        <View
          style={tw.style(
            {
              hidden: !isLg,
            },
            "flex-row gap-2"
          )}
        >
          <BoardHeaderRoundButton
            imageSource={require("@/assets/img/calendar.svg")}
            onPress={() => Toast.show({
              type: "error",
              text1: "Noch nicht implementiert",
              text2: "Diese Funktion ist noch nicht implementiert",
            })}
          />
          <BoardHeaderRoundButton
            imageSource={require("@/assets/img/print.svg")}
            onPress={() => Toast.show({
              type: "error",
              text1: "Noch nicht implementiert",
              text2: "Diese Funktion ist noch nicht implementiert",
            })}
          />
        </View>
        <BoardHeaderRoundButton
          imageSource={require("@/assets/img/menu.svg")}
          onPress={() => modal.current?.toggleModal()}
          style={tw.style({ hidden: isLg })}
        />

        <Modal ref={modal} modalOpenCondition={!isLg} type="MOBILE_BOTTOM">
          <Text style={tw`w-full text-center px-2 text-lg font-semibold mt-6`}>
            {user?.firstname} {user?.lastname}
          </Text>
          <Text style={tw`w-full text-center px-2 text-sm mb-4`}>
            {user?.email}
          </Text>
          <Divider type="HORIZONTAL" style={tw`mx-2 my-2`} />

          <BoardMenuNavigationButton
            boardType="Jahresansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.toggleModal()}
          />
          <BoardMenuNavigationButton
            boardType="Quartal Ansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.toggleModal()}
          />
          <BoardMenuNavigationButton
            boardType="Monatsansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.toggleModal()}
          />
          <BoardMenuNavigationButton
            boardType="Wochenansicht"
            currentBoardType={boardType}
            setBoardType={setBoardType}
            closeModal={() => modal.current?.toggleModal()}
          />
          <Divider type="HORIZONTAL" style={tw`mx-2`} />
          {user?.role == "ADMIN" && [
            <BoardMenuButton
              key={3}
              icon={require("@/assets/img/settings.svg")}
              text={"Einstellungen"}
              pressAction={() => {
                modal.current?.toggleModal();
                settings();
              }}
            />,
            <Divider key={4} type="HORIZONTAL" style={tw`mx-2`} />,
          ]}

          <BoardMenuButton
            icon={require("@/assets/img/changepassword.svg")}
            text={"Passwort ändern"}
            pressAction={() => {
              modal.current?.toggleModal();
              changePassword();
            }}
          />
          <Divider type="HORIZONTAL" style={tw`mx-2`} />
          <BoardMenuButton
            icon={require("@/assets/img/logout.svg")}
            text={"Abmelden"}
            pressAction={logout}
            style={tw.style({
              "mb-1": Platform.OS != "web",
            })}
          />
        </Modal>
      </View>
    </View>
  );
};

export default BoardHeader;
