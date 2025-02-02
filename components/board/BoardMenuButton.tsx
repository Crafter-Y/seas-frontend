import React, { useRef } from "react";
import { Pressable, PressableProps, View } from "react-native";
import { useHover } from "react-native-web-hooks";

import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";

type Props = {
  icon: string;
  text: string;
} & PressableProps;

const BoardMenuButton = ({ icon, text, className, ...props }: Props) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <Pressable className={`flex-row p-4 ${className}`} ref={ref} {...props}>
      <View className="flex-row gap-2 items-center">
        <Image source={icon} size={18} />

        <CustomText
          style={{
            opacity: isHovered ? 0.8 : 0.95,
            textDecorationLine: isHovered ? "underline" : "none",
          }}
        >
          {text}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default BoardMenuButton;
