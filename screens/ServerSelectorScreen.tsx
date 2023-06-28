import { Text, Platform, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "@/tailwind";
import webConfig from "@/assets/config.json";
import useServerName from "@/hooks/useServerName";
import Input from "@/components/elements/Input";
import ErrorDisplay from "@/components/ErrorDisplay";
import Button from "@/components/elements/Button";

type ServerSelectorScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ServerSelectorScreen"
>;

type WebConfig = {
  serverId: string;
};

const ServerSelectorScreen = () => {
  const navigation = useNavigation<ServerSelectorScreenProps>();

  const { height } = useWindowDimensions();

  const [serverId, setServerId] = useState("");

  const [isError, setIsError] = useState(false);

  const [inputError, setInputError] = useState("");

  const [shouldCheckRedirect, setShouldCheck] = useState(true);

  const [isApiError, setIsApiError] = useState(false);

  const {
    fetchServerName,
    fetchIsServerError,
    fetchServerError,
    isFetchServerLoading,
  } = useServerName();

  useEffect(() => {
    navigation.setOptions({ title: "Server auswählen" });
    if (Platform.OS == "web") {
      // @ts-ignore - webpack magic
      let config: string = webConfig;
      fetch(config)
        .then((res) => res.json())
        .then((json: WebConfig) => {
          if (json.serverId) {
            AsyncStorage.setItem("serverId", json.serverId);
            navigation.replace("LoginScreen");
            return;
          }
        });
    }
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.getItem("serverId").then((res) => {
      if (!isFetchServerLoading && shouldCheckRedirect && res !== null) {
        setShouldCheck(false);
        setIsApiError(fetchIsServerError);
        if (fetchIsServerError) {
        } else {
          navigation.replace("LoginScreen");
        }
      }
    });
  }, [shouldCheckRedirect, fetchIsServerError, isFetchServerLoading]);

  const login = () => {
    setIsError(false);
    setIsApiError(false);
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

    AsyncStorage.setItem("serverId", serverId);

    setShouldCheck(true);
    fetchServerName();
  };

  return (
    <SafeAreaView
      style={tw.style({
        height: height,
      })}
    >
      <Text style={tw`w-full text-center mt-6 text-2xl font-bold`}>
        Willkommen in der Serverauswahl
      </Text>
      <View style={tw`px-4`}>
        <Text style={tw`w-full mt-12 text-lg`}>
          Zuerst muss die Server ID der Gemeinde eingegeben werden
        </Text>
        <Input
          placeholder="Server ID"
          autoFocus={true}
          onChangeText={(id) => setServerId(id)}
          style={"mt-1"}
        ></Input>
        <ErrorDisplay hasError={isError} error={inputError} />
        <ErrorDisplay
          hasError={isApiError}
          error={
            fetchServerError == "Not found"
              ? "Diese ID existiert nicht!"
              : fetchServerError
          }
        />

        <Text>Dies kann hinterher noch geändert werden.</Text>
        <Button onPress={login}>Speichern</Button>
      </View>
    </SafeAreaView>
  );
};

export default ServerSelectorScreen;
