import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomText from "@/components/elements/CustomText";
import LegalLinks from "@/components/LegalLinks";

export default function ImprintScreen() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("imprint");
  }, [t]);

  return (
    <SafeAreaView className="h-full">
      <Stack.Screen options={{ headerShown: true, title: t("imprint") }} />
      <ScrollView className="px-4 gap-2 pt-4 pb-12 bg-seas-settings-bg">
        <CustomText
          className="text-4xl font-bold opacity-95 underline"
          t="imprint"
        />
        <CustomText className="mt-6" t="imprintOperator" />
        <CustomText className="mt-3 text-2xl">
          Bastian Biedermann Software & IT-Dienstleistungen
        </CustomText>

        <CustomText className="mt-3">Bastian Biedermann</CustomText>
        <CustomText>Kaiserstraße 29</CustomText>
        <CustomText>58119 Hagen</CustomText>
        <CustomText t="germany" />

        <CustomText className="mt-6 text-2xl" t="contact" />
        <CustomText>
          {t("email")}: info&lt;at&gt;seas-kirchengemeinde.de
        </CustomText>
        <CustomText>{t("telephone")}: +49 176 55576845</CustomText>

        <CustomText className="mt-6 text-2xl" t="consumerDisputeResolution" />
        <CustomText t="consumerDisputeClause" />

        <LegalLinks className="mt-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
