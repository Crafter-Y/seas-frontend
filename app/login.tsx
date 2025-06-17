import "@expo/match-media"; // I don't remember why this is needed, but I am afraid something breaks if I remove it

import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import { router, useSegments } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import DevelopmentServerModal from "@/components/DevelopmentServerModal";
import CustomText from "@/components/elements/CustomText";
import Divider from "@/components/elements/Divider";
import H1 from "@/components/elements/H1";
import { ModalHandle } from "@/components/elements/Modal";
import LoginForm from "@/components/LoginForm";
import RoundIconButton from "@/components/RoundIconButton";
import { AppContext } from "@/helpers/appContext";
import useMediaQueries from "@/hooks/useMediaQueries";
import tw from "@/tailwind";

export default function LoginScreen() {
  const { returnToServerSelection, serverName, loginError, login } =
    useContext(AppContext);

  const { isMd } = useMediaQueries();
  const { t } = useTranslation();
  const segments = useSegments();

  const apiModal = useRef<ModalHandle>(null);

  // set title for web if serverName is loaded
  useEffect(() => {
    if (Platform.OS === "web" && serverName && segments[0] === "login")
      document.title = t("login") + " ⋅ " + serverName;
  }, [serverName, segments, t]);

  return (
    <>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={50}
      >
        <View
          style={{
            paddingTop: Constants.statusBarHeight,
          }}
          className="md:hidden"
        />
        <View className="flex-row">
          <View className="flex-grow items-center gap-4 hidden md:flex">
            <CustomText className="text-4xl font-semibold mt-[12%]">
              {t("welcome")}!
            </CustomText>
            <CustomText className="text-2xl">{serverName}</CustomText>
          </View>
          <View className="items-center border-l border-gray-200 px-4 md:h-screen w-full md:bg-white md:w-96 md:justify-center sm:shadow-lg pb-12 md:pb-0 min-h-screen">
            {__DEV__ && Platform.OS === "web" && (
              <View className="w-full items-end p-1">
                <RoundIconButton
                  icon={<AntDesign name="setting" size={20} color="black" />}
                  onPress={() => apiModal.current!.openModal()}
                  className="border rounded-xl"
                />
              </View>
            )}
            <CustomText className="text-4xl font-semibold mt-12 md:hidden">
              {t("welcome")}!
            </CustomText>
            <CustomText className="text-2xl text-center md:hidden">
              {serverName}
            </CustomText>

            <View className="w-full md:hidden">
              <Divider type="HORIZONTAL" style={tw.style("my-8 w-full")} />
            </View>

            <H1
              t="login"
              style={tw.style({
                "mb-12": isMd,
              })}
              testID="login-title"
            />

            <LoginForm
              login={(email, password) => login(email, password)}
              hasAuthError={loginError !== null}
              authError={loginError || ""}
              back={() => returnToServerSelection()}
            />
            <CustomText
              t="copyrightFooter"
              values={{ year: new Date().getFullYear() + "" }}
              className="text-xs opacity-80 text-center mt-12"
            />
            <CustomText
              t="imprint"
              onPress={() => {
                router.navigate("/imprint");
              }}
              className="underline text-xs opacity-80 w-full text-center native:hidden"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <DevelopmentServerModal ref={apiModal} />
    </>
  );
}
