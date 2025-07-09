import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { AppContext } from "@/helpers/appContext";
import useMediaQueries from "@/hooks/useMediaQueries";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function ProtectedLayout() {
  const state = useContext(AppContext);

  const { t } = useTranslation();
  const { isMd } = useMediaQueries();

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

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="changepassword"
        options={{
          title: t("changePassword"),
          headerTitle: t("changePassword"),
          headerBackTitle: t("board"),
          headerShown: !isMd,
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          headerShown: !isMd,
          headerBackTitle: t("back"),
          title: t("settings"),
        }}
      />
      <Stack.Screen
        name="settings/comments"
        options={{
          headerShown: !isMd,
          title: t("settings"),
        }}
      />
      <Stack.Screen
        name="settings/events"
        options={{
          headerShown: !isMd,
          title: t("settings"),
        }}
      />
      <Stack.Screen
        name="settings/pages"
        options={{
          headerShown: !isMd,
          title: t("settings"),
        }}
      />
      <Stack.Screen
        name="settings/positions"
        options={{
          headerShown: !isMd,
          title: t("settings"),
        }}
      />
      <Stack.Screen
        name="settings/users"
        options={{
          headerShown: !isMd,
          title: t("settings"),
        }}
      />
    </Stack>
  );
}
