import React from "react";
import { Linking, View, ViewProps } from "react-native";

import CustomText from "@/components/elements/CustomText";

// Privacy policy and terms cover website and app; they live on the website only.
const LEGAL_URLS = {
  privacy: "https://seas-kirchengemeinde.de/privacy",
  terms: "https://seas-kirchengemeinde.de/conditions",
} as const;

export default function LegalLinks(props: ViewProps) {
  return (
    <View
      {...props}
      className={`flex-row justify-center gap-3 ${props.className ?? ""}`}
    >
      <CustomText
        t="privacy"
        className="underline text-xs opacity-80"
        onPress={() => Linking.openURL(LEGAL_URLS.privacy)}
      />
      <CustomText
        t="terms"
        className="underline text-xs opacity-80"
        onPress={() => Linking.openURL(LEGAL_URLS.terms)}
      />
    </View>
  );
}
