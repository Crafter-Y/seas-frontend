import { Platform, Text, TextProps } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  t?: string;
  values?: {
    [name: string]: string;
  };
} & TextProps;

export default function CustomText(props: Props) {
  const { t: i18n } = useTranslation();

  return (
    <Text {...props} android_hyphenationFrequency="normal">
      {props.t ? i18n(props.t, props.values) : props.children}
      {/** Fix for android font issues https://github.com/facebook/react-native/issues/15114 */}
      {Platform.OS == "android" ? " " : undefined}
    </Text>
  );
}
