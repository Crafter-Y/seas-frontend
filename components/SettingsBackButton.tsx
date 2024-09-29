import { Pressable, Text, View } from "react-native";
import React from "react";
import Image from "@/components/elements/Image";
import tw from "@/tailwind";
import { router } from "expo-router";

type Props = {
  backRoute: string;
  label?: string;
};

const SettingsBackButton = ({
  backRoute,
  label = "Zurück zum Board",
}: Props) => {
  return (
    <View style={tw.style({}, "flex-row gap-1 items-center mb-4")}>
      <Image source={require("@/assets/img/previous.svg")} size={16} />
      <Pressable onPress={() => router.replace(backRoute)}>
        <Text style={tw.style("font-semibold underline")}>{label}</Text>
      </Pressable>
    </View>
  );
};

export default SettingsBackButton;
