import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, useWindowDimensions, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "@/navigator/RootNavigator";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import Input from "@/components/elements/Input";
import useUpdatePassword from "@/hooks/api/useUpdatePassword";
import Footer from "@/components/Footer";
import SettingsBackButton from "@/components/SettingsBackButton";
import Divider from "@/components/elements/Divider";
import SettingsForm from "@/components/SettingsForm";
import H1 from "@/components/elements/H1";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";

export type ChangePasswordScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ChangePasswordScreen"
>;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<ChangePasswordScreenProps>();
  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

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
    <SafeAreaView style={tw`flex-row`}>
      <View
        style={tw.style(
          {
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center pl-4"
        )}
      >
        <SettingsBackButton navigation={navigation} />
        <H1 style={tw`text-right`}>Passwort ändern</H1>

        <Text style={tw`text-right mt-4 ml-4`}>
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
      <Divider
        type="VERTICAL"
        style={tw.style(
          {
            hidden: !isMd,
          },
          "my-16 mx-5"
        )}
      />
      <View
        style={tw.style({
          "justify-center": isMd,
          "items-center": !isMd,
          "w-full": !isMd,
        })}
      >
        <H1 style={tw`text-center mt-6 mb-12`}>Passwort ändern</H1>
        <SettingsForm>
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

          <ErrorDisplay hasError={hasUpdateError} error={updateError} />

          <Button
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
        </SettingsForm>
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
