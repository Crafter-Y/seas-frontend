import React, { useState } from "react";
import { TailwindProvider } from "tailwind-rn";
import { LogBox } from "react-native"
import RootNavigator from "./navigator/RootNavigator";
import utilities from "./tailwind.json";

import { de, registerTranslation } from "react-native-paper-dates";
import Toast from "react-native-toast-message";
registerTranslation("de", de);

// this does not remove the console warnings, but the inapp development warnings
LogBox.ignoreLogs(["new NativeEventEmitter"])

export default function App() {
  return (
    // @ts-ignore - type wrong somehow
    <TailwindProvider utilities={utilities}>
      <RootNavigator />
      <Toast
        visibilityTime={1500}
      />
    </TailwindProvider>
  );
}
