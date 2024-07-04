import { Pressable, Text, View } from "react-native";
import React, { useRef } from "react";
import Image from "@/components/elements/Image";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";
import { Color } from "@/helpers/Constants";

type Props = {
  icon: string;
  text: string;
  pressAction: () => void;
};

const BoardSidebarButton = ({ icon, text, pressAction }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable
      style={tw`justify-between items-center mb-1 flex-row py-4`}
      ref={ref}
      onPress={pressAction}
    >
      <View></View>
      <View style={tw`flex-row items-center gap-2`}>
        <Image source={icon} size={18} />
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

      <View
        style={tw.style(
          {
            backgroundColor: isHovered ? Color.BLUE : undefined,
          },
          "w-1 h-8 rounded-l-md"
        )}
      ></View>
    </Pressable>
  );
};

export default BoardSidebarButton;
