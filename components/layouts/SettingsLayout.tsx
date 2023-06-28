import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import useMediaQueries from "@/hooks/useMediaQueries";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";
import Footer from "@/components/Footer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/RootNavigator";
import SettingsBackButton from "../SettingsBackButton";
import Divider from "../elements/Divider";
import H1 from "../elements/H1";
import { useHover } from "react-native-web-hooks";

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

type NavigationButtonProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList
  >;
  setting: keyof RootStackParamList;
  actualSetting: keyof RootStackParamList;
};

const InlineNavigationButton = ({
  navigation,
  setting,
  actualSetting,
}: NavigationButtonProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <View style={tw.style("items-center mt-2 gap-3 flex-row -mr-2")}>
      <Pressable
        onPress={() => {
          if (navigation.getState().routes.length > 2) navigation.pop();
          navigation.navigate(setting as keyof typeof settingsSections);
        }}
        ref={ref}
      >
        <Text
          style={tw.style({
            "font-semibold": actualSetting == setting,
            underline: isHovered,
            "opacity-80": isHovered,
          })}
        >
          {settingsTitles[setting as keyof typeof settingsTitles]}
        </Text>
      </Pressable>
      <View
        style={tw.style(
          {
            "bg-gray-300": actualSetting != setting,
            "bg-blueAccent": actualSetting == setting,
          },
          "w-1 h-8 rounded-l-md"
        )}
      ></View>
    </View>
  );
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
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center pl-4"
        )}
      >
        <SettingsBackButton navigation={navigation} />
        <H1 style={tw`text-right`}>Einstellungen</H1>
        {Object.keys(settingsSections).map((setting) => (
          <InlineNavigationButton
            key={setting}
            navigation={navigation}
            setting={setting as keyof typeof settingsTitles}
            actualSetting={getRouteName()}
          />
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
      <Divider
        type="VERTICAL"
        style={tw.style(
          {
            hidden: !isMd,
          },
          "my-16 mx-2"
        )}
      />
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
