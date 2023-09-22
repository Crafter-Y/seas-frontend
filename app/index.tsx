import tw from '@/tailwind';
import { Platform, Text, View, useWindowDimensions } from 'react-native';
import Image from "@/components/elements/Image";
import Input from '@/components/elements/Input';
import ErrorDisplay from '@/components/ErrorDisplay';
import Button from '@/components/elements/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import useServerName from '@/hooks/api/useServerName';
import { router } from 'expo-router';

export default function ServerSelectorScreen() {
  const { height, width } = useWindowDimensions();

  const [serverId, setServerId] = useState("");

  const [isError, setIsError] = useState(false);

  const [inputError, setInputError] = useState("");

  const {
    fetchServerName,
    fetchSuccessful,
    fetchServerError
  } = useServerName();

  useEffect(() => {
    if (Platform.OS == "web") {
      setTimeout(() => {
        router.replace("/login")
      }, 1)
    }
  }, []);

  useEffect(() => {
    if (fetchSuccessful) setTimeout(() => {
      router.replace("/login")
    }, 1)
  }, [fetchSuccessful])

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
    <View>
      <View style={tw`items-center`}>
        <Image source={require("@/assets/adaptive-icon.png")} style={{
          height: Math.min(height, width) / 2,
          width: Math.min(height, width) / 2,
        }} />
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
          onChangeText={(id) => setServerId(id)}
          style={"mt-1"}
        ></Input>
        <ErrorDisplay hasError={isError} error={inputError} />
        <ErrorDisplay hasError={!!fetchServerError} error={fetchServerError || ""} />

        <Text>Dies kann hinterher noch geändert werden.</Text>
        <Button onPress={login}>Speichern</Button>
      </View>
    </View>
  );
}
