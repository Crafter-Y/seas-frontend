import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigator/RootNavigator";
import tw from "../tailwind";
import useMediaQueries from "../hooks/useMediaQueries";
import Input from "../components/Input";
import { Button } from "@rneui/base";
import useUpdatePassword from "../hooks/useUpdatePassword";
import Footer from "../components/Footer";
import { Image } from "expo-image";

export type ChangePasswordScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePasswordScreen"
>;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<ChangePasswordScreenProps>();
  const { height } = useWindowDimensions();

  const { isMd, isSm } = useMediaQueries();

  const { updatePassword, hasUpdateError, updateError } = useUpdatePassword();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const secondInput = useRef<TextInput>(null);
  const thirdInput = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Passwort ändern",
      headerTitle: "Zurück",
      headerShown: !isMd,
    });
  }, [navigation, isMd]);

  return (
    <SafeAreaView
      style={{
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <View
        style={tw.style(
          {
            flex: isMd,
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center flex-col pl-4"
        )}
      >
        <View style={tw.style({}, "flex flex-row gap-1 items-center mb-4")}>
          <Image
            source={require("../assets/img/previous.svg")}
            style={tw`h-4 w-4`}
          />
          <Pressable onPress={() => navigation.navigate("BoardScreen")}>
            <Text style={tw.style("font-semibold underline")}>Zurück</Text>
          </Pressable>
        </View>
        <Text
          style={tw.style(
            {},
            "text-4xl font-bold opacity-95 underline text-right"
          )}
        >
          Passwort ändern
        </Text>
        <Text style={tw.style({}, "text-right mt-4 ml-4")}>
          Das vergebene Standartpasswort ist recht unsicher. Deshalb sollte es
          geändert werden. Das neue Passwort muss mindestens 7 Zeichen haben.
          Erlaubt sind Buchstaben, Zahlen und Sonderzeichen: -_!?/*%$
        </Text>
        <Footer
          navigation={navigation}
          style={tw.style(
            {
              hidden: !isMd,
            },
            "w-48 mt-12"
          )}
        />
      </View>
      <View
        style={tw.style(
          {
            hidden: !isMd,
          },
          "my-16 bg-[#e0e2e5] w-0.5 mx-5"
        )}
      ></View>
      <View
        style={tw.style(
          {
            "justify-center": isMd,
            "items-center": !isMd,
            "w-full": !isMd,
          },
          "flex"
        )}
      >
        <Text
          style={tw.style(
            {
              hidden: isMd,
            },
            "text-4xl font-bold opacity-95 underline text-center mt-6 mb-12"
          )}
        >
          Passwort ändern
        </Text>
        <View
          style={tw.style(
            {
              "w-full": !isMd,
              "w-72": isMd,
              "px-6": !isSm && !isMd,
              "px-24": isSm && !isMd,
              "px-0": isMd,
            },
            "flex flex-col gap-2"
          )}
        >
          <Input
            placeholder="Vorheriges Passwort"
            onChangeText={(text) => setOldPassword(text)}
            secureTextEntry={true}
            onSubmitEditing={() => secondInput.current?.focus()}
            returnKeyType="next"
          ></Input>
          <Input
            placeholder="Neues Passwort festlegen"
            onChangeText={(text) => setNewPassword1(text)}
            secureTextEntry={true}
            onSubmitEditing={() => thirdInput.current?.focus()}
            ref={secondInput}
            returnKeyType="next"
          ></Input>
          <Input
            placeholder="Passwort wiederholen"
            onChangeText={(text) => setNewPassword2(text)}
            secureTextEntry={true}
            ref={thirdInput}
            returnKeyType="done"
          ></Input>

          <Text
            style={tw.style(
              {
                hidden: !hasUpdateError,
              },
              "text-red-500 mb-2"
            )}
          >
            {updateError}
          </Text>

          <Button
            style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold`}
            color={"#3882d6"}
            onPress={() =>
              updatePassword(
                oldPassword,
                newPassword1,
                newPassword2,
                navigation
              )
            }
          >
            Passwort ändern
          </Button>
        </View>
        <Footer
          navigation={navigation}
          style={tw.style({
            hidden: isMd,
          })}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
