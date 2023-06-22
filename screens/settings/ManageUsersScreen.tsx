import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsStackParamList } from "../../navigator/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import useMediaQueries from "../../hooks/useMediaQueries";
import { SafeAreaView } from "react-native-safe-area-context";

export type ManageUsersScreenProps = NativeStackNavigationProp<
  SettingsStackParamList,
  "ManageUsersScreen"
>;

const ManageUsersScreen = () => {
  const navigation = useNavigation<ManageUsersScreenProps>();

  const { isMd } = useMediaQueries();

  useEffect(() => {
    if (!isMd) {
      navigation.setOptions({
        headerShown: true,
        title: "Mitglieder verwalten",
      });
    } else {
      navigation.setOptions({ headerShown: false });
    }
  }, [isMd]);

  return (
    <SafeAreaView>
      <Text>ManageUsersScreen</Text>
    </SafeAreaView>
  );
};

export default ManageUsersScreen;
