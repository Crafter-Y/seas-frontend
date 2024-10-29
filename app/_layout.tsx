import { Stack } from "expo-router/stack";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { I18nextProvider } from "react-i18next";
import i18n from "@/helpers/i18n";

LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreLogs(["The `redirect` prop on"]);
LogBox.ignoreLogs(["VirtualizedLists shoul"]);
LogBox.ignoreLogs(["i18next::pluralResolve"]);

import { de, registerTranslation } from "react-native-paper-dates";
registerTranslation("de", de);

function DefaultLayout() {
  return (
    <>
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
      </GestureHandlerRootView>
    </>
  );
}
let AppEntryPoint = DefaultLayout;

if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppEntryPoint = AppEntryPoint = require("../.storybook").default;
}

export default AppEntryPoint;
