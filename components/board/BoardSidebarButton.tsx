import React, { useRef } from "react";
import { Pressable, View } from "react-native";
import { useHover } from "react-native-web-hooks";

import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";
import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";

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
        <CustomText
          style={tw.style({
            underline: isHovered,
            "opacity-80": isHovered,
            "opacity-95": !isHovered,
          })}
        >
          {text}
        </CustomText>
      </View>

      <View
        style={tw.style(
          {
            backgroundColor: isHovered ? Color.BLUE : undefined,
          },
          "w-1 h-8 rounded-l-md",
        )}
      ></View>
    </Pressable>
  );
};

export default BoardSidebarButton;
