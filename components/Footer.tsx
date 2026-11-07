import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MailComposer from "expo-mail-composer";
import { router } from "expo-router";
import React from "react";
import { Linking, Platform, View, ViewProps } from "react-native";

import CustomText from "@/components/elements/CustomText";
import LegalLinks from "@/components/LegalLinks";

const Footer = (props: ViewProps) => {
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
    <View className="my-4 flex items-center" {...props}>
      <CustomText className="text-xs opacity-80 w-full text-center">
        &copy; 2022 - {new Date().getFullYear()} Bastian Biedermann Software
        &amp; IT-Dienstleistungen
      </CustomText>
      <CustomText
        className={`text-xs opacity-80 text-center underline ${
          Platform.OS !== "web" ? "hidden" : ""
        }`}
        onPress={() => {
          router.navigate("/imprint");
        }}
      >
        Impressum
      </CustomText>
      <LegalLinks />
      <CustomText className="text-xs opacity-80 w-full text-center mt-2">
        Mit ♥️ programmiert von Bastian Biedermann &#x2022;{" "}
        <CustomText className="underline" onPress={mailtoReport}>
          Fehler melden
        </CustomText>
      </CustomText>
    </View>
  );
};

export default Footer;
