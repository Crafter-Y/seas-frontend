import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import { RootStackParamList } from "../navigator/RootNavigator";

type ChangePasswordScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePasswordScreen"
>;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<ChangePasswordScreenProps>();

  useEffect(() => {
    navigation.setOptions({
      title: "Passwort ändern",
      headerShown: Platform.OS != "web",
    });
  }, [navigation]);
  return (
    <SafeAreaView
      style={{ marginTop: StatusBar.currentHeight, margin: 0, padding: 0 }}
    ></SafeAreaView>
  );
};

export default ChangePasswordScreen;
