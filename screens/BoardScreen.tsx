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

  const [boardType, setBoardType] = useState<BoardType>("Quartal Ansicht");

  const { height } = useWindowDimensions();
  const { isMd } = useMediaQueries();

  useEffect(() => {
    if (hasAuthError) {
      navigation.replace("LoginScreen");
    }
  }, [hasAuthError]);

  const changePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  const settings = () => {
    navigation.navigate("BaseSettingsScreen");
  };

  return (
    <SafeAreaView
      style={tw.style("m-0 p-0 bg-lightgrayNeutral flex flex-row", {
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
        <Board boardType={boardType} />
        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BoardScreen;
