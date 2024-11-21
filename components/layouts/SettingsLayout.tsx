import {
  Pressable,
  RefreshControl,
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
  backTitle?: string;
  refreshAction?: () => void;
};

export const settingsSections = {
  users: "Mitglieder verwalten",
  positions: "Spalten verwalten",
  events: "Termine verwalten",
  pages: "Pläne verwalten",
  comments: "Kommentarvorlagen",
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

export const SettingsLayout = ({
  children,
  actualSetting,
  backTitle,
  refreshAction,
}: Props) => {
  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: Color.SETTINGS_BG,
        height, // this is needed. Parent containers must have a set height for ScrollView to work
      }}
    >
      <Stack.Screen
        options={{
          headerShown: !isMd,
          title: "Einstellungen",
          headerBackTitle: backTitle,
        }}
      />
      <View
        style={tw.style(
          {
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center pl-4"
        )}
      >
        <SettingsBackButton backRoute="/board/" />
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

      {/**
       * // TODO: on iOS, this thing is only rendered on half the screen. probably since expo 52, idk why
       *
       * Issue that might be linked to that behavior
       * https://github.com/expo/expo/issues/32450
       *
       * Possible linked reanimated issue:
       * https://github.com/software-mansion/react-native-reanimated/issues/6659
       *
       * probably failing since REA 3.15.0
       *
       * I cant backport, because expo go has a bundled-in version:
       * https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting/#mismatch-between-javascript-part-and-native-part-of-reanimated
       */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          refreshAction ? (
            <RefreshControl
              colors={[Color.BLUE, Color.GREEN]}
              refreshing={false} // TODO: some sort of backpropagation how long it is loading
              onRefresh={refreshAction}
            />
          ) : undefined
        }
        contentContainerStyle={tw.style(
          {
            "py-14": isMd,
            "pb-14": !isMd,
            "px-4": isMd,
            "justify-center": isMd,
          },
          "flex-grow"
        )}
        style={tw.style({
          "pt-4": actualSetting != "settings",
        })}
      >
        {children}
      </ScrollView>
    </View>
  );
};
