import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServerSelectorScreen from "@/screens/ServerSelectorScreen";
import LoginScreen from "@/screens/LoginScreen";
import BoardScreen from "@/screens/BoardScreen";
import ImprintScreen from "@/screens/ImprintScreen";
import ChangePasswordScreen from "@/screens/ChangePasswordScreen";
import BaseSettingsScreen from "@/screens/settings/BaseSettingsScreen";
import ManageUsersScreen from "@/screens/settings/ManageUsersScreen";
import ManagePositionsScreen from "@/screens/settings/ManagePositionsScreen";
import ManageEventsScreen from "@/screens/settings/ManageEventsScreen";
import ManageCommentTemplatesScreen from "@/screens/settings/ManageCommentTemplatesScreen";
import ManagePagesScreen from "@/screens/settings/ManagePagesScreen";

export type RootStackParamList = {
  ServerSelectorScreen: undefined;
  LoginScreen: undefined;
  BoardScreen: undefined;
  ImprintScreen: undefined;
  ChangePasswordScreen: undefined;
  SettingsScreen: undefined;
  SettingsNavigator: undefined;
  ManageUsersScreen: undefined;
  ManagePositionsScreen: undefined;
  ManageEventsScreen: undefined;
  ManageCommentTemplatesScreen: undefined;
  ManagePagesScreen: undefined;
  BaseSettingsScreen: undefined;
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
        <Stack.Screen
          name="BaseSettingsScreen"
          component={BaseSettingsScreen}
        ></Stack.Screen>
        <Stack.Screen
          name="ManageUsersScreen"
          component={ManageUsersScreen}
          options={{ headerShown: true }}
        ></Stack.Screen>
        <Stack.Screen
          name="ManagePositionsScreen"
          component={ManagePositionsScreen}
        ></Stack.Screen>
        <Stack.Screen
          name="ManageEventsScreen"
          component={ManageEventsScreen}
        ></Stack.Screen>
        <Stack.Screen
          name="ManageCommentTemplatesScreen"
          component={ManageCommentTemplatesScreen}
        ></Stack.Screen>
        <Stack.Screen
          name="ManagePagesScreen"
          component={ManagePagesScreen}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
