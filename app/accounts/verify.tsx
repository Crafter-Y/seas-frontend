import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Image from "@/components/elements/Image";
import useVerifyTokenValidation from "@/hooks/api/useVerifyTokenValidation";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import CustomText from "@/components/elements/CustomText";
import React from "react";

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

          <CustomText style={tw`text-center p-0 m-0 text-lg`}>
            SEAS Kirchengemeinde
          </CustomText>

          {tokenValid && productName && (
            <CustomText style={tw`text-center mb-4`}>{productName}</CustomText>
          )}

          <View style={tw`mx-5 mb-5`}>
            <CustomText style={tw`font-semibold text-3xl text-center mb-8`}>
              Account verifizieren
            </CustomText>
            {tokenValid === false && (
              <>
                <CustomText>Tut uns leid...</CustomText>
                <CustomText style={tw`text-red-500 text-2xl font-semibold`}>
                  Dieser Link ist nicht mehr gültig.
                </CustomText>
                <CustomText style={tw`mt-2`}>
                  Eine weitere Mail wurde vermutlich bereits von Ihrem
                  Administrator versendet.
                </CustomText>
              </>
            )}
            {tokenValid === true && (
              <>
                <CustomText style={tw`text-green-500 text-2xl font-semibold`}>
                  Sie haben ihre E-Mail Adresse erfolgreich verifiziert.
                </CustomText>
                <CustomText style={tw`mt-2`}>
                  Sie können diesen Tab nun schließen.
                </CustomText>
              </>
            )}
          </View>
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
