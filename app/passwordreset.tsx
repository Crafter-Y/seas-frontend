import React, { useState } from "react";
import { View } from "react-native";
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
import CustomText from "@/components/elements/CustomText";
import { useTranslation } from "react-i18next";

export default function ResetPasswordScreen() {
  const { email: initEmail } = useLocalSearchParams();
  const { resetPasswordRequest, successfulRequest } = useResetPassword();

  const { isMd } = useMediaQueries();

  const [email, setEmail] = useState((initEmail ?? "") as string);

  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-row h-full">
      <Stack.Screen
        options={{
          title: t("resetPassword"),
          headerTitle: t("resetPassword"),
          headerBackTitle: t("login"),
          headerShown: !isMd,
        }}
      />
      <View className="w-1/3 items-end justify-center pl-4 hidden md:flex">
        <SettingsBackButton backRoute="/login/" />
        <H1 style={tw`text-right`} t="resetPassword" />

        <CustomText className="text-right mt-4 ml-4" t="resetPasswordText" />
        <Footer className="w-48 mt-12 hidden md:flex" />
      </View>
      <Divider type="VERTICAL" className="mx-5 my-16 hidden md:flex" />
      <View className="md:justify-center items-center md:items-start w-full md:w-auto">
        <H1
          className="text-center mt-6 mb-12 md:hidden px-4"
          t="resetPassword"
        />
        <SettingsForm>
          <CustomText className="md:hidden mb-2" t="resetPasswordText" />
          <Input
            placeholder={t("email")}
            inputMode="email"
            autoComplete="email"
            initialValue={email}
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => {
              resetPasswordRequest(email);
            }}
            returnKeyType="next"
          />

          {successfulRequest && (
            <CustomText className="text-green-500" t="passwordResetRequested" />
          )}

          {!successfulRequest && (
            <Button
              onPress={() => {
                resetPasswordRequest(email);
              }}
            >
              {t("resetPassword")}
            </Button>
          )}
        </SettingsForm>
        <Footer className="md:hidden w-full mt-12" />
      </View>
    </SafeAreaView>
  );
}
