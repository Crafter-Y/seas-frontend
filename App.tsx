import React, { useState } from "react";
import { TailwindProvider } from "tailwind-rn";
import RootNavigator from "./navigator/RootNavigator";
import utilities from "./tailwind.json";

import { de, registerTranslation } from "react-native-paper-dates";
registerTranslation("de", de);

export type AppContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    // @ts-ignore - type wrong somehow
    <TailwindProvider utilities={utilities}>
      <AppContext.Provider value={{ currentUser: currentUser, setCurrentUser }}>
        <RootNavigator />
      </AppContext.Provider>
    </TailwindProvider>
  );
}
