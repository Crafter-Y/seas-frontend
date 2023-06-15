import {
  View,
  Text,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@rneui/base";
import tw from "../tailwind";
import "@expo/match-media";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import useServerName from "../hooks/useServerName";
import useAuthentication from "../hooks/useAuthentication";
import useMediaQueries from "../hooks/useMediaQueries";
import Input from "../components/Input";

export type LoginScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenProps>();

  const { isSm, isMd } = useMediaQueries();

  const { height } = useWindowDimensions();

  const isWeb = Platform.OS == "web";

  const { serverName, fetchServerError } = useServerName();

  const { login, authError, isAuthenticating, hasAuthError, isAuthenticated } =
    useAuthentication();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const secondInput = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem("serverId").then((value) => {
      if (value == null) {
        navigation.replace("ServerSelectorScreen");
        return;
      }
      navigation.setOptions({ title: value });
    });
  }, [navigation]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace("BoardScreen");
    }
  }, [isAuthenticated, navigation]);

  const back = () => {
    AsyncStorage.removeItem("serverId").then(() => {
      navigation.replace("ServerSelectorScreen");
    });
  };

  const submit = () => {
    login(email, password, navigation);
  };

  return (
    <SafeAreaView style={{ margin: 0, padding: 0 }}>
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
            <Text style={tw`text-2xl`}>{serverName}</Text>
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
              {serverName}
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
              <Text
                style={tw.style(
                  {
                    hidden: !fetchServerError,
                  },
                  "w-full rounded-lg bg-red-500 px-2 py-1 text-lg"
                )}
              >
                {fetchServerError}
              </Text>
              <Input
                placeholder="Email"
                autoFocus={true}
                onChangeText={(text) => setEmail(text)}
                onSubmitEditing={() => secondInput.current?.focus()}
                returnKeyType="next"
              ></Input>
              <Input
                placeholder="Passwort"
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                ref={secondInput}
                returnKeyType="done"
                onSubmitEditing={submit}
              ></Input>

              <Button
                style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold`}
                color={"#3882d6"}
                onPress={submit}
              >
                Anmelden
              </Button>
              <Text
                style={tw.style(
                  {
                    hidden: !hasAuthError && !isAuthenticating,
                  },
                  "text-red-500 mb-2"
                )}
              >
                {authError == "Bad Request"
                  ? "Email oder Passwort stimmt nicht"
                  : authError}
              </Text>
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
              onPress={() => {
                navigation.navigate("ImprintScreen");
              }}
            >
              Impressum
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
