import { Pressable, Text, View } from "react-native";
import React, { useRef } from "react";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";
import { Color } from "@/helpers/Constants";
import { BoardType } from "@/app/board";

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
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const changeTab = () => {
    setBoardType(boardType);
  };

  return (
    <Pressable
      style={tw`justify-between items-center mb-1 flex-row`}
      ref={ref}
      onPress={changeTab}
    >
      <View></View>
      <Text
        style={tw.style({
          "font-semibold": boardType == currentBoardType,
          underline: isHovered,
          "opacity-80": isHovered,
        })}
      >
        {boardType}
      </Text>
      <View
        style={tw.style(
          {
            backgroundColor:
              boardType == currentBoardType ? Color.BLUE : Color.GRAY,
          },
          "w-1 h-8 rounded-l-md"
        )}
      ></View>
    </Pressable>
  );
};

export default BoardSidebarNavigationButton;
