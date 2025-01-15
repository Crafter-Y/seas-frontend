import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";
import { Stack } from "expo-router";
import { Linking } from "react-native";
import CustomText from "@/components/elements/CustomText";

export default function ImprintScreen() {
  useEffect(() => {
    document.title = "Impressum";
  }, []);

  return (
    <SafeAreaView style={{ margin: 0, padding: 0 }}>
      <Stack.Screen options={{ headerShown: true, title: "Impressum" }} />
      <ScrollView
        style={tw.style(
          { backgroundColor: "#f2f2f2" },
          "px-4 gap-2 pt-4 pb-12"
        )}
      >
        <CustomText style={tw`text-4xl font-bold opacity-95 underline`}>
          Impressum
        </CustomText>
        <CustomText style={tw`mt-6 text-2xl`}>
          SEAS-Kirchengemeinde UG
        </CustomText>
        <CustomText style={tw`text-2xl`}>(haftungsbeschränkt)</CustomText>

        <CustomText style={tw`mt-6`}>Am Hohlweg 17</CustomText>
        <CustomText>58256 Ennepetal</CustomText>
        <CustomText>Deutschland</CustomText>

        <CustomText style={tw`mt-6 text-2xl`}>
          Geschäftsführender Gesellschafter
        </CustomText>
        <CustomText>Helmut Haase</CustomText>
        <CustomText style={tw`mt-6 text-2xl`}>Handelsregister</CustomText>
        <CustomText>HRB 12989</CustomText>
        <CustomText>Amtsgericht Hagen</CustomText>

        <CustomText style={tw`mt-6 text-2xl`}>Kontakt</CustomText>
        <CustomText>E-Mail-Adresse:</CustomText>
        <a
          style={tw`text-green-700`}
          href="mailto:info@seas-kirchengemeinde.de"
        >
          info@seas-kirchengemeinde.de
        </a>

        <CustomText style={tw`mt-3`}>Telefon:</CustomText>
        <CustomText>+49 177 3764645</CustomText>

        <CustomText style={tw`mt-6 text-2xl`}>Kontoverbindung</CustomText>
        <CustomText>
          Kontoinhaber: Seas-Kirchengemeinde UG (haftungsbeschränkt)
        </CustomText>
        <CustomText>IBAN: DE67 1101 0100 2038 6082 75</CustomText>
        <CustomText>BIC: SOBKDEBBXXX</CustomText>
        <CustomText>Bank: Solaris Bank</CustomText>

        <CustomText style={tw`mt-6 text-2xl`}>
          Online-Streitbeilegung
        </CustomText>
        <CustomText style={tw`text-lg`}>
          Plattform der Europäischen Kommission zur Online-Streitbeilegung (OS)
          für Verbraucher{" "}
          <CustomText
            style={tw`text-green-700`}
            onPress={() =>
              Linking.openURL("https://ec.europa.eu/consumers/odr")
            }
          >
            https://ec.europa.eu/consumers/odr
          </CustomText>
        </CustomText>
        <CustomText style={tw`text-lg`}>
          Wir sind nicht verpflichtet, an einem Streitbeteiligungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </CustomText>
      </ScrollView>
    </SafeAreaView>
  );
}
