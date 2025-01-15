import { Pressable, View } from "react-native";
import React, { useRef } from "react";
import Image from "@/components/elements/Image";
import tw from "@/tailwind";
import { useHover } from "react-native-web-hooks";
import { ClassInput } from "twrnc/dist/esm/types";
import CustomText from "../elements/CustomText";

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
      style={tw.style("flex-row p-4", style)}
      ref={ref}
      onPress={pressAction}
    >
      <View style={tw`flex-row gap-2 items-center`}>
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
    </Pressable>
  );
};

export default BoardMenuButton;
