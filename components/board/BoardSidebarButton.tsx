import React from "react";
import { Pressable, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";

type Props = {
  icon: string;
  text: string;
  pressAction: () => void;
};

const BoardSidebarButton = ({ icon, text, pressAction }: Props) => {
  return (
    // `group` + `group-hover:` replaces the old useHover() from
    // react-native-web-hooks: the hover state lives on this Pressable, but the
    // styles it drives sit on descendants.
    <Pressable
      className="justify-between items-center mb-1 flex-row py-4 group"
      onPress={pressAction}
    >
      <View></View>
      <View className="flex-row items-center gap-2">
        <Image source={icon} size={18} />
        <CustomText className="opacity-95 group-hover:opacity-80 group-hover:underline">
          {text}
        </CustomText>
      </View>

      <View className="w-1 h-8 rounded-l-md group-hover:bg-seas-blue"></View>
    </Pressable>
  );
};

export default BoardSidebarButton;
