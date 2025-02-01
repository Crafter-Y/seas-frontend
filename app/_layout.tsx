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
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import React from "react";
import CustomText from "@/components/elements/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Store } from "@/helpers/store";
registerTranslation("de", de);

SplashScreen.preventAutoHideAsync();

function DefaultLayout() {
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();

  const [appIsReady, setAppIsReady] = useState(false);

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
    async function restoreDevURL() {
      let devUrl = await AsyncStorage.getItem("devServerURL");
      if (devUrl !== null) {
        console.log("restoring dev URL: " + devUrl);
        Store.update((state) => {
          state.serverDevUrl = devUrl;
        });
        setAppIsReady(true);
      } else {
        setAppIsReady(true);
      }
    }

    loadFonts();
    if (__DEV__) {
      restoreDevURL();
    } else {
      setAppIsReady(true);
    }
  }, [t]);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
