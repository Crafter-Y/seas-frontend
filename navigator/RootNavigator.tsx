import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServerSelectorScreen from "../screens/ServerSelectorScreen";
import LoginScreen from "../screens/LoginScreen";
import BoardScreen from "../screens/BoardScreen";
import ImprintScreen from "../screens/ImprintScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import { createSettingsNavigator } from "./SettingsNavigator";
import BaseSettingsScreen from "../screens/settings/BaseSettingsScreen";
import ManageUsersScreen from "../screens/settings/ManageUsersScreen";
import ManagePositionsScreen from "../screens/settings/ManagePositionsScreen";
import ManageEventsScreen from "../screens/settings/ManageEventsScreen";
import ManageCommentTemplatesScreen from "../screens/settings/ManageCommentTemplatesScreen";
import ManagePagesScreen from "../screens/settings/ManagePagesScreen";

export type RootStackParamList = {
  ServerSelectorScreen: undefined;
  LoginScreen: undefined;
  BoardScreen: undefined;
  ImprintScreen: undefined;
  ChangePasswordScreen: undefined;
  SettingsScreen: undefined;
  SettingsNavigator: undefined;
};

export const settingsScreens = {
  ManageUsersScreen: undefined,
  ManagePositionsScreen: undefined,
  ManageEventsScreen: undefined,
  ManageCommentTemplatesScreen: undefined,
  ManagePagesScreen: undefined,
};

export const settingsTitles = {
  ManageCommentTemplatesScreen: "Kommentarvorlagen",
  ManageEventsScreen: "Termine verwalten",
  ManagePagesScreen: "Pläne verwalten",
  ManagePositionsScreen: "Spalten verwalten",
  ManageUsersScreen: "Mitglieder verwalten",
};

const allSettingsScreens = {
  BaseSettingsScreen: undefined,
  ...settingsScreens,
};

export type SettingsStackParamList = typeof allSettingsScreens;

const SettingsNavigator = () => {
  const SettingsNavigator = createSettingsNavigator<SettingsStackParamList>();
  return (
    <SettingsNavigator.Navigator
      initialRouteName="BaseSettingsScreen"
      screenOptions={{ headerShown: false }}
    >
      <SettingsNavigator.Screen
        name="BaseSettingsScreen"
        component={BaseSettingsScreen}
      ></SettingsNavigator.Screen>
      <SettingsNavigator.Screen
        name="ManageUsersScreen"
        component={ManageUsersScreen}
      ></SettingsNavigator.Screen>
      <SettingsNavigator.Screen
        name="ManagePositionsScreen"
        component={ManagePositionsScreen}
      ></SettingsNavigator.Screen>
      <SettingsNavigator.Screen
        name="ManageEventsScreen"
        component={ManageEventsScreen}
      ></SettingsNavigator.Screen>
      <SettingsNavigator.Screen
        name="ManageCommentTemplatesScreen"
        component={ManageCommentTemplatesScreen}
      ></SettingsNavigator.Screen>
      <SettingsNavigator.Screen
        name="ManagePagesScreen"
        component={ManagePagesScreen}
      ></SettingsNavigator.Screen>
    </SettingsNavigator.Navigator>
  );
};

const RootNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ServerSelectorScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="ServerSelectorScreen"
          component={ServerSelectorScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="BoardScreen" component={BoardScreen} />
        <Stack.Screen name="ImprintScreen" component={ImprintScreen} />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen name="SettingsNavigator" component={SettingsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
