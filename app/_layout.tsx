import { Stack } from "expo-router/stack";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from "expo-constants";
import { default as StorybookUIRoot } from "../.storybook";

LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreLogs(["The `redirect` prop on"]);
LogBox.ignoreLogs(["VirtualizedLists shoul"]);

import { de, registerTranslation } from "react-native-paper-dates";
registerTranslation("de", de);

function DefaultLayout() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar translucent={true} animated={true} style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </GestureHandlerRootView>
    </>
  );
}
let AppEntryPoint = DefaultLayout;

if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  AppEntryPoint = StorybookUIRoot;
}

export default AppEntryPoint;
