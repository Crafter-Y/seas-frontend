import React, { useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import Input from "@/components/elements/Input";
import Footer from "@/components/Footer";
import SettingsBackButton from "@/components/SettingsBackButton";
import Divider from "@/components/elements/Divider";
import SettingsForm from "@/components/SettingsForm";
import H1 from "@/components/elements/H1";
import Button from "@/components/elements/Button";
import { Stack, useLocalSearchParams } from "expo-router";
import useResetPassword from "@/hooks/api/useResetPassword";

export default function ResetPasswordScreen() {
  const { height } = useWindowDimensions();
  const { email: initEmail } = useLocalSearchParams();
  const { resetPasswordRequest, successfulRequest } = useResetPassword();

  const { isMd } = useMediaQueries();

  const [email, setEmail] = useState((initEmail ?? "") as string);

  return (
    <SafeAreaView style={tw`flex-row`}>
      <Stack.Screen
        options={{
          title: "Passwort zurücksetzen",
          headerTitle: "Zurück",
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
        <SettingsBackButton backRoute="/login/" />
        <H1 style={tw`text-right`}>Passwort zurücksetzen</H1>

        <Text style={tw`text-right mt-4 ml-4`}>
          Sie haben Ihr Passwort vergessen? Hier können Sie ein neues
          beantragen. Wir senden Ihnen ein neues Passwort per E-Mail.
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
          Passwort zurücksetzen
        </H1>
        <SettingsForm>
          <Input
            placeholder="Email"
            inputMode="email"
            initialValue={email}
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => {
              resetPasswordRequest(email);
            }}
            returnKeyType="next"
          />

          {successfulRequest && (
            <Text style={tw`text-green-500`}>
              Sie sollten in Kürze eine E-Mail mit Link zum Zurücksetzen
              bekommen!
            </Text>
          )}

          <Button
            onPress={() => {
              resetPasswordRequest(email);
            }}
          >
            Passwort zurücksetzen
          </Button>
        </SettingsForm>
        <Footer
          style={tw.style({
            hidden: isMd,
            "w-full": true,
          })}
        />
      </View>
    </SafeAreaView>
  );
}
