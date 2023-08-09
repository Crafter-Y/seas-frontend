import { View, Text, Pressable } from "react-native";
import React from "react";
import Image from "@/components/elements/Image";
import tw from "@/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/RootNavigator";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList
  >;
};

const SettingsBackButton = ({ navigation }: Props) => {
  return (
    <View style={tw.style({}, "flex-row gap-1 items-center mb-4")}>
      <Image
        source={require("@/assets/img/previous.svg")}
        size={16}
      />
      <Pressable onPress={() => navigation.navigate("BoardScreen")}>
        <Text style={tw.style("font-semibold underline")}>Zurück</Text>
      </Pressable>
    </View>
  );
};

export default SettingsBackButton;
