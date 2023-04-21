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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import BoardHeader from "../components/BoardHeader";
import BoardSidebar from "../components/BoardSidebar";
import useMediaQueries from "../hooks/useMediaQueries";
import Footer from "../components/Footer";

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
  const { isAuthenticating, isAuthenticated, user } = useAuthentication();
  const navigation = useNavigation<BoardScreenProps>();
  const { height } = useWindowDimensions();

  const [boardType, setBoardType] = useState<BoardType>("Quartal Ansicht");

  const { isSm, isMd } = useMediaQueries();

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

  const changePassword = () => {
    navigation.navigate("ChangePasswordScreen");
  };

  return (
    <SafeAreaView
      style={tw.style("m-0 p-0 bg-lightgrayNeutral flex flex-row", {
        marginTop: StatusBar.currentHeight,
        height,
      })}
    >
      <BoardSidebar
        user={user}
        boardType={boardType}
        setBoardType={setBoardType}
        logout={logout}
        changePassword={changePassword}
      />
      <ScrollView>
        <BoardHeader
          user={user}
          setBoardType={setBoardType}
          boardType={boardType}
          logout={logout}
          changePassword={changePassword}
        />
        <View
          style={tw.style(
            {
              "mx-2": !isSm,
              "mx-4": isSm,
            },
            "bg-white mt-4 shadow-lg"
          )}
        >
          <Text>Board</Text>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BoardScreen;
