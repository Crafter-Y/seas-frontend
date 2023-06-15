import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../tailwind";
import useMediaQueries from "../hooks/useMediaQueries";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import Footer from "../components/Footer";

export type SettingsScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "SettingsScreen"
>;

const SettingsScreen = () => {
  const rootNavigation = useNavigation<SettingsScreenProps>();

  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

  return (
    <SafeAreaView style={{ flexDirection: "row" }}>
      <View
        style={tw.style(
          {
            flex: isMd,
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center pl-4"
        )}
      >
        <View style={tw.style({}, "flex-row gap-1 items-center mb-4")}>
          <Image
            source={require("../assets/img/previous.svg")}
            style={tw`h-4 w-4`}
          />
          <Pressable onPress={() => rootNavigation.navigate("BoardScreen")}>
            <Text style={tw.style("font-semibold underline")}>Zurück</Text>
          </Pressable>
        </View>
        <Text
          style={tw.style(
            {},
            "text-4xl font-bold opacity-95 underline text-right"
          )}
        >
          Einstellungen
        </Text>
        <Footer
          navigation={rootNavigation}
          style={tw.style(
            {
              hidden: !isMd,
            },
            "w-48 mt-12"
          )}
        />
      </View>
      <View
        style={tw.style(
          {
            hidden: !isMd,
          },
          "my-16 bg-[#e0e2e5] w-0.5 mx-5"
        )}
      ></View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
