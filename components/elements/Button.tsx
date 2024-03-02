import React, { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  color?: string;
  style?: ClassInput;
};

const Button = ({ children, onPress, color, style }: Props) => {
  return (
    <TouchableOpacity
      style={tw.style(
        "rounded-xl px-4 py-3 flex items-center justify-center",
        {
          backgroundColor: color ? color : "#3882d6",
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
