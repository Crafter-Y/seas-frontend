import { Text, Pressable } from "react-native";
import React from "react";
import useMediaQueries from "../../hooks/useMediaQueries";
import tw from "../../tailwind";
import { SettingsStackParamList } from "../../navigator/RootNavigator";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { settingsTitles } from "../../navigator/SettingsNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

export type BaseSettingsScreenProps = NativeStackNavigationProp<
  SettingsStackParamList,
  "BaseSettingsScreen"
>;

const BaseSettingsScreen = () => {
  const { isMd, isSm } = useMediaQueries();

  const navigation = useNavigation<BaseSettingsScreenProps>();

  return (
    <SafeAreaView
      style={tw.style(
        {
          "justify-center": isMd,
        },
        "min-h-full"
      )}
    >
      {isMd && (
        <Text style={tw.style("w-1/4 text-lg")}>
          Dieser Bereich ist nur für Administratoren zugänglich. Über die
          Unterpunkte seitlich können die Inhalte der Seite eingestellt werden.{" "}
        </Text>
      )}
      {!isMd &&
        Object.keys(settingsTitles).map((setting) => (
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
              navigation.navigate(setting as keyof typeof settingsTitles)
            }
          >
            <Text>
              {settingsTitles[setting as keyof typeof settingsTitles]}
            </Text>
            <Image
              source={require("../../assets/img/previous.svg")}
              style={tw.style(`h-4 w-4`, { transform: "rotate(180deg)" })}
            />
          </Pressable>
        ))}
    </SafeAreaView>
  );
};

export default BaseSettingsScreen;
