import { View, Text, Pressable } from "react-native";
import React, { useRef } from "react";
import { Image } from "expo-image";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  icon: string;
  text: string;
  pressAction: () => void;
  style?: ClassInput;
};

const BoardMenuButton = ({ icon, text, pressAction, style }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      style={tw.style(`items-center flex-row p-4`, style)}
      ref={ref}
      onPress={pressAction}
    >
      <View style={tw`flex-row gap-2`}>
        <Image source={icon} style={tw`h-6 w-6`} />

        <Text
          style={tw.style({
            underline: isHovered,
            "opacity-80": isHovered,
            "opacity-95": !isHovered,
          })}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default BoardMenuButton;
