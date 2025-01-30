import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Linking } from "react-native";
import CustomText from "@/components/elements/CustomText";
import { useTranslation } from "react-i18next";

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
        <CustomText className="mt-6 text-2xl">
          SEAS-Kirchengemeinde UG
        </CustomText>
        <CustomText className="text-2xl">(haftungsbeschränkt)</CustomText>

        <CustomText className="mt-6">Am Hohlweg 17</CustomText>
        <CustomText>58256 Ennepetal</CustomText>
        <CustomText t="germany" />

        <CustomText className="mt-6 text-2xl" t="managingPartner" />
        <CustomText>Helmut Haase</CustomText>
        <CustomText className="mt-6 text-2xl" t="commercialRegister" />
        <CustomText>HRB 12989</CustomText>
        <CustomText>Amtsgericht Hagen</CustomText>

        <CustomText className="mt-6 text-2xl" t="contact" />
        <CustomText>{t("email")}:</CustomText>
        <a
          className="text-green-700"
          href="mailto:info@seas-kirchengemeinde.de"
        >
          info@seas-kirchengemeinde.de
        </a>

        <CustomText className="mt-3">{t("telephone")}:</CustomText>
        <CustomText>+49 177 3764645</CustomText>

        <CustomText className="mt-6 text-2xl" t="bankDetails" />
        <CustomText>
          {t("accountHolder")}: Seas-Kirchengemeinde UG (haftungsbeschränkt)
        </CustomText>
        <CustomText>IBAN: DE67 1101 0100 2038 6082 75</CustomText>
        <CustomText>BIC: SOBKDEBBXXX</CustomText>
        <CustomText>{t("bank")}: Solaris Bank</CustomText>

        <CustomText className="mt-6 text-2xl" t="onlineDisputeResolution" />
        <CustomText className="text-lg">
          {t("onlineDisputePlatform")}{" "}
          <CustomText
            className="text-green-700"
            onPress={() =>
              Linking.openURL("https://ec.europa.eu/consumers/odr")
            }
          >
            https://ec.europa.eu/consumers/odr
          </CustomText>
        </CustomText>
        <CustomText className="text-lg" t="onlineDisputeExlusionClause" />
      </ScrollView>
    </SafeAreaView>
  );
}
