import { Stack } from "expo-router/stack";
import { SplashScreen } from "expo-router";
import * as Font from "expo-font";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "@/helpers/i18n";
import "../nativewind.css";

import { de, registerTranslation } from "react-native-paper-dates";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import React from "react";
import CustomText from "@/components/elements/CustomText";
registerTranslation("de", de);

SplashScreen.preventAutoHideAsync();

function DefaultLayout() {
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Roboto: require("../assets/fonts/Roboto.ttf"),
        });
      } catch (e) {
        console.warn(e);
        Toast.show({
          type: "error",
          text1: t("error.fontLoadingFailed"),
          text2: t("error.fontCouldNotBeFound", { font: "Roboto" }),
        });
      } finally {
        SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar translucent={true} animated={true} style="auto" />
      <I18nextProvider i18n={i18n}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </I18nextProvider>
      {/** without this, when refreshing a static exported page, the height and width is 0 and doesn't get updated */}
      <CustomText className="hidden">
        {height}x{width}
      </CustomText>
    </GestureHandlerRootView>
  );
}
let AppEntryPoint = DefaultLayout;

if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppEntryPoint = AppEntryPoint = require("../.storybook").default;
}

export default AppEntryPoint;
