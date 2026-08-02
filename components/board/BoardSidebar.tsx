import React from "react";
import { useWindowDimensions, View } from "react-native";

import { BoardType } from "@/app/(protected)";
import BoardSidebarButton from "@/components/board/BoardSidebarButton";
import BoardSidebarNavigationButton from "@/components/board/BoardSidebarNavigationButton";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import useMediaQueries from "@/hooks/useMediaQueries";

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
      className={`w-52 bg-white shadow-lg justify-between overflow-hidden ${
        !isLg ? "hidden" : ""
      }`}
      style={{ height }}
    >
      <View>
        <View className="mt-6 px-2">
          <CustomText className="text-sm">Hallo,</CustomText>
          <CustomText className="font-semibold mt-1 opacity-85">
            {props.user?.firstname} {props.user?.lastname}
          </CustomText>
        </View>
        <View className="flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 mt-6 mb-2 mx-2" />
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

      <View>
        <Divider type="HORIZONTAL" className="mt-6 mx-2" />
        {props.user?.role === "ADMIN" && [
          <BoardSidebarButton
            key={1}
            icon={require("@/assets/img/settings.svg")}
            text={"Einstellungen"}
            pressAction={props.settings}
          />,
          <Divider type="HORIZONTAL" className="mx-2" key={2} />,
        ]}
        <BoardSidebarButton
          icon={require("@/assets/img/changepassword.svg")}
          text={"Passwort ändern"}
          pressAction={props.changePassword}
        />
        <Divider type="HORIZONTAL" className="mx-2" />
        <BoardSidebarButton
          icon={require("@/assets/img/logout.svg")}
          text={"Abmelden"}
          pressAction={props.logout}
        />
      </View>
    </View>
  );
};

export default BoardSidebar;
