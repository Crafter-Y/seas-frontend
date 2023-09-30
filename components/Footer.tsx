import { View, Text, Platform, Linking } from "react-native";
import React from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";
import { router } from "expo-router";

type Props = {
  style?: ClassInput;
};

const Footer = ({ style = {} }: Props) => {
  const mailtoReport = () => {
    let url = "mailto:helmut_h_haase@yahoo.de";
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  return (
    <View style={tw.style(`my-4 flex items-center`, style)}>
      <Text style={tw`text-xs opacity-80 w-full text-center`}>
        &copy; Helmut Haase 2022-2023
      </Text>
      <Text
        style={tw.style(
          {
            hidden: Platform.OS != "web",
          },
          `text-xs opacity-80 text-center underline`
        )}
        onPress={() => {
          router.push("/imprint");
        }}
      >
        Impressum
      </Text>
      <Text style={tw`text-xs opacity-80 w-full text-center mt-2`}>
        Mit ♥️ programmiert von Bastian Biedermann &#x2022;{" "}
        <Text style={tw`underline`} onPress={mailtoReport}>
          Fehler melden
        </Text>
      </Text>
    </View>
  );
};

export default Footer;
