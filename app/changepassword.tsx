import React, { useRef, useState } from "react";
import { Text, TextInput, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { router, Stack } from "expo-router";

export default function ChangePasswordScreen() {
  const { height } = useWindowDimensions();

  const { isMd } = useMediaQueries();

  const { updatePassword, hasUpdateError, updateError } = useUpdatePassword();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const secondInput = useRef<TextInput>(null);
  const thirdInput = useRef<TextInput>(null);

  return (
    <SafeAreaView style={tw`flex-row`}>
      <Stack.Screen
        options={{
          title: "Passwort ändern",
          headerTitle: "Passwort ändern",
          headerBackTitle: "Board",
          headerShown: !isMd,
        }}
      />
      <View
        style={tw.style(
          {
            hidden: !isMd,
            height,
          },
          "w-1/3 items-end justify-center pl-4"
        )}
      >
        <SettingsBackButton backRoute="/board/" />
        <H1 style={tw`text-right`}>Passwort ändern</H1>

        <Text style={tw`text-right mt-4 ml-4`}>
          Das neue Passwort muss mindestens 7 Zeichen haben. Erlaubt sind
          Buchstaben, Zahlen und Sonderzeichen: -_!?/*%$
        </Text>
        <Footer
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
        <H1
          style={tw.style("text-center mt-6 mb-12", {
            hidden: isMd,
          })}
        >
          Passwort ändern
        </H1>
        <SettingsForm>
          <Input
            placeholder="Vorheriges Passwort"
            onChangeText={(text) => setOldPassword(text)}
            secureTextEntry={true}
            autoComplete="password"
            onSubmitEditing={() => secondInput.current?.focus()}
            returnKeyType="next"
          />
          <Input
            placeholder="Neues Passwort festlegen"
            onChangeText={(text) => setNewPassword1(text)}
            secureTextEntry={true}
            autoComplete="new-password"
            onSubmitEditing={() => thirdInput.current?.focus()}
            ref={secondInput}
            returnKeyType="next"
          />
          <Input
            placeholder="Passwort wiederholen"
            onChangeText={(text) => setNewPassword2(text)}
            secureTextEntry={true}
            autoComplete="new-password"
            ref={thirdInput}
            returnKeyType="done"
          />

          <ErrorDisplay
            hasError={hasUpdateError}
            error={
              updateError == "Wrong password"
                ? "Das eingegebene Passwort stimmt nicht"
                : updateError
            }
          />

          <Button
            onPress={() =>
              updatePassword(oldPassword, newPassword1, newPassword2, router)
            }
          >
            Passwort ändern
          </Button>
        </SettingsForm>
        <Footer
          style={tw.style({
            hidden: isMd,
            "w-[90%]": true,
          })}
        />
      </View>
    </SafeAreaView>
  );
}
