import tw from "@/tailwind";
import { Platform, Text, useWindowDimensions, View } from "react-native";
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

export default function ServerSelectorScreen() {
  const { height, width } = useWindowDimensions();
  const { fetchServerName, fetchState, fetchServerError } = useServerName();

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
      setInputError("Du musst eine Server ID angeben.");
      return;
    }

    if (!/^\d+$/.test(serverId)) {
      setIsError(true);
      setInputError("Du musst eine gültige Server ID angeben.");
      return;
    }

    await AsyncStorage.setItem("serverId", serverId);
    fetchServerName();
  };

  return (
    <StartScreenWrapper>
      {__DEV__ && (
        <View style={tw`w-full items-end p-1`}>
          <RoundIconButton
            imageSource={require("@/assets/img/settings.svg")}
            onPress={() => apiModal.current!.openModal()}
            style={tw`border rounded-xl`}
          />
        </View>
      )}
      <View style={tw`items-center`}>
        <Image
          source={require("@/public/adaptive-icon.png")}
          style={{
            height: Math.min(height, width) / 2,
            width: Math.min(height, width) / 2,
          }}
        />
      </View>
      <Text style={tw`w-full text-center mt-6 text-2xl font-bold`}>
        Willkommen in der Serverauswahl
      </Text>
      <View style={tw`px-4`}>
        <Text style={tw`w-full mt-6 text-lg`}>
          Zuerst muss die Server ID der Gemeinde eingegeben werden
        </Text>
        <Input
          placeholder="Server ID"
          autoFocus={true}
          inputMode="numeric"
          onChangeText={(id) => setServerId(id)}
          style={"mt-1"}
          onSubmitEditing={login}
        />
        <ErrorDisplay hasError={isError} error={inputError} />
        <ErrorDisplay
          hasError={!!fetchServerError}
          error={fetchServerError || ""}
        />

        <Text>Dies kann hinterher noch geändert werden.</Text>
        <Button onPress={login}>Speichern</Button>
      </View>
      <DevelopmentServerModal ref={apiModal} />
    </StartScreenWrapper>
  );
}
