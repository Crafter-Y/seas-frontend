import { router, Stack } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import H1 from "@/components/elements/H1";
import Input from "@/components/elements/Input";
import ErrorDisplay from "@/components/ErrorDisplay";
import Footer from "@/components/Footer";
import SettingsBackButton from "@/components/SettingsBackButton";
import SettingsForm from "@/components/SettingsForm";
import useUpdatePassword from "@/hooks/api/useUpdatePassword";
import useMediaQueries from "@/hooks/useMediaQueries";

export default function ChangePasswordScreen() {
  const { updatePassword, hasUpdateError, updateError } = useUpdatePassword();

  const { isMd } = useMediaQueries();
  const { t } = useTranslation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const secondInput = useRef<TextInput>(null);
  const thirdInput = useRef<TextInput>(null);

  return (
    <SafeAreaView className="flex-row h-full">
      <Stack.Screen
        options={{
          title: t("changePassword"),
          headerTitle: t("changePassword"),
          headerBackTitle: t("board"),
          headerShown: !isMd,
        }}
      />
      <View className="w-1/3 items-end justify-center pl-4 hidden md:flex">
        <SettingsBackButton backRoute="/board/" />
        <H1 className="text-right" t="changePassword" />

        <CustomText className="text-right mt-4 ml-4" t="newPasswordCriteria" />
        <Footer className="w-48 mt-12 hidden md:flex" />
      </View>
      <Divider type="VERTICAL" className="my-16 mx-5 hidden md:flex" />
      <View className="md:justify-center items-center md:items-start w-full md:w-auto">
        <H1 t="changePassword" className="text-center mb-12 md:hidden" />
        <SettingsForm>
          <CustomText className="md:hidden mb-2" t="newPasswordCriteria" />
          <Input
            placeholder={t("previousPassword")}
            onChangeText={(text) => setOldPassword(text)}
            secureTextEntry={true}
            autoComplete="password"
            onSubmitEditing={() => secondInput.current?.focus()}
            returnKeyType="next"
          />
          <Input
            placeholder={t("setNewPassword")}
            onChangeText={(text) => setNewPassword1(text)}
            secureTextEntry={true}
            autoComplete="new-password"
            onSubmitEditing={() => thirdInput.current?.focus()}
            ref={secondInput}
            returnKeyType="next"
          />
          <Input
            placeholder={t("repeatPassword")}
            onChangeText={(text) => setNewPassword2(text)}
            secureTextEntry={true}
            autoComplete="new-password"
            ref={thirdInput}
            returnKeyType="done"
          />

          <ErrorDisplay
            hasError={hasUpdateError}
            // TODO: i18n: translate errors in hook and api responses
            error={
              updateError === "Wrong password"
                ? "Das eingegebene Passwort stimmt nicht"
                : updateError
            }
          />

          <Button
            onPress={() =>
              updatePassword(oldPassword, newPassword1, newPassword2, router)
            }
          >
            {t("changePassword")}
          </Button>
        </SettingsForm>
        <Footer className="md:hidden w-[90%] mt-12" />
      </View>
    </SafeAreaView>
  );
}
