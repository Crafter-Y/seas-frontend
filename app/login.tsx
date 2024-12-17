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
import StartScreenWrapper from "@/components/StartScreenWrapper";
import Text from "@/components/elements/Text";
import AntDesign from "@expo/vector-icons/AntDesign";
import clsx from "classnames";

type WebConfig = {
  serverId: string;
};

export default function LoginScreen() {
  const { login, authError, hasAuthError, user } = useAuthentication();
  const { isSm, isMd } = useMediaQueries();

  const isWeb = Platform.OS == "web";

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
    <StartScreenWrapper>
      <View>
        <View className="flex-row">
          <View
            className={clsx("flex-grow items-center gap-4", {
              hidden: !isMd,
              flex: isMd,
            })}
          >
            <Text t={"welcome"} className="text-4xl font-semibold mt-[12%]" />
            <Text className="text-2xl">{serverName}</Text>
          </View>
          <View
            className={clsx(
              "items-center border-l border-gray-200 px-4 h-screen",
              {
                "bg-white": isMd,
                "w-96": isMd,
                "justify-center": isMd,
                "w-full": !isMd,
                "shadow-lg": isSm || isMd,
              }
            )}
          >
            {__DEV__ && Platform.OS == "web" && (
              <View className="w-full items-end p-1">
                <RoundIconButton
                  icon={<AntDesign name="setting" size={20} color="black" />}
                  onPress={() => apiModal.current!.openModal()}
                  style="border rounded-xl"
                />
              </View>
            )}
            <Text
              t={"welcome"}
              className={clsx(
                {
                  hidden: isMd,
                },
                "text-4xl font-semibold mt-12"
              )}
            />
            <Text
              className={clsx(
                {
                  hidden: isMd,
                },
                "text-2xl text-center"
              )}
            >
              {serverName}
            </Text>

            <Divider
              type="HORIZONTAL"
              style={tw.style("my-8 w-full", {
                hidden: isMd,
              })}
            />

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
            <Text
              t="copyrightFooter"
              values={{ year: new Date().getFullYear() + "" }}
              className="text-xs opacity-80 text-center mt-12"
            />
            <Text
              t="imprint"
              onPress={() => {
                router.navigate("/imprint");
              }}
              className={clsx(
                { hidden: !isWeb },
                "underline text-xs opacity-80 w-full text-center"
              )}
            />
          </View>
        </View>
      </View>
      <DevelopmentServerModal ref={apiModal} />
    </StartScreenWrapper>
  );
}
