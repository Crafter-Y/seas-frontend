import React, { ReactNode } from "react";
import tw from "@/tailwind";
import { TouchableOpacity, View } from "react-native";
import { formatDate } from "@/helpers/format";

type Props = {
  children?: ReactNode;
  onPress: () => void;
  date: string;
};

const PressableTR = ({ children, onPress, date }: Props) => {
  return (
    <View
      style={tw.style(
        {
          "bg-black/10": new Date(formatDate(new Date())) > new Date(date),
        },
        "border-t border-gray-300"
      )}
    >
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
