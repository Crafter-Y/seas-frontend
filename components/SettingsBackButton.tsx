import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";

type Props = {
  backRoute: string;
  label?: string;
};

const SettingsBackButton = ({
  backRoute,
  label = "Zurück zum Board",
}: Props) => {
  return (
    <View className="flex-row gap-1 items-center mb-4">
      <Image source={require("@/assets/img/previous.svg")} size={16} />
      <Pressable onPress={() => router.replace(backRoute)}>
        <CustomText className="font-semibold underline">{label}</CustomText>
      </Pressable>
    </View>
  );
};

export default SettingsBackButton;
