import { Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";

export type ManageEventsScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageEventsScreen"
>;

const ManageEventsScreen = () => {
  const navigation = useNavigation<ManageEventsScreenProps>();

  return (
    <SettingsLayout navigation={navigation}>
      <Text>ManageEventsScreen</Text>
    </SettingsLayout>
  );
};

export default ManageEventsScreen;
