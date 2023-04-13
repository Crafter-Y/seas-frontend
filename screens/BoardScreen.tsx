import {
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import useAuthentication from "../hooks/useAuthentication";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import tw from "../tailwind";
import BoardWideBoard from "../components/BoardSidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import BoardHeader from "../components/BoardHeader";

type BoardScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "BoardScreen"
>;

export type BoardType =
  | "Jahresansicht"
  | "Quartal Ansicht"
  | "Monatsansicht"
  | "Wochenansicht";

const BoardScreen = () => {
  const { isAuthenticating, isAuthenticated, user } = useAuthentication();
  const navigation = useNavigation<BoardScreenProps>();
  const { height } = useWindowDimensions();

  const [boardType, setBoardType] = useState<BoardType>("Quartal Ansicht");

  useEffect(() => {
    if (!isAuthenticating) {
      if (isAuthenticated) {
        console.log("Authenticated");
      } else {
        navigation.replace("LoginScreen");
      }
    }
  }, [isAuthenticating, isAuthenticated, navigation]);

  const logout = () => {
    let configServer: string = Constants.expoConfig?.extra?.apiServer;

    AsyncStorage.getItem("token").then((token) => {
      if (token != null) {
        fetch(`${configServer}/api/logout/`, {
          headers: {
            token,
          },
        }).finally(() => {
          AsyncStorage.removeItem("token").then(() => {
            navigation.replace("LoginScreen");
          });
        });
      } else {
        navigation.replace("LoginScreen");
      }
    });
  };

  return (
    <SafeAreaView
      style={tw.style("m-0 p-0 bg-lightgrayNeutral flex flex-row", {
        marginTop: StatusBar.currentHeight,
        height,
      })}
    >
      <BoardWideBoard
        user={user}
        boardType={boardType}
        setBoardType={setBoardType}
        logout={logout}
      />
      <ScrollView>
        <BoardHeader
          user={user}
          setBoardType={setBoardType}
          boardType={boardType}
          logout={logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BoardScreen;
