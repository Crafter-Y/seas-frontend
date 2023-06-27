import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React from "react";
import tw from "../tailwind";
import useMediaQueries from "../hooks/useMediaQueries";
import { BoardType } from "../screens/BoardScreen";
import BoardSidebarButton from "./BoardSidebarButton";
import BoardSidebarNavigationButton from "./BoardSidebarNavigationButton";

const BoardSidebar = (props: {
  user: User | null;
  boardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
  logout: () => void;
  changePassword: () => void;
  settings: () => void;
}) => {
  const { isLg } = useMediaQueries();

  const { height } = useWindowDimensions();

  return (
    <View
      style={tw.style(
        "w-52 bg-white shadow-lg justify-between overflow-hidden hidden lg:flex",
        {
          height,
          flex: isLg,
          hidden: !isLg,
        }
      )}
    >
      <View style={tw.style("w-full ")}>
        <View style={tw`mt-6 px-2`}>
          <Text style={tw`text-sm`}>Hallo,</Text>
          <Text style={tw`font-semibold mt-1 opacity-85`}>
            {props.user?.firstname} {props.user?.lastname}
          </Text>
        </View>
        <View
          style={tw.style(
            `flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mt-6 mb-2 mx-2`
          )}
        />
        <BoardSidebarNavigationButton
          boardType="Jahresansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
        <BoardSidebarNavigationButton
          boardType="Quartal Ansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
        <BoardSidebarNavigationButton
          boardType="Monatsansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
        <BoardSidebarNavigationButton
          boardType="Wochenansicht"
          currentBoardType={props.boardType}
          setBoardType={props.setBoardType}
        />
      </View>

      <View style={tw.style("w-full")}>
        <View
          style={tw.style(
            ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mt-6 mx-2`
          )}
        />
        {props.user?.role == "ADMIN" && [
          <BoardSidebarButton
            key={1}
            icon={require("../assets/img/settings.svg")}
            text={"Einstellungen"}
            pressAction={props.settings}
          />,
          <View
            key={2}
            style={tw.style(
              ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mx-2`
            )}
          />,
        ]}
        <BoardSidebarButton
          icon={require("../assets/img/changepassword.svg")}
          text={"Passwort ändern"}
          pressAction={props.changePassword}
        />
        <View
          style={tw.style(
            ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mx-2`
          )}
        />
        <BoardSidebarButton
          icon={require("../assets/img/logout.svg")}
          text={"Abmelden"}
          pressAction={props.logout}
        />
      </View>
    </View>
  );
};

export default BoardSidebar;
