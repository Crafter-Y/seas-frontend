import React from "react";
import { Pressable, View } from "react-native";

import { BoardType } from "@/app/(protected)";
import CustomText from "@/components/elements/CustomText";

type Props = {
  boardType: BoardType;
  currentBoardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
};

const BoardSidebarNavigationButton = ({
  boardType,
  currentBoardType,
  setBoardType,
}: Props) => {
  const changeTab = () => {
    setBoardType(boardType);
  };

  return (
    // `group` + `group-hover:` replaces the old useHover() from
    // react-native-web-hooks: hover is tracked here, but the styles it drives
    // sit on descendants.
    <Pressable
      className="justify-between items-center mb-1 flex-row group"
      onPress={changeTab}
    >
      <View></View>
      <CustomText
        className={`group-hover:underline group-hover:opacity-80 ${
          boardType === currentBoardType ? "font-semibold" : ""
        }`}
      >
        {boardType}
      </CustomText>
      <View
        className={`w-1 h-8 rounded-l-md ${
          boardType === currentBoardType ? "bg-seas-blue" : "bg-seas-gray"
        }`}
      ></View>
    </Pressable>
  );
};

export default BoardSidebarNavigationButton;
