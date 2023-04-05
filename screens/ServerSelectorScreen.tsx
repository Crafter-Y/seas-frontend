import { Text, SafeAreaView, Button, Platform } from "react-native";
import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ServerSelectorProps = NativeStackNavigationProp<
  RootStackParamList,
  "ServerSelector"
>;

const ServerSelector = () => {
  const navigation = useNavigation<ServerSelectorProps>();

  useEffect(() => {
    if (Platform.OS == "web") {
      let configServer: string = Constants.expoConfig?.extra?.serverId;
      if (configServer) {
        AsyncStorage.setItem("serverId", configServer);
        navigation.replace("LoginScreen");
        return;
      }
    }

    AsyncStorage.getItem("serverId").then((value) => {
      if (value != null) {
        navigation.replace("LoginScreen");
        return;
      }
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <Text>Server Selector</Text>
      <Button
        title="Go to Testscreen"
        onPress={() => navigation.replace("LoginScreen")}
      />
    </SafeAreaView>
  );
};

export default ServerSelector;
