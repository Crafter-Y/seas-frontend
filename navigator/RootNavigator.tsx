import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServerSelectorScreen from "../screens/ServerSelectorScreen";
import LoginScreen from "../screens/LoginScreen";

export type RootStackParamList = {
  ServerSelectorScreen: undefined;
  LoginScreen: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
