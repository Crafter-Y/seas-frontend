import { Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigator/RootNavigator";
import { SettingsLayout } from "../../components/layouts/SettingsLayout";

export type ManageUsersScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageUsersScreen"
>;

const ManageUsersScreen = () => {
  const navigation = useNavigation<ManageUsersScreenProps>();

  return (
    <SettingsLayout navigation={navigation}>
      <Text>ManageUsersScreen</Text>
    </SettingsLayout>
  );
};

export default ManageUsersScreen;
