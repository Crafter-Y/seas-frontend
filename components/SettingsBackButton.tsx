import { Pressable, Text, View } from "react-native";
import React from "react";
import Image from "@/components/elements/Image";
import tw from "@/tailwind";
import { router } from "expo-router";

const SettingsBackButton = () => {
  return (
    <View style={tw.style({}, "flex-row gap-1 items-center mb-4")}>
      <Image source={require("@/assets/img/previous.svg")} size={16} />
      <Pressable onPress={() => router.replace("/board/")}>
        <Text style={tw.style("font-semibold underline")}>Zurück</Text>
      </Pressable>
    </View>
  );
};

export default SettingsBackButton;
