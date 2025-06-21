import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";
import {
  SettingsLayout,
  settingsSections,
} from "@/components/layouts/SettingsLayout";
import useRestrictions from "@/hooks/api/useRestrictions";

export default function BaseSettingsScreen() {
  useRestrictions(); // pre-fetch restrictions

  return (
    <SettingsLayout actualSetting="settings">
      <View className="md:justify-center">
        <CustomText
          className="w-52 text-lg hidden md:flex"
          t="settingsGreetings"
        />
        <View className="md:hidden">
          {Object.keys(settingsSections).map((setting) => (
            <Pressable
              key={setting}
              className="border-gray-400 px-4 py-6 text-lg opacity-85 bg-gray-200 justify-between flex-row sm:mx-6 sm:mt-6 border-b-[2px]"
              onPress={() => {
                router.push(
                  `(protected)/settings/${setting as keyof typeof settingsSections}`,
                );
              }}
            >
              <CustomText>
                {settingsSections[setting as keyof typeof settingsSections]}
              </CustomText>
              <Image
                source={require("@/assets/img/previous.svg")}
                size={16}
                style={{ transform: "rotate(180deg)" }}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </SettingsLayout>
  );
}
