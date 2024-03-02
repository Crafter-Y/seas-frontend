import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useRef } from "react";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";
import Footer from "@/components/Footer";
import SettingsBackButton from "../SettingsBackButton";
import Divider from "../elements/Divider";
import H1 from "../elements/H1";
import { useHover } from "react-native-web-hooks";
import { Color } from "@/helpers/Constants";
import { router, Stack } from "expo-router";

type Props = {
  children: React.ReactNode;
  actualSetting: string;
};

export const settingsSections = {
  users: "Mitglieder verwalten",
  positions: "Spalten verwalten",
  events: "Termine verwalten",
  comments: "Kommentarvorlagen",
  pages: "Pläne verwalten",
  modules: "Module verwalten",
};

const settingsTitles = {
  ...settingsSections,
  settings: "Einstellungen",
};

type NavigationButtonProps = {
  setting: string;
  actualSetting: string;
};

const InlineNavigationButton = ({
  setting,
  actualSetting,
}: NavigationButtonProps) => {
  const ref = useRef(null);
  const isHovered = useHover(ref);

  return (
    <View style={tw.style("items-center mt-2 gap-3 flex-row -mr-2")}>
      <Pressable
        onPress={() => {
          router.replace(`/settings/${setting}`);
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
            backgroundColor: actualSetting == setting ? Color.BLUE : Color.GRAY,
          },
          "w-1 h-8 rounded-l-md"
        )}
      ></View>
    </View>
  );
};

export const SettingsLayout = ({ children, actualSetting }: Props) => {
  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: Color.SETTINGS_BG,
      }}
    >
      <Stack.Screen options={{ headerShown: !isMd, title: "Einstellungen" }} />
      <View
        style={tw.style(
          {
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center pl-4"
        )}
      >
        <SettingsBackButton />
        <H1 style={tw`text-right`}>Einstellungen</H1>
        {Object.keys(settingsSections).map((setting) => (
          <InlineNavigationButton
            actualSetting={actualSetting}
            key={setting}
            setting={setting as keyof typeof settingsTitles}
          />
        ))}
        <Footer
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
      <ScrollView
        contentContainerStyle={tw.style(
          {
            "py-14": isMd,
            "px-4": isMd,
            "justify-center": isMd,
          },
          "flex-grow"
        )}
        style={tw`pt-4`}
      >
        {children}
      </ScrollView>
    </View>
  );
};
