import React, { useRef } from "react";
import { Pressable, View } from "react-native";
import { useHover } from "react-native-web-hooks";

import { BoardType } from "@/app/(protected)";
import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";

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
            backgroundColor:
              boardType === currentBoardType ? Color.BLUE : Color.GRAY,
          },
          "w-1 h-8 rounded-r-md",
        )}
      ></View>
      <CustomText
        style={tw.style({
          "font-semibold": boardType === currentBoardType,
          underline: isHovered,
          "opacity-80": isHovered,
        })}
      >
        {boardType}
      </CustomText>
      <View></View>
    </Pressable>
  );
};

export default BoardMenuNavigationButton;
