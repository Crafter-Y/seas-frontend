import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";

type Props = {
  visible?: boolean;
  message: string;
};

export default function Callout({ visible = true, message }: Props) {
  return (
    <View className={`flex-row items-center gap-1 ${visible ? "" : "hidden"}`}>
      <AntDesign name="warning" size={12} color={Color.RED} />
      <CustomText className="text-seas-red">{message}</CustomText>
    </View>
  );
}
