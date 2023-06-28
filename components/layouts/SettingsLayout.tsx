import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React, { useEffect } from "react";
import useMediaQueries from "@/hooks/useMediaQueries";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";
import { Image } from "expo-image";
import Footer from "@/components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/RootNavigator";

type Props = {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList
  >;
};

export const settingsSections = {
  ManageUsersScreen: "Mitglieder verwalten",
  ManagePositionsScreen: "Spalten verwalten",
  ManageEventsScreen: "Termine verwalten",
  ManageCommentTemplatesScreen: "Kommentarvorlagen",
  ManagePagesScreen: "Pläne verwalten",
};

const settingsTitles = {
  ...settingsSections,
  BaseSettingsScreen: "Einstellungen",
};

export const SettingsLayout = ({ children, navigation }: Props) => {
  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

  const getRouteName = () => {
    return navigation.getState().routes[navigation.getState().routes.length - 1]
      .name;
  };

  useEffect(() => {
    if (!isMd) {
      navigation.setOptions({ headerShown: true });
      navigation.setOptions({
        title: settingsTitles[getRouteName() as keyof typeof settingsTitles],
      });
    } else {
      navigation.setOptions({ headerShown: false });
    }
  }, [isMd, navigation, getRouteName()]);

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
            source={require("@/assets/img/previous.svg")}
            style={tw`h-4 w-4`}
          />
          <Pressable onPress={() => navigation.navigate("BoardScreen")}>
            <Text style={tw.style("font-semibold underline")}>Zurück</Text>
          </Pressable>
        </View>
        <Text
          style={tw.style(
            {},
            "text-4xl font-bold opacity-95 underline text-right mb-2"
          )}
        >
          Einstellungen
        </Text>
        {Object.keys(settingsSections).map((setting) => (
          <View
            style={tw.style("items-center mt-2 gap-3 flex-row -mr-2")}
            key={setting}
          >
            <View></View>
            <Pressable
              style={tw.style("hover:underline hover:opacity-80")}
              onPress={() => {
                if (navigation.getState().routes.length > 2) navigation.pop();
                navigation.navigate(setting as keyof typeof settingsSections);
              }}
            >
              <Text style={tw.style("font-semibold")}>
                {settingsTitles[setting as keyof typeof settingsTitles]}
              </Text>
            </Pressable>
            <View
              style={tw.style(
                {
                  "bg-gray-300": getRouteName() != setting,
                  "bg-blueAccent": getRouteName() == setting,
                },
                "w-1 h-8 rounded-l-md"
              )}
            ></View>
          </View>
        ))}
        <Footer
          navigation={navigation}
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
          "my-16 bg-[#e0e2e5] w-0.5 mx-2"
        )}
      ></View>
      <View
        style={tw.style(
          {
            "py-14": isMd,
            "px-4": isMd,
            "justify-center": isMd,
          },
          "flex-grow"
        )}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};
