import { Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigator/RootNavigator";
import { SettingsLayout } from "../../components/layouts/SettingsLayout";

export type ManageCommentTemplatesScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageCommentTemplatesScreen"
>;

const ManageCommentTemplatesScreen = () => {
  const navigation = useNavigation<ManageCommentTemplatesScreenProps>();

  return (
    <SettingsLayout navigation={navigation}>
      <Text>ManageCommentTemplatesScreen</Text>
    </SettingsLayout>
  );
};

export default ManageCommentTemplatesScreen;
