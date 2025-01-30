import tw from "@/tailwind";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Image from "@/components/elements/Image";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Input from "@/components/elements/Input";
import usePasswordTokenInfo from "@/hooks/api/usePasswortTokenInfo";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";
import useRedeemPasswordToken from "@/hooks/api/useRedeemPasswordToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import CustomText from "@/components/elements/CustomText";
import { resources } from "@/helpers/i18n";
import { useTranslation } from "react-i18next";

export default function VerifyScreen() {
  const { t, intent } = useLocalSearchParams<{ t: string; intent: string }>();
  const { t: i18n } = useTranslation();

  const { redeemToken, successfulRedeem, redeemError } =
    useRedeemPasswordToken();

  const tokenInput = useRef<TextInput>(null);

  const {
    verify,
    tokenValid,
    setTokenValid,
    productName,
    productId,
    firstname,
    lastname,
    email,
  } = usePasswordTokenInfo();

  const [title, setTitle] =
    useState<keyof (typeof resources)["de"]["translation"]>("changePassword");

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const thirdInput = useRef<TextInput>(null);

  useEffect(() => {
    if (tokenValid) {
      AsyncStorage.setItem("serverId", productId);
    }
  }, [productId, tokenValid]);

  useEffect(() => {
    if (t && t.length === 36) {
      verify(t);
    } else {
      setTokenValid(false);
    }
  }, [t]);

  useEffect(() => {
    switch (intent) {
      case "onboarding": {
        setTitle("createAccount");
        break;
      }
      default:
        setTitle("setYourPassword");
    }
  }, [intent]);

  return (
    <SafeAreaView className="bg-seas-light-gray flex-row h-full">
      <View className="justify-center items-center w-full">
        <View className="w-full max-w-2xl border rounded-md border-gray-200">
          <View className="items-center">
            <Image
              source={require("@/public/adaptive-icon.png")}
              style={{
                height: 220,
                width: 220,
              }}
            />
          </View>

          <CustomText className="text-center text-lg">
            SEAS Kirchengemeinde
          </CustomText>

          <View className="mx-5 mb-5">
            <CustomText
              className="font-semibold text-3xl text-center mb-8"
              t={title}
            />

            <CustomText className="text-xs ml-2" t="token" />
            <Input
              placeholder={i18n("token")}
              // TODO: handle manual token input
              onChangeText={() => {}}
              disabled={!(t === "" || t === undefined)}
              inputMode="text"
              ref={tokenInput}
              initialValue={t}
            />
            <Input
              placeholder={i18n("email")}
              style={tw`hidden`}
              onChangeText={() => {}}
              disabled={true}
              inputMode="email"
              initialValue={email}
            />
            {/** TODO: check for the token input field and hide if there is no token */}
            {tokenValid === false && (
              <>
                <CustomText className="mt-4" t="weAreSorry" />
                <CustomText
                  className="text-red-500 text-2xl font-semibold"
                  t="thisLinkIsNoLongerValid"
                />
                <CustomText className="mt-2" t="didNewPasswordRequest" />
              </>
            )}
            {tokenValid === true && productName && t && !successfulRedeem && (
              <>
                <CustomText className="mt-6">
                  {intent === "onboarding" ? i18n("welcome") : i18n("hello")}{" "}
                  {firstname} {lastname}, {i18n("pleaseSetAccountPassword")}{" "}
                  <CustomText className="font-semibold">
                    {productName}
                  </CustomText>
                  :
                </CustomText>
                <CustomText className="mt-2" t="newPasswordCriteria" />

                <Input
                  placeholder={i18n("setPassword")}
                  onChangeText={(text) => setNewPassword1(text)}
                  secureTextEntry={true}
                  autoComplete="new-password"
                  onSubmitEditing={() => thirdInput.current?.focus()}
                  returnKeyType="next"
                  className="mt-2"
                />
                <Input
                  placeholder={i18n("repeatPassword")}
                  onChangeText={(text) => setNewPassword2(text)}
                  secureTextEntry={true}
                  autoComplete="new-password"
                  onSubmitEditing={() =>
                    redeemToken(t, newPassword1, newPassword2)
                  }
                  ref={thirdInput}
                  returnKeyType="done"
                  className="mt-2 mb-4"
                />
                <ErrorDisplay
                  hasError={redeemError !== ""}
                  // TODO: i18n: translate errors in hook and api
                  error={redeemError}
                />

                <Button
                  onPress={() => redeemToken(t, newPassword1, newPassword2)}
                >
                  {i18n("setPassword")}
                </Button>
              </>
            )}
            {successfulRedeem && productName && (
              <>
                <CustomText style={tw`text-green-500 text-2xl font-semibold`}>
                  {i18n("passwordSuccessfully")}{" "}
                  {intent === "onboarding" ? i18n("hasSet") : i18n("changed")}.
                </CustomText>
                <CustomText style={tw`mt-2`}>
                  {i18n("canNowLogin.0")}{" "}
                  <CustomText style={tw`font-semibold`}>
                    {productName}
                  </CustomText>{" "}
                  {i18n("canNowLogin.1")}
                </CustomText>
                <Button onPress={() => router.replace("/login")}>
                  {i18n("backToLoginPage")}
                </Button>
              </>
            )}
          </View>
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
