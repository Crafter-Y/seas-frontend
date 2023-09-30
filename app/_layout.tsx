import { Stack } from "expo-router/stack";
import { LogBox, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreLogs(["The `redirect` prop on"]);

import { de, registerTranslation } from "react-native-paper-dates";
import Toast from "react-native-toast-message";
registerTranslation("de", de);

export const unstable_settings = {
  initialRouteName: Platform.OS == "web" ? "login" : "index",
};

export default function DefaultLayout() {
  return (<>
    <StatusBar translucent={true} animated={true} style='auto' />
    <Stack screenOptions={{
      headerShown: false
    }} />
    <Toast
      visibilityTime={1500}
    />
  </>);
}
