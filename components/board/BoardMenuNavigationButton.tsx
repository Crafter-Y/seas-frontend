import React from "react";
import { Pressable, View } from "react-native";

import { BoardType } from "@/app/(protected)";
import CustomText from "@/components/elements/CustomText";

type Props = {
  boardType: BoardType;
  currentBoardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
  closeModal: () => void;
};

const BoardMenuNavigationButton = ({
  boardType,
  currentBoardType,
  setBoardType,
  closeModal,
}: Props) => {
  const changeTab = () => {
    setBoardType(boardType);
    setTimeout(() => {
      closeModal();
    }, 200);
  };

  return (
    // `group` + `group-hover:` replaces the old useHover() from
    // react-native-web-hooks: hover is tracked here, but the styles it drives
    // sit on descendants.
    <Pressable
      className="items-center mb-1 flex-row gap-4 group"
      onPress={changeTab}
    >
      <View
        className={`w-1 h-8 rounded-r-md ${
          boardType === currentBoardType ? "bg-seas-blue" : "bg-seas-gray"
        }`}
      ></View>
      <CustomText
        className={`group-hover:underline group-hover:opacity-80 ${
          boardType === currentBoardType ? "font-semibold" : ""
        }`}
      >
        {boardType}
      </CustomText>
      <View></View>
    </Pressable>
  );
};

export default BoardMenuNavigationButton;
