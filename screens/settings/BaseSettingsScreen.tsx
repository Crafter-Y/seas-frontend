import { Text, Pressable, View } from "react-native";
import React from "react";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";
import Image from "@/components/elements/Image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/RootNavigator";
import {
  SettingsLayout,
  settingsSections,
} from "@/components/layouts/SettingsLayout";

export type BaseSettingsScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "BaseSettingsScreen"
>;

const BaseSettingsScreen = () => {
  const { isMd, isSm } = useMediaQueries();

  const navigation = useNavigation<BaseSettingsScreenProps>();

  return (
    <SettingsLayout navigation={navigation}>
      <View
        style={tw.style(
          {
            "justify-center": isMd,
          },
          "min-h-full"
        )}
      >
        {isMd && (
          <Text style={tw.style("w-52 text-lg")}>
            Dieser Bereich ist nur für Administratoren zugänglich. Über die
            Unterpunkte seitlich können die Inhalte der Seite eingestellt
            werden.{" "}
          </Text>
        )}
        {!isMd &&
          Object.keys(settingsSections).map((setting) => (
            <Pressable
              key={setting}
              style={tw.style(
                {
                  borderBottomWidth: 2,
                  "mx-6": isSm,
                  "mt-6": isSm,
                  "rounded-md": isSm,
                },
                "border-gray-400 px-4 py-6 text-lg opacity-85 bg-gray-200 justify-between flex-row"
              )}
              onPress={() =>
                navigation.navigate(setting as keyof typeof settingsSections)
              }
            >
              <Text>
                {settingsSections[setting as keyof typeof settingsSections]}
              </Text>
              <Image
                source={require("@/assets/img/previous.svg")}
                size={16}
                style={{ transform: "rotate(180deg)" }}
              />
            </Pressable>
          ))}
      </View>
    </SettingsLayout>
  );
};

export default BaseSettingsScreen;
