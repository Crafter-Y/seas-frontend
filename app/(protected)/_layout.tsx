import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { Platform } from "react-native";

import { AppContext } from "@/helpers/appContext";

export default function ProtectedLayout() {
  const state = useContext(AppContext);

  if (!state.isReady) {
    return null;
  }

  if (state.serverId === null) {
    if (Platform.OS === "web") {
      console.error(
        "No serverId set, but trying to access protected route on web. This should not happen.",
      );
    } else {
      return <Redirect href="/serverselection" />;
    }
  }

  if (state.user === null) {
    return <Redirect href="/login" />;
  }

  // if (!authState.isLoggedIn) {
  //   return <Redirect href="/login" />;
  // }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
