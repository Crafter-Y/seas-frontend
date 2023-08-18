import React, { useState } from "react";
import { TailwindProvider } from "tailwind-rn";
import { LogBox } from "react-native"
import RootNavigator from "./navigator/RootNavigator";
import utilities from "./tailwind.json";

import { de, registerTranslation } from "react-native-paper-dates";
import { AppContext } from "./helpers/AppContext";
import Toast from "react-native-toast-message";
registerTranslation("de", de);

// this does not remove the console warnings, but the inapp development warnings
LogBox.ignoreLogs(["new NativeEventEmitter"])

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    // @ts-ignore - type wrong somehow
    <TailwindProvider utilities={utilities}>
      <AppContext.Provider value={{ currentUser: currentUser, setCurrentUser }}>
        <RootNavigator />
      </AppContext.Provider>
      <Toast
        visibilityTime={1500}
      />
    </TailwindProvider>
  );
}
