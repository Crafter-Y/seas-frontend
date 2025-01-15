import { Linking, Platform, View } from "react-native";
import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";
import { router } from "expo-router";
import * as MailComposer from "expo-mail-composer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "./elements/CustomText";

type Props = {
  style?: ClassInput;
};

const Footer = ({ style = {} }: Props) => {
  const mailtoReport = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      const url = "mailto:info@seas-kirchengemeinde.de";
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      });
      return;
    }

    const serverId = await AsyncStorage.getItem("serverId");

    await MailComposer.composeAsync({
      recipients: ["info@seas-kirchengemeinde.de"],
      subject: `Bugreport: serverId: ${serverId}`,
      body: "Bitte beschreiben Sie den Fehler: \n\n\nWas haben Sie getan, bevor der Fehler aufgetreten ist?: \n\n\n",
    });
  };

  return (
    <View style={tw.style("my-4 flex items-center", style)}>
      <CustomText style={tw`text-xs opacity-80 w-full text-center`}>
        &copy; (copyright) Helmut Haase 2022 - {new Date().getFullYear()} • SEAS
        Kirchengemeinde UG (haftungsbeschränkt)
      </CustomText>
      <CustomText
        style={tw.style(
          {
            hidden: Platform.OS != "web",
          },
          "text-xs opacity-80 text-center underline"
        )}
        onPress={() => {
          router.navigate("/imprint");
        }}
      >
        Impressum
      </CustomText>
      <CustomText style={tw`text-xs opacity-80 w-full text-center mt-2`}>
        Mit ♥️ programmiert von Bastian Biedermann &#x2022;{" "}
        <CustomText style={tw`underline`} onPress={mailtoReport}>
          Fehler melden
        </CustomText>
      </CustomText>
    </View>
  );
};

export default Footer;
