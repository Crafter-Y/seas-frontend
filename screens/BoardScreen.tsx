import { ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import useAuthentication from "@/hooks/api/useAuthentication";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/RootNavigator";
import tw from "@/tailwind";
import BoardHeader from "@/components/BoardHeader";
import BoardSidebar from "@/components/BoardSidebar";
import Footer from "@/components/Footer";
import Board from "@/components/Board";
import useMediaQueries from "@/hooks/useMediaQueries";
import useServerName from "@/hooks/api/useServerName";
import { Color } from "@/helpers/Constants";

export type BoardScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "BoardScreen"
>;

export type BoardType =
  | "Jahresansicht"
  | "Quartal Ansicht"
  | "Monatsansicht"
  | "Wochenansicht";

const BoardScreen = () => {
  const { user, hasAuthError, logout } = useAuthentication();
  const navigation = useNavigation<BoardScreenProps>();

  const { serverName } = useServerName();

  const [boardType, setBoardType] = useState<BoardType>("Quartal Ansicht");

  const { height } = useWindowDimensions();
  const { isMd } = useMediaQueries();

  useEffect(() => {
    if (hasAuthError) {
      navigation.replace("LoginScreen");
    }
  }, [hasAuthError]);

  useEffect(() => {
    navigation.setOptions({ title: serverName ? "Plan ⋅ " + serverName : "Einteilungsplan" })
  }, [navigation, serverName])

  const changePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  const settings = () => {
    navigation.navigate("BaseSettingsScreen");
  };

  return (
    <SafeAreaView
      style={tw.style(`m-0 p-0 bg-[${Color.LIGHT_GRAY}] flex flex-row`, {
        height: isMd ? height : undefined,
      })}
    >
      <BoardSidebar
        user={user}
        boardType={boardType}
        setBoardType={setBoardType}
        logout={() => logout(navigation)}
        changePassword={changePassword}
        settings={settings}
      />
      <ScrollView>
        <BoardHeader
          user={user}
          setBoardType={setBoardType}
          boardType={boardType}
          logout={() => logout(navigation)}
          changePassword={changePassword}
          settings={settings}
        />
        <Board boardType={boardType} navigation={navigation} />
        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BoardScreen;
