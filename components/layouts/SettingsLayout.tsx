import { router } from "expo-router";
import React from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import H1 from "@/components/elements/H1";
import Footer from "@/components/Footer";
import SettingsBackButton from "@/components/SettingsBackButton";
import { Color } from "@/helpers/Constants";

type Props = {
  children: React.ReactNode;
  actualSetting: string;
  refreshAction?: () => void;
};

//TODO: i18n: translate titles
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
  return (
    <View className="items-center mt-2 gap-3 flex-row -mr-2">
      <Pressable
        onPress={() => {
          router.replace(`/settings/${setting}`);
        }}
      >
        <CustomText
          className={`hidden web:flex hover:opacity-80 hover:underline ${
            actualSetting === setting ? "font-semibold" : ""
          }`}
        >
          {settingsTitles[setting as keyof typeof settingsTitles]}
        </CustomText>
        <CustomText
          className={`hidden native:flex ${
            actualSetting === setting ? "font-semibold" : ""
          }`}
        >
          {settingsTitles[setting as keyof typeof settingsTitles]}
        </CustomText>
      </Pressable>
      <View
        className={`w-1 h-8 rounded-l-md ${
          actualSetting === setting ? "bg-seas-blue" : "bg-seas-gray"
        }`}
      />
    </View>
  );
};

export const SettingsLayout = ({
  children,
  actualSetting,
  refreshAction,
}: Props) => {
  return (
    <View
      className="h-full flex-row bg-seas-settings-bg" // this is needed. Parent containers must have a set height for ScrollView to work. Before, I just set the height to the window diemension height.
    >
      <View className="w-1/3 items-end justify-center pl-4 hidden md:flex">
        <SettingsBackButton backRoute="/board/" />
        <H1 className="text-right" t="settings" />
        {Object.keys(settingsSections).map((setting) => (
          <InlineNavigationButton
            actualSetting={actualSetting}
            key={setting}
            setting={setting as keyof typeof settingsTitles}
          />
        ))}
        <Footer className="w-48 mt-12 hidden md:flex" />
      </View>
      <Divider type="VERTICAL" className="my-16 mx-2 hidden md:flex" />

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
        contentContainerClassName={`md:justify-center md:min-h-[90%] pb-14 md:py-14 md:px-4 ${
          actualSetting !== "settings" ? "pt-4" : ""
        }`}
      >
        {children}
      </ScrollView>
    </View>
  );
};
