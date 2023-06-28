import { View, Text, Pressable } from "react-native";
import React, { useRef } from "react";
import { Image } from "expo-image";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";

const BoardSidebarButton = (props: {
  icon: string;
  text: string;
  pressAction: () => void;
}) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      style={tw`flex justify-between items-center mb-1 flex-row py-4`}
      ref={ref}
      onPress={props.pressAction}
    >
      <View></View>
      <View style={tw`flex flex-row items-center gap-2`}>
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

      <View
        style={tw.style(
          {
            "bg-blueAccent": isHovered,
          },
          `w-1 h-8 rounded-l-md`
        )}
      ></View>
    </Pressable>
  );
};

export default BoardSidebarButton;
