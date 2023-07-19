import React from "react";

export type AppContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

export const AppContext = React.createContext<AppContextType | null>(null);
