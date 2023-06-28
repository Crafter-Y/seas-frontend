import { View, Text, Pressable } from "react-native";
import React, { useRef } from "react";
import { BoardType } from "@/screens/BoardScreen";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";

const BoardSidebarNavigationButton = (props: {
  boardType: BoardType;
  currentBoardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
}) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const changeTab = () => {
    props.setBoardType(props.boardType);
  };

  return (
    <Pressable
      style={tw`flex justify-between items-center mb-1 flex-row`}
      ref={ref}
      onPress={changeTab}
    >
      <View></View>
      <Text
        style={tw.style({
          "font-semibold": props.boardType == props.currentBoardType,
          underline: isHovered,
          "opacity-80": isHovered,
        })}
      >
        {props.boardType}
      </Text>
      <View
        style={tw.style(
          {
            "bg-blueAccent": props.boardType == props.currentBoardType,
            "bg-gray-300": props.boardType != props.currentBoardType,
          },
          `w-1 h-8 rounded-l-md`
        )}
      ></View>
    </Pressable>
  );
};

export default BoardSidebarNavigationButton;
