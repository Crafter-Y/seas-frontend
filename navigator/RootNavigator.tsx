import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServerSelectorScreen from "../screens/ServerSelectorScreen";
import LoginScreen from "../screens/LoginScreen";
import BoardScreen from "../screens/BoardScreen";
import ImprintScreen from "../screens/ImprintScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createSettingsNavigator } from "./SettingsNavigator";
import BaseSettingsScreen from "../screens/settings/BaseSettingsScreen";

export type RootStackParamList = {
  ServerSelectorScreen: undefined;
  LoginScreen: undefined;
  BoardScreen: undefined;
  ImprintScreen: undefined;
  ChangePasswordScreen: undefined;
  SettingsScreen: undefined;
  SettingsNavigator: undefined;
};

export type SettingsStackParamList = {
  BaseSettingsScreen: undefined;
};

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
