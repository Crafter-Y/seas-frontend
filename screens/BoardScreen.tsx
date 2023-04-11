import { View, Text, StatusBar } from "react-native";
import React, { useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";

type BoardScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "BoardScreen"
>;

const BoardScreen = () => {
  const { isAuthenticating, isAuthenticated, user } = useAuthentication();
  const navigation = useNavigation<BoardScreenProps>();

  useEffect(() => {
    if (!isAuthenticating) {
      if (isAuthenticated) {
        console.log("Authenticated");
      } else {
        navigation.replace("LoginScreen");
      }
    }
  }, [isAuthenticating, isAuthenticated, navigation]);

  return (
    <View style={{ marginTop: StatusBar.currentHeight, margin: 0, padding: 0 }}>
      <Text>BoardScreen</Text>
      <Text>
        Hallo {user?.firstname} {user?.lastname}
      </Text>
    </View>
  );
};

export default BoardScreen;
