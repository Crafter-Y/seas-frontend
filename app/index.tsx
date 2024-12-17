import { Platform, useWindowDimensions, View } from "react-native";
import Image from "@/components/elements/Image";
import Input from "@/components/elements/Input";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import useServerName from "@/hooks/api/useServerName";
import { router } from "expo-router";
import { FetchState } from "@/helpers/Constants";
import RoundIconButton from "@/components/RoundIconButton";
import { ModalHandle } from "@/components/elements/Modal";
import DevelopmentServerModal from "@/components/DevelopmentServerModal";
import StartScreenWrapper from "@/components/StartScreenWrapper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import Text from "@/components/elements/Text";

export default function ServerSelectorScreen() {
  const { height, width } = useWindowDimensions();
  const { fetchServerName, fetchState, fetchServerError } = useServerName();
  const { t } = useTranslation();

  const [serverId, setServerId] = useState("");
  const [isError, setIsError] = useState(false);
  const [inputError, setInputError] = useState("");

  const apiModal = useRef<ModalHandle>(null);

  // If this is web, redirect immediately
  useEffect(() => {
    if (Platform.OS == "web") {
      setTimeout(() => {
        router.replace("/login");
      }, 1);
    } else {
      fetchServerName();
    }
  }, []);

  // redirect after successfull fetch
  useEffect(() => {
    if (fetchState == FetchState.SUCCEEDED)
      setTimeout(() => {
        router.replace("/login");
      }, 1);
  }, [fetchState]);

  const login = async () => {
    setIsError(false);
    if (serverId.length == 0) {
      setIsError(true);
      setInputError("error.noServerIdSpecified");
      return;
    }

    if (!/^\d+$/.test(serverId)) {
      setIsError(true);
      setInputError("error.serverIdNotValid");
      return;
    }

    await AsyncStorage.setItem("serverId", serverId);
    fetchServerName();
  };

  return (
    <StartScreenWrapper>
      {__DEV__ && (
        <View className="items-end p-1">
          <RoundIconButton
            icon={<AntDesign name="setting" size={20} color="black" />}
            onPress={() => apiModal.current!.openModal()}
            style="border rounded-xl"
          />
        </View>
      )}
      <View className="items-center">
        <Image
          source={require("@/public/adaptive-icon.png")}
          style={{
            height: Math.min(height, width) / 2,
            width: Math.min(height, width) / 2,
          }}
        />
      </View>
      <Text
        className="text-center text-3xl font-bold px-4"
        t="welcomeToServerSelection"
      />
      <View className="px-4">
        <Text className="mt-6 text-lg" t="specifyServerId" />
        <Input
          placeholder="Server ID"
          autoFocus={true}
          inputMode="numeric"
          onChangeText={(id) => setServerId(id)}
          style={"mt-1"}
          onSubmitEditing={login}
        />
        <ErrorDisplay hasError={isError} error={t(inputError)} />
        <ErrorDisplay
          hasError={!!fetchServerError}
          error={fetchServerError || ""}
        />

        <Text className="my-2" t="thisCanBeChangedLater" />
        <Button onPress={login}>{t("save")}</Button>
      </View>
      <DevelopmentServerModal ref={apiModal} />
    </StartScreenWrapper>
  );
}
