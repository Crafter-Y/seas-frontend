import AntDesign from "@expo/vector-icons/AntDesign";
import { Redirect, router } from "expo-router";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, useWindowDimensions, View } from "react-native";

import DevelopmentServerModal from "@/components/DevelopmentServerModal";
import Button from "@/components/elements/Button";
import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";
import Input from "@/components/elements/Input";
import { ModalHandle } from "@/components/elements/Modal";
import ErrorDisplay from "@/components/ErrorDisplay";
import RoundIconButton from "@/components/RoundIconButton";
import StartScreenWrapper from "@/components/StartScreenWrapper";
import { AppContext } from "@/helpers/appContext";

export default function ServerSelectorScreen() {
  const { selectServer, selectServerError } = useContext(AppContext);
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();

  const [serverId, setServerId] = useState("");
  const [isError, setIsError] = useState(false);
  const [inputError, setInputError] = useState("");

  const apiModal = useRef<ModalHandle>(null);

  const submit = async () => {
    setIsError(false);
    if (serverId.length === 0) {
      setIsError(true);
      setInputError("error.noServerIdSpecified");
      return;
    }

    if (!/^\d+$/.test(serverId)) {
      setIsError(true);
      setInputError("error.serverIdNotValid");
      return;
    }

    selectServer(serverId);
  };

  if (Platform.OS === "web") {
    return <Redirect href="/login" />;
  }

  return (
    <StartScreenWrapper>
      {__DEV__ && (
        <View className="items-end p-1 flex-row justify-end gap-2">
          <RoundIconButton
            icon={<AntDesign name="setting" size={20} color="black" />}
            onPress={() => setTimeout(() => apiModal.current!.openModal(), 1)}
            className="border rounded-xl"
            testID="development-server-selector"
          />
          <RoundIconButton
            icon={<AntDesign name="eye" size={20} color="black" />}
            onPress={() => router.navigate("/storybook")}
            className="border rounded-xl"
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
      <CustomText
        className="text-center text-3xl font-bold px-4"
        t="welcomeToServerSelection"
        testID="server-selector-welcome-text"
      />
      <View className="px-4 mb-2">
        <CustomText className="mt-6 text-lg" t="specifyServerId" />
        <Input
          placeholder="Server ID"
          inputMode="numeric"
          onChangeText={(id) => setServerId(id)}
          className="mt-1"
          onSubmitEditing={submit}
          testID="server-id-input"
        />
        <ErrorDisplay
          hasError={isError}
          error={isError && inputError !== "" ? t(inputError) : ""}
        />
        <ErrorDisplay
          hasError={selectServerError !== null}
          error={selectServerError || ""}
        />
        <Button
          onPress={submit}
          className="my-2"
          testID="server-id-submit-button"
        >
          {t("save")}
        </Button>
        <CustomText t="thisCanBeChangedLater" />
      </View>
      <DevelopmentServerModal ref={apiModal} />
    </StartScreenWrapper>
  );
}
