import { View, Text, Pressable } from "react-native";
import React, { useRef } from "react";
import { BoardType } from "@/screens/BoardScreen";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";

const BoardMenuNavigationButton = (props: {
  boardType: BoardType;
  currentBoardType: BoardType;
  setBoardType: React.Dispatch<React.SetStateAction<BoardType>>;
  closeModal: () => void;
}) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const changeTab = () => {
    props.setBoardType(props.boardType);
    setTimeout(() => {
      props.closeModal();
    }, 200);
  };

  return (
    <Pressable
      style={tw`flex items-center mb-1 flex-row gap-4`}
      ref={ref}
      onPress={changeTab}
    >
      <View
        style={tw.style(
          {
            "bg-blueAccent": props.boardType == props.currentBoardType,
            "bg-gray-300": props.boardType != props.currentBoardType,
          },
          `w-1 h-8 rounded-r-md`
        )}
      ></View>
      <Text
        style={tw.style({
          "font-semibold": props.boardType == props.currentBoardType,
          underline: isHovered,
          "opacity-80": isHovered,
        })}
      >
        {props.boardType}
      </Text>
      <View></View>
    </Pressable>
  );
};

export default BoardMenuNavigationButton;
