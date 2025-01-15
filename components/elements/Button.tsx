import React, { ReactNode } from "react";
import { Platform, TouchableOpacity } from "react-native";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";
import { Color } from "@/helpers/Constants";
import CustomText from "./CustomText";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  color?: string;
  style?: ClassInput;
  disabled?: boolean;
};

const Button = ({
  children,
  onPress,
  color,
  style,
  disabled = false,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={tw.style(
        "rounded-xl px-4 py-3 flex items-center justify-center",
        {
          backgroundColor: disabled ? Color.GRAY : color ?? Color.BLUE,
          cursor: disabled ? "not-allowed" : "pointer",
        },
        style
      )}
      onPress={onPress}
    >
      {Object.keys(children as object).includes("type") && children}
      {!Object.keys(children as object).includes("type") && (
        <CustomText style={tw`text-white text-lg`}>
          {children}
          {/** Fix for android font issues https://github.com/facebook/react-native/issues/15114 */}
          {Platform.OS == "android" ? " " : undefined}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default Button;
