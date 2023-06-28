import { View, Text, Pressable } from "react-native";
import React, { useRef } from "react";
import { Image } from "expo-image";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";

const BoardMenuButton = (props: {
  icon: string;
  text: string;
  pressAction: () => void;
}) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      style={tw`flex items-center flex-row p-4`}
      ref={ref}
      onPress={props.pressAction}
    >
      <View style={tw`flex flex-row gap-2`}>
        <Image source={props.icon} style={tw`h-6 w-6`} />

        <Text
          style={tw.style({
            underline: isHovered,
            "opacity-80": isHovered,
            "opacity-95": !isHovered,
          })}
        >
          {props.text}
        </Text>
      </View>
    </Pressable>
  );
};

export default BoardMenuButton;
