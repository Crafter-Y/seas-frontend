import { Platform, View } from "react-native";
import React, { useEffect, useRef } from "react";
import tw from "@/tailwind";
import "@expo/match-media";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useServerName from "@/hooks/api/useServerName";
import useMediaQueries from "@/hooks/useMediaQueries";
import H1 from "@/components/elements/H1";
import Divider from "@/components/elements/Divider";
import { router, useSegments } from "expo-router";
import LoginForm from "@/components/LoginForm";
import useAuthentication from "@/hooks/api/useAuthentication";
import { Store } from "@/helpers/store";
import { FetchState } from "@/helpers/Constants";
import RoundIconButton from "@/components/RoundIconButton";
import { ModalHandle } from "@/components/elements/Modal";
import DevelopmentServerModal from "@/components/DevelopmentServerModal";
import CustomText from "@/components/elements/CustomText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type WebConfig = {
  serverId: string;
};

export default function LoginScreen() {
  const { login, authError, hasAuthError, user } = useAuthentication();
  const { isMd } = useMediaQueries();

  const { serverName, fetchServerError, fetchServerName } = useServerName();

  const segments = useSegments();

  const apiModal = useRef<ModalHandle>(null);

  const back = async () => {
    await AsyncStorage.removeItem("serverId");
    Store.update((state) => {
      state.serverNameState = FetchState.FETCHING;
    });
    router.replace("/");
  };

  // (web) prepare server id if not set in local Storage
  useEffect(() => {
    if (Platform.OS == "web") {
      AsyncStorage.getItem("serverId").then((serverId) => {
        if (serverId == null) {
          fetch("/config.json")
            .then((res) => res.json())
            .then((res: WebConfig) => {
              if (res.serverId) {
                AsyncStorage.setItem("serverId", res.serverId).then(() => {
                  fetchServerName();
                });
                document.title = "Login ⋅ " + res.serverId;
              }
            });
        } else {
          fetchServerName();
        }
      });
    }
  }, []);

  // set title for web if serverName is loaded
  useEffect(() => {
    if (Platform.OS == "web" && serverName && segments[0] == "login")
      document.title = "Login ⋅ " + serverName;
  }, [serverName, segments]);

  // (mobile) if serverName is not or error, redirect to server select page
  useEffect(() => {
    if (Platform.OS != "web" && !serverName && fetchServerError)
      setTimeout(() => {
        router.replace("/");
      }, 1);
  }, [serverName, fetchServerError]);

  // if user object is set, redirect to board
  useEffect(() => {
    if (user != null) {
      router.replace("/board/");
    }
  }, [user]);

  return (
    <>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            paddingTop: Constants.statusBarHeight,
          }}
          className="md:hidden"
        />
        <View className="flex-row">
          <View className="flex-grow items-center gap-4 hidden md:flex">
            <CustomText
              t="welcome"
              className="text-4xl font-semibold mt-[12%]"
            />
            <CustomText className="text-2xl">{serverName}</CustomText>
          </View>
          <View className="items-center border-l border-gray-200 px-4 md:h-screen w-full md:bg-white md:w-96 md:justify-center sm:shadow-lg pb-12 md:pb-0 min-h-screen">
            {__DEV__ && Platform.OS == "web" && (
              <View className="w-full items-end p-1">
                <RoundIconButton
                  icon={<AntDesign name="setting" size={20} color="black" />}
                  onPress={() => apiModal.current!.openModal()}
                  style="border rounded-xl"
                />
              </View>
            )}
            <CustomText
              t="welcome"
              className="text-4xl font-semibold mt-12 md:hidden"
            />
            <CustomText className={"text-2xl text-center md:hidden"}>
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
            />

            <LoginForm
              login={login}
              hasAuthError={hasAuthError}
              authError={authError}
              back={back}
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
