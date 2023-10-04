import React, { ReactNode } from "react";
import tw from "@/tailwind";
import { TouchableOpacity, View } from "react-native";

type Props = {
  children?: ReactNode;
  onPress: () => void;
};

const PressableTR = ({ children, onPress }: Props) => {
  return (
    <View style={tw`border-t border-gray-300`}>
      <TouchableOpacity
        activeOpacity={0.55}
        style={tw.style(
          {
            minHeight: 64,
          },
          "flex-row w-full"
        )}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default PressableTR;
