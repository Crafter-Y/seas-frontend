import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";

type Props = {
  visible?: boolean;
  message: string;
};

export default function Callout({ visible = true, message }: Props) {
  return (
    <View
      style={tw.style(
        {
          hidden: !visible,
        },
        "flex-row gap-1",
      )}
    >
      <AntDesign
        name="warning"
        size={12}
        color={Color.RED}
        style={tw`mt-0.5`}
      />
      <CustomText style={tw`text-[${Color.RED}]`}>{message}</CustomText>
    </View>
  );
}
