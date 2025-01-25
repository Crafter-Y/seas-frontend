import { Platform, Text, TextProps } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { resources } from "@/helpers/i18n";

export type CustomTextProps = {
  t?: keyof (typeof resources)["de"]["translation"];
  values?: {
    [name: string]: string;
  };
} & TextProps;

export default function CustomText(props: CustomTextProps) {
  const { t: i18n } = useTranslation();

  return (
    <Text {...props} android_hyphenationFrequency="normal">
      {typeof props.t == "string"
        ? i18n(props.t, props.values)
        : props.children}
      {/** Fix for android font issues https://github.com/facebook/react-native/issues/15114 */}
      {Platform.OS == "android" ? " " : undefined}
    </Text>
  );
}
