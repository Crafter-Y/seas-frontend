import { Stack } from 'expo-router/stack';
import { LogBox, Platform, View } from 'react-native';

LogBox.ignoreLogs(["new NativeEventEmitter"])

import { de, registerTranslation } from "react-native-paper-dates";
import Toast from "react-native-toast-message";
registerTranslation("de", de);

export const unstable_settings = {
    initialRouteName: Platform.OS == "web" ? "login" : 'index',
};

export default function DefaultLayout() {
    return (<Stack screenOptions={{
        headerShown: false
    }} />);
}
