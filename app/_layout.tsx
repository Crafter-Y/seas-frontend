import { Stack } from "expo-router/stack";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreLogs(["The `redirect` prop on"]);
LogBox.ignoreLogs(["VirtualizedLists shoul"]);

import { de, registerTranslation } from "react-native-paper-dates";
registerTranslation("de", de);

export default function DefaultLayout() {
  return (
    <>
      <StatusBar translucent={true} animated={true} style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
