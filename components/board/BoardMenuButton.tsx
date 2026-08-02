import React from "react";
import { Pressable, PressableProps, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";

type Props = {
  icon: string;
  text: string;
} & PressableProps;

const BoardMenuButton = ({ icon, text, className, ...props }: Props) => {
  return (
    // `group` + `group-hover:` replaces the old useHover() from
    // react-native-web-hooks.
    <Pressable className={`flex-row p-4 group ${className}`} {...props}>
      <View className="flex-row gap-2 items-center">
        <Image source={icon} size={18} />

        <CustomText className="opacity-95 group-hover:opacity-80 group-hover:underline">
          {text}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default BoardMenuButton;
