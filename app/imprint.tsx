import React, { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/tailwind";
import { Stack } from "expo-router";
import { Linking } from "react-native";

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
        <Text style={tw`text-4xl font-bold opacity-95 underline`}>
          Impressum
        </Text>
        <Text style={tw`mt-6 text-2xl`}>SEAS-Kirchengemeinde UG</Text>
        <Text style={tw`text-2xl`}>(haftungsbeschränkt)</Text>

        <Text style={tw`mt-6`}>Am Hohlweg 17</Text>
        <Text>58256 Ennepetal</Text>
        <Text>Deutschland</Text>

        <Text style={tw`mt-6 text-2xl`}>Geschäftsführender Gesellschafter</Text>
        <Text>Helmut Haase</Text>
        <Text style={tw`mt-6 text-2xl`}>Handelsregister</Text>
        <Text>HRB 12989</Text>
        <Text>Amtsgericht Hagen</Text>

        <Text style={tw`mt-6 text-2xl`}>Kontakt</Text>
        <Text>E-Mail-Adresse:</Text>
        <a
          style={tw`text-green-700`}
          href="mailto:info@seas-kirchengemeinde.de"
        >
          info@seas-kirchengemeinde.de
        </a>

        <Text style={tw`mt-3`}>Telefon:</Text>
        <Text>+49 177 3764645</Text>

        <Text style={tw`mt-6 text-2xl`}>Kontoverbindung</Text>
        <Text>Kontoinhaber: Seas-Kirchengemeinde UG (haftungsbeschränkt)</Text>
        <Text>IBAN: DE67 1101 0100 2038 6082 75</Text>
        <Text>BIC: SOBKDEBBXXX</Text>
        <Text>Bank: Solaris Bank</Text>

        <Text style={tw`mt-6 text-2xl`}>Online-Streitbeilegung</Text>
        <Text style={tw`text-lg`}>
          Plattform der Europäischen Kommission zur Online-Streitbeilegung (OS)
          für Verbraucher{" "}
          <Text
            style={tw`text-green-700`}
            onPress={() =>
              Linking.openURL("https://ec.europa.eu/consumers/odr")
            }
          >
            https://ec.europa.eu/consumers/odr
          </Text>
        </Text>
        <Text style={tw`text-lg`}>
          Wir sind nicht verpflichtet, an einem Streitbeteiligungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
