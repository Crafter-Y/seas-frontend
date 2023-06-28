import { View, Text, Pressable } from "react-native";
import React, { useRef } from "react";
import { BoardType } from "@/screens/BoardScreen";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";

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
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const changeTab = () => {
    setBoardType(boardType);
    setTimeout(() => {
      closeModal();
    }, 200);
  };

  return (
    <Pressable
      style={tw`items-center mb-1 flex-row gap-4`}
      ref={ref}
      onPress={changeTab}
    >
      <View
        style={tw.style(
          {
            "bg-blueAccent": boardType == currentBoardType,
            "bg-gray-300": boardType != currentBoardType,
          },
          `w-1 h-8 rounded-r-md`
        )}
      ></View>
      <Text
        style={tw.style({
          "font-semibold": boardType == currentBoardType,
          underline: isHovered,
          "opacity-80": isHovered,
        })}
      >
        {boardType}
      </Text>
      <View></View>
    </Pressable>
  );
};

export default BoardMenuNavigationButton;
