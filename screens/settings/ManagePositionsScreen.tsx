import { Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";

export type ManagePositionsScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManagePositionsScreen"
>;

const ManagePositionsScreen = () => {
  const navigation = useNavigation<ManagePositionsScreenProps>();

  return (
    <SettingsLayout navigation={navigation}>
      <Text>ManagePositionsScreen</Text>
    </SettingsLayout>
  );
};

export default ManagePositionsScreen;
