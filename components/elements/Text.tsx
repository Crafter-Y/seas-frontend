import { Text as RNText, TextProps } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  t?: string;
  values?: {
    [name: string]: string;
  };
} & TextProps;

export default function Text(props: Props) {
  const { t: i18n } = useTranslation();

  return (
    <RNText {...props}>
      {props.t ? i18n(props.t, props.values) : props.children}
    </RNText>
  );
}
