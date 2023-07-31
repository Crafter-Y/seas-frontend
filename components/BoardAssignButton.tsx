import { Text, Pressable } from "react-native";
import React, { useRef } from "react";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";

type Props = {
  onPress: () => void;
};

const BoardAssignButton = ({ onPress }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      onPress={onPress}
      style={tw.style(
        {
          transform: isHovered ? "scale(1.1)" : "",
        },
        `bg-green-600 h-8 w-8 rounded-xl justify-center items-center`
      )}
      ref={ref}
    >
      <Text style={tw`font-bold text-lg`} selectable={false}>
        +
      </Text>
    </Pressable>
  );
};

export default BoardAssignButton;
