import { Text, Pressable } from "react-native";
import React, { useRef } from "react";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";
import { Entypo } from '@expo/vector-icons';

type Props = {
  onPress: () => void;
  type: "JOIN" | "EXIT"
  text?: string
  actionType?: "PLUS" | "CROSS"
};

const BoardAssignButton = ({ onPress, type, text, actionType = "PLUS" }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      onPress={onPress}
      style={tw.style(
        {
          transform: isHovered ? "scale(1.1)" : "",
          backgroundColor: type == "EXIT" ? "#f67e7e" : "#16a34a",
          "w-8": !text,
          "gap-1": !!text
        },
        `h-8 rounded-xl justify-center items-center flex-row px-2`
      )}
      ref={ref}
    >
      {actionType == "PLUS" && <Text style={tw`font-bold text-lg`} selectable={false}>
        +
      </Text>}

      {actionType == "CROSS" && (<Entypo name="cross" size={18} color="black" />)}
      <Text>{text}</Text>
    </Pressable>
  );
};

export default BoardAssignButton;
