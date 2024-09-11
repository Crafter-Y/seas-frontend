import { Text, View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Color } from "@/helpers/Constants";

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
        "flex-row gap-1"
      )}
    >
      <AntDesign
        name="warning"
        size={12}
        color={Color.RED}
        style={tw`mt-0.5`}
      />
      <Text style={tw`text-[${Color.RED}]`}>{message}</Text>
    </View>
  );
}