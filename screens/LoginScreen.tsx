import {
  View,
  Text,
  StatusBar,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Button } from "@rneui/base";
import tw from "../tailwind";
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";

type LoginScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenProps>();

  const isMd = useMediaQuery({
    minWidth: 768,
  });

  const isSm = useMediaQuery({
    minWidth: 640,
  });

  const { height } = useWindowDimensions();

  const isWeb = Platform.OS == "web";

  const [serverId, setServerId] = useState("");

  AsyncStorage.getItem("serverId").then((value) => {
    if (value == null) {
      navigation.replace("ServerSelectorScreen");
      return;
    }
    setServerId(value);
  });

  const back = () => {
    AsyncStorage.removeItem("serverId").then(() => {
      navigation.replace("ServerSelectorScreen");
    });
  };

  return (
    <View style={{ marginTop: StatusBar.currentHeight, margin: 0, padding: 0 }}>
      <View>
        <View
          style={tw.style(`flex w-full flex-row`, {
            height: height,
          })}
        >
          <View
            style={tw.style(
              {
                hidden: !isMd,
                flex: isMd,
              },
              ["flex-grow items-center gap-4 flex-col"]
            )}
          >
            <Text style={tw`text-4xl font-semibold mt-[10%]`}>Willkommen!</Text>
            <Text style={tw`text-2xl`}>{serverId}</Text>
          </View>
          <View
            style={tw.style(
              {
                "bg-white": isMd,
                "w-96": isMd,
                "justify-center": isMd,
                "w-full": !isMd,
                "shadow-lg": isSm || isMd,
              },
              "flex flex-col items-center border-l border-gray-200 px-4",
              {
                height: height,
              }
            )}
          >
            <Text
              style={tw.style(
                {
                  hidden: isMd,
                },
                `text-4xl font-semibold mt-12`
              )}
            >
              Willkommen!
            </Text>
            <Text
              style={tw.style(
                {
                  hidden: isMd,
                },
                `text-2xl text-center`
              )}
            >
              {serverId}
            </Text>
            <View
              style={tw.style(
                {
                  hidden: isMd,
                  flex: !isMd,
                },
                ` flex-row items-center self-stretch bg-[#e0e2e5] h-0.5 my-8`
              )}
            />
            <Text
              style={tw.style(
                {
                  "mb-12": isMd,
                },
                `text-4xl font-bold opacity-80 underline`
              )}
            >
              Login
            </Text>
            <View
              style={tw.style(
                {
                  "w-auto": isMd,
                  "px-0": isMd,
                  "px-20": isSm && !isMd,
                  "w-full": !isMd,
                  "px-2": !isMd && !isSm,
                },
                `mt-4 flex flex-col gap-2`
              )}
            >
              <TextInput
                placeholder="Email"
                style={tw`border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg`}
                autoFocus={true}
                placeholderTextColor={"gray"}
              ></TextInput>
              <TextInput
                placeholder="Passwort"
                style={tw`border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg`}
                placeholderTextColor={"gray"}
                secureTextEntry={true}
              ></TextInput>

              <Button
                style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold`}
                color={"#3882d6"}
              >
                Anmelden
              </Button>
              <View
                style={tw.style({
                  hidden: isWeb,
                })}
              >
                <Text style={tw`mt-2 mb-0`}>Falsch hier?</Text>
                <Button
                  style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold mt-0`}
                  color={"#3882d6"}
                  onPress={back}
                >
                  Woanders anmelden
                </Button>
              </View>
            </View>
            <Text
              style={tw`text-xs opacity-80 w-full text-center print:hidden mt-12`}
            >
              &copy; Helmut Haase 2022
            </Text>
            <Text
              style={tw`text-xs opacity-80 w-full text-center print:hidden`}
            ></Text>
            <Text
              style={tw.style(
                { hidden: !isWeb },
                `underline text-xs opacity-80 w-full text-center`
              )}
            >
              Impressum
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
