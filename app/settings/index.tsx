import { Pressable, View } from "react-native";
import React from "react";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";
import Image from "@/components/elements/Image";
import {
  SettingsLayout,
  settingsSections,
} from "@/components/layouts/SettingsLayout";
import { router } from "expo-router";
import useRestrictions from "@/hooks/api/useRestrictions";
import CustomText from "@/components/elements/CustomText";

export default function BaseSettingsScreen() {
  const { isMd, isSm } = useMediaQueries();

  useRestrictions();

  return (
    <SettingsLayout actualSetting="settings" backTitle="Zurück">
      <View
        style={tw.style(
          {
            "justify-center": isMd,
          },
          "min-h-full"
        )}
      >
        {isMd && (
          <CustomText style={tw.style("w-52 text-lg")}>
            Dieser Bereich ist nur für Administratoren zugänglich. Über die
            Unterpunkte seitlich können die Inhalte der Seite eingestellt
            werden.
          </CustomText>
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
              onPress={() => {
                router.navigate(
                  `/settings/${setting as keyof typeof settingsSections}`
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
    </SettingsLayout>
  );
}
