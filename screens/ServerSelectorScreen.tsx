import {
  Text,
  Platform,
  View,
  StatusBar,
  useWindowDimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigator/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "../tailwind";
import { Button } from "@rneui/base";

type ServerSelectorScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ServerSelectorScreen"
>;

const ServerSelectorScreen = () => {
  const navigation = useNavigation<ServerSelectorScreenProps>();

  const { height } = useWindowDimensions();

  const [serverId, setServerId] = useState("");

  const [isError, setIsError] = useState(false);

  const [inputError, setInputError] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: "Server auswählen" });
    if (Platform.OS == "web") {
      let configServer: string = Constants.expoConfig?.extra?.serverId;
      if (configServer) {
        AsyncStorage.setItem("serverId", configServer);
        navigation.replace("LoginScreen");
        return;
      }
    }

    AsyncStorage.getItem("serverId").then((value) => {
      if (value != null) {
        navigation.replace("LoginScreen");
        return;
      }
    });
  }, [navigation]);

  const login = () => {
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

    // TODO: validate existance with Server before continue

    AsyncStorage.setItem("serverId", serverId);
    navigation.replace("LoginScreen");
  };

  return (
    <View
      style={tw.style({
        marginTop: StatusBar.currentHeight,
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
        <TextInput
          placeholder="Server ID"
          style={tw`border border-black border-opacity-20 rounded-xl px-2 py-1 text-lg mt-1`}
          autoFocus={true}
          onChangeText={(id) => setServerId(id)}
          placeholderTextColor={"gray"}
        ></TextInput>
        <Text
          style={tw.style(
            {
              hidden: !isError,
            },
            "text-red-500 mb-2"
          )}
        >
          {inputError}
        </Text>
        <Text>Dies kann hinterher noch geändert werden.</Text>
        <Button
          containerStyle={tw`mt-2`}
          style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold`}
          color={"#3882d6"}
          title="Speichern"
          onPress={login}
        />
      </View>
    </View>
  );
};

export default ServerSelectorScreen;
