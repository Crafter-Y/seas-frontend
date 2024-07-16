import React, { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";
import { Color } from "@/helpers/Constants";

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
          cursor: "pointer",
        },
        style
      )}
      onPress={onPress}
    >
      {Object.keys(children as object).includes("type") && children}
      {!Object.keys(children as object).includes("type") && (
        <Text style={tw`text-white text-lg`}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
