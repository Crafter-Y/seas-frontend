import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServerSelector from "../screens/ServerSelectorScreen";
import LoginScreen from "../screens/LoginScreen";

export type RootStackParamList = {
  ServerSelector: undefined;
  LoginScreen: undefined;
};

const RootNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ServerSelector"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="ServerSelector" component={ServerSelector} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
