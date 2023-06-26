import { Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigator/RootNavigator";
import { SettingsLayout } from "../../components/layouts/SettingsLayout";

export type ManagePagesScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManagePagesScreen"
>;

const ManagePagesScreen = () => {
  const navigation = useNavigation<ManagePagesScreenProps>();

  return (
    <SettingsLayout navigation={navigation}>
      <Text>ManagePagesScreen</Text>
    </SettingsLayout>
  );
};

export default ManagePagesScreen;
