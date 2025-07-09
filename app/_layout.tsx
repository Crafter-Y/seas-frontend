import Constants from "expo-constants";
import { SplashScreen } from "expo-router";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { de, registerTranslation } from "react-native-paper-dates";

import CustomText from "@/components/elements/CustomText";
import { AppProvider } from "@/helpers/appContext";
import { Color } from "@/helpers/Constants";
import i18n from "@/helpers/i18n";

import "@/nativewind.css";

registerTranslation("de", de);

function DefaultLayout() {
  const { height, width } = useWindowDimensions();

  // const onLayoutRootView = useCallback(() => {
  //   if (appIsReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     SplashScreen.hide();
  //   }
  // }, [appIsReady]);

  return (
    <AppProvider>
      <GestureHandlerRootView
        style={{ flex: 1 }} /* onLayout={onLayoutRootView} */
      >
        {/* TODO: maybe display the status bar at all times correctly? https://www.reddit.com/r/expo/comments/1kdtpo9/header_overlap_with_status_bar_after_upgrading_to/ */}
        <StatusBar translucent={false} backgroundColor={Color.SETTINGS_BG} />
        <I18nextProvider i18n={i18n}>
          <Stack
            screenOptions={{
              headerShown: false,
              // gestureEnabled: false,
            }}
          >
            <Stack.Screen
              name="(protected)"
              options={{
                animation: "none",
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                animation: "none",
              }}
            />
          </Stack>
        </I18nextProvider>
        {/** without this, when refreshing a static exported page, the height and width is 0 and doesn't get updated */}
        <CustomText className="hidden">
          {height}x{width}
        </CustomText>
      </GestureHandlerRootView>
    </AppProvider>
  );
}
let AppEntryPoint = DefaultLayout;

if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  // eslint-disable-next-line @limegrass/import-alias/import-alias, @typescript-eslint/no-require-imports
  AppEntryPoint = require("../.storybook").default;
  SplashScreen.hide();
}

export default AppEntryPoint;
