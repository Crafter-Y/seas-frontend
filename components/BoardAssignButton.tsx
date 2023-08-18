import { Text, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";
import { Entypo } from '@expo/vector-icons';
import { Color } from "@/helpers/Constants";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  onPress: () => void;
  color: "GREEN" | "RED" | "YELLOW" | "BLUE"
  text?: string
  actionType?: "PLUS" | "CROSS"
  style?: ClassInput;
};

const BoardAssignButton = ({ onPress, color = "GREEN", text, actionType = "PLUS", style }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  const [badgeColor, setBadgeColor] = useState("#16a34a");

  useEffect(() => {
    switch (color) {
      case "GREEN": setBadgeColor(Color.GREEN); break
      case "RED": setBadgeColor(Color.RED); break
      case "YELLOW": setBadgeColor(Color.YELLOW); break
      case "BLUE": setBadgeColor(Color.BLUE); break
    }
  }, [color])

  return (
    <Pressable
      onPress={onPress}
      style={tw.style(
        {
          transform: isHovered ? "scale(1.05)" : "",
          backgroundColor: badgeColor,
          "w-8": !text,
          "gap-1": !!text
        },
        `h-8 rounded-xl justify-center items-center flex-row px-2`,
        style
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
