import React, { ReactNode } from "react";
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
      className={`border-t border-gray-300 ${
        new Date(formatDate(new Date())) > new Date(date) ? "bg-black/10" : ""
      }`}
    >
      <TouchableOpacity
        activeOpacity={0.55}
        className="flex-row w-full min-h-16"
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default PressableTR;
