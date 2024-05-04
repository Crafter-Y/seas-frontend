import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Image from "@/components/elements/Image";
import useVerifyTokenValidation from "@/hooks/api/useVerifyTokenValidation";
import { useEffect } from "react";
import Footer from "@/components/Footer";

export default function VerifyScreen() {
  const { t } = useLocalSearchParams<{ t: string }>();
  const { height } = useWindowDimensions();

  const { verify, tokenValid, setTokenValid, productName } =
    useVerifyTokenValidation();

  useEffect(() => {
    if (t && t.length == 36) {
      verify(t);
    } else {
      setTokenValid(false);
    }
  }, [t]);

  return (
    <SafeAreaView
      style={tw.style(`m-0 p-0 bg-[${Color.LIGHT_GRAY}] flex-row`, {
        height,
      })}
    >
      <View style={tw`justify-center items-center w-full`}>
        <View
          style={tw`w-full max-w-2xl border max-h-1/2 rounded-md border-gray-200`}
        >
          <View style={tw`items-center`}>
            <Image
              source={require("@/public/adaptive-icon.png")}
              style={{
                height: 220,
                width: 220,
              }}
            />
          </View>

          <Text style={tw`text-center p-0 m-0 text-lg`}>
            SEAS Kirchengemeinde
          </Text>

          {tokenValid && productName && (
            <Text style={tw`text-center mb-4`}>{productName}</Text>
          )}

          <View style={tw`mx-5 mb-5`}>
            <Text style={tw`font-semibold text-3xl text-center mb-8`}>
              Account verifizieren
            </Text>
            {tokenValid === false && (
              <>
                <Text>Tut uns leid...</Text>
                <Text style={tw`text-red-500 text-2xl font-semibold`}>
                  Dieser Link ist nicht mehr gültig.
                </Text>
                <Text style={tw`mt-2`}>
                  Eine weitere Mail wurde vermutlich bereits von Ihrem
                  Administrator versendet.
                </Text>
              </>
            )}
            {tokenValid === true && (
              <>
                <Text style={tw`text-green-500 text-2xl font-semibold`}>
                  Sie haben ihre E-Mail Adresse erfolgreich verifiziert.
                </Text>
                <Text style={tw`mt-2`}>
                  Sie können diesen Tab nun schließen.
                </Text>
              </>
            )}
          </View>
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
