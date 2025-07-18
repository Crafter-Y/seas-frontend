import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomText from "@/components/elements/CustomText";
import Image from "@/components/elements/Image";
import Footer from "@/components/Footer";
import useVerifyTokenValidation from "@/hooks/api/useVerifyTokenValidation";

export default function VerifyScreen() {
  const { t } = useLocalSearchParams<{ t: string }>();
  const { t: i18n } = useTranslation();

  const { verify, tokenValid, setTokenValid, productName } =
    useVerifyTokenValidation();

  useEffect(() => {
    if (t && t.length === 36) {
      verify(t);
    } else {
      setTokenValid(false);
    }
  }, [setTokenValid, t, verify]);

  return (
    <SafeAreaView className="bg-seas-light-gray flex-row h-full">
      <View className="justify-center items-center w-full">
        <View className="w-full max-w-2xl border max-h-1/2 rounded-md border-gray-200">
          <View className="items-center">
            <Image
              source={require("@/public/adaptive-icon.png")}
              style={{
                height: 220,
                width: 220,
              }}
            />
          </View>

          <CustomText className="text-center text-lg" t="appName" />

          {tokenValid && productName && (
            <CustomText className="text-center mb-4">{productName}</CustomText>
          )}

          <View className="mx-5 mb-5">
            <CustomText className="font-semibold text-3xl text-center mb-8">
              {i18n("verifyAccount")}
            </CustomText>
            {tokenValid === false && (
              <>
                <CustomText t="weAreSorry" />
                <CustomText
                  className="text-red-500 text-2xl font-semibold"
                  t="thisLinkIsNoLongerValid"
                />
                <CustomText className="mt-2" t="mailProblablySentByAdmin" />
              </>
            )}
            {tokenValid === true && (
              <>
                <CustomText
                  className="text-green-500 text-2xl font-semibold"
                  t="emailVerified"
                />
                <CustomText className="mt-2" t="tabCanBeClosed" />
              </>
            )}
          </View>
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
}
